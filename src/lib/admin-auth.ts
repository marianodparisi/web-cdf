import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import mysql from 'mysql2/promise';

const SESSION_COOKIE = 'cdf_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 8;

let pool: mysql.Pool | null = null;
let bootstrapped = false;

type AdminUserRow = {
  id: number;
  username: string;
  email: string | null;
  password_hash: string;
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

const getSessionSecret = () =>
  readEnv('AUTH_SECRET') || 'cdf-local-dev-auth-secret-change-in-production';

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
        'INSERT INTO admin_users (username, email, password_hash) VALUES (?, ?, ?)',
        [adminUsername, adminEmail, passwordHash]
      );
    }
  }

  bootstrapped = true;
};

export const authenticateAdmin = async (identifier: string, password: string) => {
  await ensureAdminSchema();

  const db = getPool();
  const [rows] = await db.execute<mysql.RowDataPacket[] & AdminUserRow[]>(
    'SELECT id, username, email, password_hash FROM admin_users WHERE username = ? OR email = ? LIMIT 1',
    [identifier, identifier]
  );

  const user = rows[0];
  if (!user) return null;

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) return null;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
};

export const getAdminSessionCookie = () => SESSION_COOKIE;

export const createAdminSessionValue = (username: string) => encodeSession(username);

export const verifyAdminSessionValue = (value?: string) => decodeSession(value);
