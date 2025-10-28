export interface Publicacion {
  id: number;
  vendedor_id: number;
  bovino_id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  fecha_creacion: string;
  activo: boolean;
  
  // Relaciones
  bovino?: BovinoPublicado;
  vendedor?: VendedorInfo;
}

export interface BovinoPublicado {
  id: number;
  nombre?: string;
  raza: string;
  sexo: 'M' | 'F';
  edad: number;
  peso: number;
  descripcion?: string;
  foto_principal?: string;
  ubicacion_municipio?: string;
  ubicacion_departamento?: string;
  estado_sanitario?: string;
}

export interface VendedorInfo {
  id: number;
  nombre: string;
  apellidos?: string;
  email: string;
  telefono?: string;
  municipio?: string;
  departamento?: string;
  foto_perfil?: string;
}

export interface FiltrosMarketplace {
  raza?: string;
  sexo?: 'M' | 'F' | '';
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
}

export interface OrdenamientoMarketplace {
  campo: 'precio' | 'fecha_creacion' | 'relevancia';
  direccion: 'asc' | 'desc';
}

export interface PaginacionMarketplace {
  pagina: number;
  porPagina: number;
  total: number;
  totalPaginas: number;
}

export interface RespuestaMarketplace {
  publicaciones: Publicacion[];
  paginacion: PaginacionMarketplace;
}

export interface CrearPublicacionData {
  bovino_id: number;
  titulo: string;
  descripcion: string;
  precio: number;
}

export interface ActualizarPublicacionData {
  titulo?: string;
  descripcion?: string;
  precio?: number;
  activo?: boolean;
}
