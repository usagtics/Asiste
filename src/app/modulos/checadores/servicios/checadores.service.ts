const BASE_URL = "https://localhost:7097/api/catalogos";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const ChecadoresService = {
  obtenerTodos: async () => {
    const res = await fetch(`${BASE_URL}/admin/checadores?incluirInactivos=true`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener los checadores");
    const data = await res.json();
    return data.elementos || data;
  },

  guardar: async (datos: any, idActual?: string | null) => {
    const url = idActual 
      ? `${BASE_URL}/admin/checadores/${idActual}`
      : `${BASE_URL}/admin/checadores`;
    
    const method = idActual ? "PUT" : "POST";

    const carga = {
      NombreChecador: datos.nombreChecador.trim(),
      NumeroSerie: datos.numeroSerie.trim(),
      IpDispositivo: datos.ipDispositivo.trim() || null,
      Ubicacion: datos.ubicacion.trim() || null,
      Activo: datos.activo
    };

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(carga)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error al guardar el checador");
    }
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  },

  desactivar: async (id: string) => {
    const res = await fetch(`${BASE_URL}/admin/checadores/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al desactivar el checador");
    return true;
  },

  reactivar: async (id: string) => {
    const res = await fetch(`${BASE_URL}/admin/checadores/${id}/reactivar`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al reactivar el checador");
    return true;
  }
};