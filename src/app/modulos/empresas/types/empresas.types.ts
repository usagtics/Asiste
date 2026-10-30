export interface Empresa {
  id: string;
  razonSocial: string;
  nombreComercial: string;
  rfc: string;
  codigoPostalExpedicion: string;
  idRegimenFiscal: string;
  activo: boolean;
}

export interface EmpresaFormData {
  razonSocial: string;
  nombreComercial: string;
  rfc: string;
  codigoPostalExpedicion: string;
  idRegimenFiscal: string;
  activo: boolean;
}