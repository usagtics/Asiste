const BASE_URL = "https://localhost:7097/api/catalogos";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const EmpresasService = {
  obtenerTodas: async () => {
    const res = await fetch(`${BASE_URL}/admin/empresas?incluirInactivos=true`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener las empresas");
    const data = await res.json();
    return data.elementos || data;
  },

  obtenerRegimenes: async () => {
    const res = await fetch(`${BASE_URL}/regimenes-fiscales`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener regímenes fiscales");
    const data = await res.json();
    return data.elementos || data;
  },

  guardar: async (datos: any, idActual?: string | null) => {
    const url = idActual 
      ? `${BASE_URL}/admin/empresas/${idActual}`
      : `${BASE_URL}/admin/empresas`;
    
    const method = idActual ? "PUT" : "POST";

    const carga = {
      solicitud: {
        RazonSocial: datos.razonSocial.trim(),
        NombreComercial: datos.nombreComercial.trim() || datos.razonSocial.trim(),
        Rfc: datos.rfc.trim(),
        IdRegimenFiscal: parseInt(datos.idRegimenFiscal),
        CodigoPostalExpedicion: datos.codigoPostalExpedicion.trim() || "",
        DominioCorreo: null,
        OuDirectorio: null,
        NumeroCertificadoCsd: null,
        RutaCertificadoCsd: null,
        VigenciaCsd: null,
        ProveedorPac: null,
        SerieRecibos: null,
        Activo: datos.activo
      }
    };

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(carga)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error al guardar la empresa");
    }
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  },

  desactivar: async (id: string) => {
    const res = await fetch(`${BASE_URL}/admin/empresas/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al desactivar la empresa");
    return true;
  },

  reactivar: async (id: string) => {
    const res = await fetch(`${BASE_URL}/admin/empresas/${id}/reactivar`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al reactivar la empresa");
    return true;
  }
};