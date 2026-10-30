export interface Empleado {
  id: string;
  nombre: string;
  email: string;
  curp: string;
  rfc: string;
  idChecador: string;
  departamento: string;
  puesto: string;
  campus: string;
  estado: string;
  rawId: any;
  raw?: any; 
}

export interface EmpleadoFormData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  curp: string;
  rfc: string;
  correoElectronico: string;
  telefono: string;
  extensionTelefono?: string;
  idEmpresa: number;
  idDepartamento?: number | null;
  idPerfil?: number | null;
  idPuesto?: number | null;
  idCampus?: number | null;
  idJefeDirecto?: number | null;
  numeroChecador?: number | null;
  idModoChecada?: number | null;
  matricula: string;
  fechaIngreso: string;
  avisoPrivacidadBiometricos: boolean;
  idRolAcceso?: number | null;
  idEstatusLaboral: number;
  activo?: boolean;
}