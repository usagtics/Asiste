export interface Campus {
  id: string;
  clave: string;
  nombre: string;
  direccion: string;
  activo: boolean;
  idEmpresa: string;
}

export interface CampusFormData {
  idEmpresa: number | "";
  clave: string;
  nombreCampus: string;
  calleNumero: string;
  activo: boolean;
}