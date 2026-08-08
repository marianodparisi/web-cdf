import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import mysql from 'mysql2/promise';

const SESSION_COOKIE = 'cdf_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 8;

let pool: mysql.Pool | null = null;
let bootstrapped = false;

export type AdminRole = 'admin' | 'editor';

export interface AdminSession {
  username: string;
  role: AdminRole;
  sections: string[];
  expiresAt: number;
}

type AdminUserRow = {
  id: number;
  username: string;
  email: string | null;
  password_hash: string;
  role: AdminRole;
};

/** mysql2 devuelve DATETIME como `Date`, pero según el driver puede venir string. */
const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const readEnv = (name: string) => {
  const metaEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return metaEnv?.[name] ?? process.env[name];
};

const requiredEnv = (name: string) => {
  const value = readEnv(name);
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: requiredEnv('MYSQL_HOST'),
      port: Number(process.env.MYSQL_PORT || '3306'),
      database: requiredEnv('MYSQL_DATABASE'),
      user: requiredEnv('MYSQL_USER'),
      password: requiredEnv('MYSQL_PASSWORD'),
      waitForConnections: true,
      connectionLimit: 10,
    });
  }

  return pool;
};

/**
 * Sin fallback a propósito. Antes caía a una constante escrita en el código:
 * con esa cadena, que está publicada en el repo, cualquiera puede firmarse una
 * cookie de sesión válida para el usuario que quiera y entrar como admin sin
 * contraseña. Si falta la variable el panel no arranca, que es preferible a que
 * arranque abierto. El sitio público no se ve afectado: el middleware sólo
 * llega acá en /admin y /api/admin.
 */
const getSessionSecret = () => requiredEnv('AUTH_SECRET');

const createSessionSignature = (payload: string) =>
  crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('hex');

const encodeSession = (username: string) => {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
    })
  ).toString('base64url');

  return `${payload}.${createSessionSignature(payload)}`;
};

/**
 * La cookie solo dice quién sos y hasta cuándo. El rol y las secciones NO van
 * acá: se leen de MySQL en cada request del panel, así sacarle el acceso a
 * alguien tiene efecto al instante y no dentro de ocho horas.
 */
