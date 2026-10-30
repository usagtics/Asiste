export interface DiaFestivo {
  id: string;
  fecha: string;
  descripcion: string;
  esLaborable: boolean;
  activo: boolean;
}

export interface DiaFestivoFormData {
  fecha: string;
  descripcionFestividad: string;
  esLaborable: boolean;
  activo: boolean;
}