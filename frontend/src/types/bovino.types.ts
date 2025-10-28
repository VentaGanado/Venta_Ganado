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
  registro_fecha?: string;
  activo?: boolean;
  descripcion?: string;
  
  // Campos legacy para compatibilidad
  codigo_interno?: string;
  fecha_nacimiento?: string;
  peso_actual?: number;
  valor_estimado?: number;
  estado?: 'Disponible' | 'En negociación' | 'Vendido' | 'Retirado';
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  fotografias?: Fotografia[];
  historial_sanitario?: RegistroSanitario[];
  historial_reproductivo?: RegistroReproductivo[];
}

export interface Fotografia {
  id: number;
  bovino_id: number;
  ruta_imagen: string;
  es_principal: boolean;
  orden: number;
}

export interface RegistroSanitario {
  id: number;
  tipo: 'Vacuna' | 'Desparasitación' | 'Diagnóstico' | 'Tratamiento';
  fecha_aplicacion: string;
  producto_usado?: string;
  dosis?: string;
  veterinario?: string;
  observaciones?: string;
}

export interface RegistroReproductivo {
  id: number;
  tipo: 'Parto' | 'Servicio' | 'Inseminación';
  fecha: string;
  detalles?: string;
  observaciones?: string;
}