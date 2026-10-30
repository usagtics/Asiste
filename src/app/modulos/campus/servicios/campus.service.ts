const BASE_URL = "https://localhost:7097/api/catalogos";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const CampusService = {
  obtenerTodos: async () => {
    const res = await fetch(`${BASE_URL}/admin/campus?incluirInactivos=true`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener los campus");
    const data = await res.json();
    return data.elementos || data;
  },

  obtenerEmpresas: async () => {
    const res = await fetch(`${BASE_URL}/empresas`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener las empresas");
    const data = await res.json();
    return data.elementos || data;
  },

  guardar: async (datos: any, idActual?: string | null) => {
    const url = idActual 
      ? `${BASE_URL}/admin/campus/${idActual}`
      : `${BASE_URL}/admin/campus`;
    
    const method = idActual ? "PUT" : "POST";

    const carga = {
      IdEmpresa: Number(datos.idEmpresa),
      Clave: datos.clave.trim(),
      NombreCampus: datos.nombreCampus.trim(),
      CalleNumero: datos.calleNumero.trim() || null,
      Ciudad: null,
      IdEstado: null,
      CodigoPostal: null,
      Telefono: null,
      OuDirectorio: null,
      Activo: datos.activo,
      IdUsuarioCreacion: 1
    };

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(carga)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error al guardar el campus");
    }
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  },

  desactivar: async (id: string) => {
    const res = await fetch(`${BASE_URL}/admin/campus/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al desactivar el campus");
    return true;
  },

  reactivar: async (id: string) => {
    const res = await fetch(`${BASE_URL}/admin/campus/${id}/reactivar`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al reactivar el campus");
    return true;
  }
};