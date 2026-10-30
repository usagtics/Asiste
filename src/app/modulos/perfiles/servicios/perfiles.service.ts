const BASE_URL = "https://localhost:7097/api/catalogos";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const PerfilesService = {
  obtenerTodos: async () => {
    const res = await fetch(`${BASE_URL}/admin/perfiles?incluirInactivos=true`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al obtener los perfiles");
    const data = await res.json();
    return data;
  },

  guardar: async (datos: any, idActual?: string | null) => {
    const url = idActual 
      ? `${BASE_URL}/admin/perfiles/${idActual}`
      : `${BASE_URL}/admin/perfiles`;
    
    const method = idActual ? "PUT" : "POST";

    const carga = {
      NombrePerfil: datos.nombrePerfil.trim()
    };

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(carga)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error al guardar el perfil");
    }
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  },

  eliminar: async (id: string) => {
    const res = await fetch(`${BASE_URL}/admin/perfiles/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("No se pudo eliminar el perfil");
    return true;
  }
};