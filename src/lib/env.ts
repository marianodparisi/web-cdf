/**
 * Variables de entorno del servidor, leídas en cada pedido desde `process.env`.
 *
 * No usar `import.meta.env[name]` con una clave calculada: Vite no sabe qué
 * clave se va a pedir y copia el objeto entero dentro del build, con
 * AUTH_SECRET, ADMIN_PASSWORD y MYSQL_* adentro. Además esa copia gana sobre
 * `process.env`, así que rotar un secreto en Hostinger no tenía efecto hasta
 * recompilar.
 *
 * Ni siquiera `import.meta.env.DEV`: Astro lo resuelve inyectando el mismo
 * objeto con todas las variables (verificado en el build).
 *
 * En desarrollo local Vite no pasa el `.env` a `process.env`; lo carga Node en
 * tiempo de ejecución, sin copiarlo a ningún archivo y sin pisar lo que ya
 * esté definido. En Hostinger no hay `.env` y las variables vienen del panel.
 */
try {
  process.loadEnvFile?.('.env');
} catch {
  // Sin .env: normal en producción. Localmente, el panel no conecta.
}

export const readEnv = (name: string): string | undefined => process.env[name] || undefined;
