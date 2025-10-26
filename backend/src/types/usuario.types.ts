export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  municipio: string;
  departamento: string;
  foto_perfil?: string;
  fecha_registro: Date;
  activo: boolean;
}

export interface UsuarioRegistro {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
  municipio: string;
  departamento?: string;
}

export interface UsuarioLogin {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<Usuario, "password_hash" | "refresh_token">;
  accessToken: string;
  refreshToken: string;
}
