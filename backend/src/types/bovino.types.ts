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
