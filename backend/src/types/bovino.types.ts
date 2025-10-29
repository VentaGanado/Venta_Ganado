export interface Bovino {
  id: number;
  propietario_id: number;
  nombre?: string;
  raza: string;
  sexo: 'M' | 'F';
  edad?: number;
  peso?: number;
  ubicacion_municipio?: string;
  ubicacion_departamento?: string;
  estado_sanitario?: string;
  foto_principal?: string;
  registro_fecha?: Date;
  activo?: boolean;
  descripcion?: string;
}

export interface CrearBovinoDTO {
  nombre?: string;
  raza: string;
  sexo: 'M' | 'F';
  edad?: number;
  peso?: number;
  ubicacion_municipio?: string;
  ubicacion_departamento?: string;
  estado_sanitario?: string;
  descripcion?: string;
}

export interface ActualizarBovinoDTO {
  nombre?: string;
  raza?: string;
  sexo?: 'M' | 'F';
  edad?: number;
  peso?: number;
  ubicacion_municipio?: string;
  ubicacion_departamento?: string;
  estado_sanitario?: string;
  foto_principal?: string;
  descripcion?: string;
  activo?: boolean;
}

// Tipos para fotos
export interface BovinoFoto {
  id: number;
  bovino_id: number;
  ruta_foto: string;
  es_principal: boolean;
  fecha_subida: Date;
}

// Tipos para historial sanitario
export interface RegistroSanitario {
  id: number;
  bovino_id: number;
  fecha: Date;
  tipo_registro: string;
  descripcion?: string;
  veterinario?: string;
  costo?: number;
  fecha_registro: Date;
}

export interface CrearRegistroSanitarioDTO {
  fecha: Date;
  tipo_registro: string;
  descripcion?: string;
  veterinario?: string;
  costo?: number;
}

// Tipos para historial reproductivo
export interface RegistroReproductivo {
  id: number;
  bovino_id: number;
  fecha: Date;
  tipo_evento: string;
  descripcion?: string;
  resultado?: string;
  observaciones?: string;
  fecha_registro: Date;
}

export interface CrearRegistroReproductivoDTO {
  fecha: Date;
  tipo_evento: string;
  descripcion?: string;
  resultado?: string;
  observaciones?: string;
}