const decodeSession = (value?: string) => {
  if (!value) return null;

  const [payload, signature] = value.split('.');
  if (!payload || !signature) return null;
  if (createSessionSignature(payload) !== signature) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as {
      username: string;
      expiresAt: number;
    };

    if (!parsed.username || parsed.expiresAt < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
};

/** MySQL no tiene `ADD COLUMN IF NOT EXISTS`, así que se pregunta primero. */
const hasColumn = async (db: mysql.Pool, table: string, column: string) => {
  const [rows] = await db.execute<mysql.RowDataPacket[]>(
    `SELECT 1 FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1`,
    [table, column]
  );

  return rows.length > 0;
};

export const ensureAdminSchema = async () => {
  if (bootstrapped) return;

  const db = getPool();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(191) NOT NULL UNIQUE,
      email VARCHAR(191) NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  if (!(await hasColumn(db, 'admin_users', 'role'))) {
    await db.execute(
      `ALTER TABLE admin_users ADD COLUMN role VARCHAR(16) NOT NULL DEFAULT 'editor'`
    );
  }

  // Para saber si una cuenta se usó alguna vez. Un admin puede crear diez
  // accesos y no tener forma de ver cuáles quedaron sin estrenar.
  if (!(await hasColumn(db, 'admin_users', 'last_login_at'))) {
    await db.execute(`ALTER TABLE admin_users ADD COLUMN last_login_at DATETIME NULL`);
  }

  // Qué puede tocar cada editor. Un admin no necesita filas acá: llega a todo.
  await db.execute(`
    CREATE TABLE IF NOT EXISTS user_sections (
      user_id INT NOT NULL,
      section_key VARCHAR(64) NOT NULL,
      PRIMARY KEY (user_id, section_key),
      CONSTRAINT fk_user_sections_user FOREIGN KEY (user_id)
        REFERENCES admin_users (id) ON DELETE CASCADE
    )
  `);

  const adminUsername = readEnv('ADMIN_USERNAME');
  const adminEmail = readEnv('ADMIN_EMAIL') || null;
  const adminPassword = readEnv('ADMIN_PASSWORD');

  if (adminUsername && adminPassword) {
    const [rows] = await db.execute<mysql.RowDataPacket[]>(
      'SELECT id FROM admin_users WHERE username = ? LIMIT 1',
      [adminUsername]
    );

    if (rows.length === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await db.execute(
        `INSERT INTO admin_users (username, email, password_hash, role) VALUES (?, ?, ?, 'admin')`,
        [adminUsername, adminEmail, passwordHash]
      );
    }
  }

  // Las cuentas que ya existían antes de que hubiera roles quedaron en
  // 'editor' por el DEFAULT del ALTER, y sin secciones no pueden hacer nada.
  // Si no quedó ningún admin, se promueve al usuario del entorno: de lo
  // contrario el panel arranca sin nadie que pueda repartir accesos.
  const [adminCount] = await db.execute<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM admin_users WHERE role = 'admin'`
  );

  if (Number(adminCount[0]?.total ?? 0) === 0 && adminUsername) {
    const [promoted] = await db.execute<mysql.ResultSetHeader>(
      `UPDATE admin_users SET role = 'admin' WHERE username = ?`,
      [adminUsername]
    );

    if (promoted.affectedRows > 0) {
      console.log(`[admin] ${adminUsername} quedó como administrador.`);
    }
  }

  bootstrapped = true;
};

const readSections = async (db: mysql.Pool, userId: number) => {
  const [rows] = await db.execute<mysql.RowDataPacket[]>(
    'SELECT section_key FROM user_sections WHERE user_id = ?',
    [userId]
  );

  return rows.map((row) => String(row.section_key));
};

/** Busca por usuario o por email, que son las dos formas de entrar. */
const findAdminUser = async (identifier: string) => {
  await ensureAdminSchema();

  const [rows] = await getPool().execute<mysql.RowDataPacket[] & AdminUserRow[]>(
    'SELECT id, username, email, password_hash, role FROM admin_users WHERE username = ? OR email = ? LIMIT 1',
    [identifier, identifier]
  );

  return rows[0] ?? null;
};

export const authenticateAdmin = async (identifier: string, password: string) => {
  const user = await findAdminUser(identifier);
  if (!user) return null;

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) return null;

  // Dato de gestión, no parte de la autenticación: si falla, el login sigue.
  try {
    await getPool().execute('UPDATE admin_users SET last_login_at = NOW() WHERE id = ?', [user.id]);
  } catch (error) {
    console.error('[admin] no se pudo registrar el último ingreso:', error);
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role === 'admin' ? ('admin' as const) : ('editor' as const),
  };
};

/**
 * Cambio de contraseña hecho por la propia persona. Pide la actual a propósito:
 * la cookie sola no alcanza, porque una sesión olvidada abierta en un teléfono
 * ajeno no tiene que poder quedarse con la cuenta.
 */
export const changeOwnPassword = async (
  username: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await findAdminUser(username);
  if (!user) return 'not-found' as const;

  const matches = await bcrypt.compare(currentPassword, user.password_hash);
  if (!matches) return 'wrong-password' as const;

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await getPool().execute('UPDATE admin_users SET password_hash = ? WHERE id = ?', [
    passwordHash,
    user.id,
  ]);

  return 'ok' as const;
};

export interface AdminUser {
  id: number;
  username: string;
  email: string | null;
  role: AdminRole;
  sections: string[];
  /** `null` significa que la cuenta se creó y nunca se usó. */
  lastLoginAt: Date | null;
}

export const listAdminUsers = async (): Promise<AdminUser[]> => {
  await ensureAdminSchema();

  const db = getPool();
  const [users] = await db.execute<mysql.RowDataPacket[]>(
    'SELECT id, username, email, role, last_login_at FROM admin_users ORDER BY username'
  );
  const [sections] = await db.execute<mysql.RowDataPacket[]>(
    'SELECT user_id, section_key FROM user_sections'
  );

  return users.map((user) => ({
    id: Number(user.id),
    username: String(user.username),
    email: user.email ? String(user.email) : null,
    role: user.role === 'admin' ? 'admin' : 'editor',
    sections: sections
      .filter((section) => Number(section.user_id) === Number(user.id))
      .map((section) => String(section.section_key)),
    lastLoginAt: toDate(user.last_login_at),
  }));
};

export const createAdminUser = async (input: {
  username: string;
  email: string | null;
  password: string;
  role: AdminRole;
  sections: string[];
}) => {
  await ensureAdminSchema();

  const db = getPool();
  const passwordHash = await bcrypt.hash(input.password, 10);

  const [result] = await db.execute<mysql.ResultSetHeader>(
    'INSERT INTO admin_users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [input.username, input.email, passwordHash, input.role]
  );

  await replaceUserSections(result.insertId, input.sections);
  return result.insertId;
};

export const replaceUserSections = async (userId: number, sections: string[]) => {
  const db = getPool();
  await db.execute('DELETE FROM user_sections WHERE user_id = ?', [userId]);

  for (const section of sections) {
    await db.execute(
      'INSERT INTO user_sections (user_id, section_key) VALUES (?, ?)',
      [userId, section]
    );
  }
};

export const updateAdminUser = async (
  userId: number,
  input: { role: AdminRole; sections: string[]; password?: string }
) => {
  await ensureAdminSchema();

  const db = getPool();
  await db.execute('UPDATE admin_users SET role = ? WHERE id = ?', [input.role, userId]);

  if (input.password) {
    const passwordHash = await bcrypt.hash(input.password, 10);
    await db.execute('UPDATE admin_users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
  }

  // Las secciones se guardan también para un admin, aunque no las use: llega a
  // todo igual (`loadAdminSession` le devuelve `[]`). Antes se borraban, y si
  // más adelante volvía a editor reaparecía sin ningún acceso y sin registro de
  // lo que tenía asignado.
  await replaceUserSections(userId, input.sections);
};

export const deleteAdminUser = async (userId: number) => {
  await ensureAdminSchema();
  await getPool().execute('DELETE FROM admin_users WHERE id = ?', [userId]);
};

/** Cuántos admins quedan. Sirve para no borrar al último y quedar afuera. */
export const countAdmins = async () => {
  await ensureAdminSchema();

  const [rows] = await getPool().execute<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM admin_users WHERE role = 'admin'`
  );

  return Number(rows[0]?.total ?? 0);
};

