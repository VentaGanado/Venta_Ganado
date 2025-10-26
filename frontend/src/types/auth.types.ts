export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  municipio: string;
  departamento: string;
  foto_perfil?: string;
  fecha_registro: string;
  activo: boolean;
}

export interface RegistroData {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
  municipio: string;
  departamento?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Usuario;
  accessToken: string;
  refreshToken: string;
}
