/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** La carga el middleware en las rutas del panel; afuera queda sin definir. */
    adminSession?: import('./lib/admin-auth').AdminSession;
  }
}