export const getAdminSessionCookie = () => SESSION_COOKIE;

export const createAdminSessionValue = (username: string) => encodeSession(username);

/** Chequeo barato de firma y vencimiento. No dice nada de permisos. */
export const verifyAdminSessionValue = (value?: string) => decodeSession(value);

/**
 * Sesión completa para las rutas del panel: valida la cookie y trae rol y
 * secciones de la base. Devuelve null si el usuario ya no existe, con lo cual
 * borrar una cuenta también corta su sesión abierta.
 */
export const loadAdminSession = async (value?: string): Promise<AdminSession | null> => {
  const decoded = decodeSession(value);
  if (!decoded) return null;

  try {
    await ensureAdminSchema();

    const db = getPool();
    const [rows] = await db.execute<mysql.RowDataPacket[] & AdminUserRow[]>(
      'SELECT id, username, email, password_hash, role FROM admin_users WHERE username = ? LIMIT 1',
      [decoded.username]
    );

    const user = rows[0];
    if (!user) return null;

    const role = user.role === 'admin' ? ('admin' as const) : ('editor' as const);

    return {
      username: user.username,
      role,
      sections: role === 'admin' ? [] : await readSections(db, user.id),
      expiresAt: decoded.expiresAt,
    };
  } catch (error) {
    // Si MySQL no responde no se puede saber qué permisos tiene: se cierra.
    console.error('[admin] no se pudieron cargar los permisos de la sesión:', error);
    return null;
  }
};
