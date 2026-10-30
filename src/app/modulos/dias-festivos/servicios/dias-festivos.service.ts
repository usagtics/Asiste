const BASE_URL = "https://localhost:7097/api/catalogos";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const DiasFestivosService = {
  obtenerTodos: async () => {
    const res = await fetch(`${BASE_URL}/admin/dias-festivos?incluirInactivos=true`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener los días festivos");
    const data = await res.json();
    return data.elementos || data;
  },

  guardar: async (datos: any, idActual?: string | null) => {
    const url = idActual 
      ? `${BASE_URL}/admin/dias-festivos/${idActual}`
      : `${BASE_URL}/admin/dias-festivos`;
    
    const method = idActual ? "PUT" : "POST";

    const carga = {
      Fecha: datos.fecha,
      DescripcionFestividad: datos.descripcionFestividad.trim(),
      EsLaborable: datos.esLaborable,
      Activo: datos.activo
    };

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(carga)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error al guardar el día festivo");
    }
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  },

  desactivar: async (id: string) => {
    const res = await fetch(`${BASE_URL}/admin/dias-festivos/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al desactivar el día festivo");
    return true;
  },

  reactivar: async (id: string) => {
    const res = await fetch(`${BASE_URL}/admin/dias-festivos/${id}/reactivar`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al reactivar el día festivo");
    return true;
  }
};