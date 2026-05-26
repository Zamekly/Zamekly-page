// ─── Tipo de permisos ─────────────────────────────────────────────────────────

export type Permisos = {
  ver_vista_general:    boolean;
  ver_bloques:          boolean;
  ver_alertas:          boolean;
  ver_objetos_perdidos: boolean;
  ver_ingresos:         boolean;
  ver_usuarios:         boolean;
  ver_configuracion:    boolean;
  ver_emails_usuarios:  boolean;
  gestionar_roles:      boolean;
};

// ─── Permisos vacíos (usuario sin rol) ────────────────────────────────────────

export const DEFAULT_PERMISOS: Permisos = {
  ver_vista_general:    false,
  ver_bloques:          false,
  ver_alertas:          false,
  ver_objetos_perdidos: false,
  ver_ingresos:         false,
  ver_usuarios:         false,
  ver_configuracion:    false,
  ver_emails_usuarios:  false,
  gestionar_roles:      false,
};

// ─── Permisos totales (Propietario) ───────────────────────────────────────────

export const FULL_PERMISOS: Permisos = {
  ver_vista_general:    true,
  ver_bloques:          true,
  ver_alertas:          true,
  ver_objetos_perdidos: true,
  ver_ingresos:         true,
  ver_usuarios:         true,
  ver_configuracion:    true,
  ver_emails_usuarios:  true,
  gestionar_roles:      true,
};

// ─── Metadatos de cada permiso para la UI ─────────────────────────────────────

export const PERMISOS_META: {
  key: keyof Permisos;
  label: string;
  descripcion: string;
  soloPropietario?: boolean;
}[] = [
  {
    key: "ver_vista_general",
    label: "Vista general",
    descripcion: "Acceso al resumen del dashboard",
  },
  {
    key: "ver_bloques",
    label: "Bloques",
    descripcion: "Ver y gestionar bloques de taquillas",
  },
  {
    key: "ver_alertas",
    label: "Alertas",
    descripcion: "Ver alertas del sistema",
  },
  {
    key: "ver_objetos_perdidos",
    label: "Objetos perdidos",
    descripcion: "Ver objetos olvidados en taquillas",
  },
  {
    key: "ver_ingresos",
    label: "Ingresos",
    descripcion: "Ver estadísticas de ingresos",
  },
  {
    key: "ver_usuarios",
    label: "Usuarios",
    descripcion: "Ver la lista de usuarios del panel",
  },
  {
    key: "ver_configuracion",
    label: "Configuración",
    descripcion: "Ver y editar configuración de cuenta",
  },
  {
    key: "ver_emails_usuarios",
    label: "Ver emails de usuarios",
    descripcion: "Puede revelar los correos electrónicos en la sección Usuarios",
  },
  {
    key: "gestionar_roles",
    label: "Gestionar roles",
    descripcion: "Crear roles y asignarlos a usuarios",
    soloPropietario: true,
  },
];

// ─── Tipo de rol (devuelto por la API) ────────────────────────────────────────

export type Rol = {
  id: string;
  nombre: string;
  permisos: Permisos;
  es_propietario: boolean;
  created_at: string;
};
