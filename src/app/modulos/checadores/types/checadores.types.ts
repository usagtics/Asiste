export interface Checador {
  id: string;
  nombre: string;
  numeroSerie: string;
  ipDispositivo: string;
  ubicacion: string;
  activo: boolean;
}

export interface ChecadorFormData {
  nombreChecador: string;
  numeroSerie: string;
  ipDispositivo: string;
  ubicacion: string;
  activo: boolean;
}