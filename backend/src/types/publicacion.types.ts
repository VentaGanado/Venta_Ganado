export interface Publicacion {
  id: number;
  vendedor_id: number;
  bovino_id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  fecha_creacion: Date;
  activo: boolean;
}

export interface CrearPublicacionDTO {
  bovino_id: number;
  titulo: string;
  descripcion: string;
  precio: number;
}

export interface ActualizarPublicacionDTO {
  titulo?: string;
  descripcion?: string;
  precio?: number;
  activo?: boolean;
}

export interface FiltrosPublicacion {
  raza?: string;
  sexo?: 'M' | 'F';
  edadMin?: number;
  edadMax?: number;
  pesoMin?: number;
  pesoMax?: number;
  precioMin?: number;
  precioMax?: number;
  municipio?: string;
  departamento?: string;
  vacunasAlDia?: boolean;
  busqueda?: string;
  ordenarPor?: 'precio' | 'fecha_creacion' | 'relevancia';
  direccion?: 'asc' | 'desc';
  pagina?: number;
  porPagina?: number;
}
