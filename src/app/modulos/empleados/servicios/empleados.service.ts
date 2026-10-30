
import { EmpleadoFormData } from "../types/empleado.types";

const BASE_URL = "https://localhost:7097/api";

const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const EmpleadosService = {

  obtenerTodos: async () => {
    const res = await fetch(`${BASE_URL}/empleados`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error("Error al cargar la lista de empleados");
    }

    return res.json();
  },

  obtenerPorId: async (id: string | number) => {
    const res = await fetch(`${BASE_URL}/empleados/${id}`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error("Error al consultar el empleado");
    }

    return res.json();
  },

  guardar: async (
    datos: Partial<EmpleadoFormData>,
    idActual?: string | null
  ) => {

    const url = idActual
      ? `${BASE_URL}/empleados/${idActual}`
      : `${BASE_URL}/empleados`;

    const carga = {
      nombre: datos.nombre,
      apellidoPaterno: datos.apellidoPaterno,
      apellidoMaterno: datos.apellidoMaterno || null,
curp: datos.curp?.trim() || "",
      rfc: datos.rfc || null,
      correoElectronico: datos.correoElectronico || null,
      telefono: datos.telefono || null,

      idEmpresa: Number(datos.idEmpresa || 1),
      idDepartamento: datos.idDepartamento
        ? Number(datos.idDepartamento)
        : 1,

      idPerfil: datos.idPerfil
        ? Number(datos.idPerfil)
        : 1,

      idPuesto: datos.idPuesto
        ? Number(datos.idPuesto)
        : null,

      idCampus: datos.idCampus
        ? Number(datos.idCampus)
        : null,

      idJefeDirecto: datos.idJefeDirecto
        ? Number(datos.idJefeDirecto)
        : null,

      numeroChecador: datos.numeroChecador
        ? Number(datos.numeroChecador)
        : null,

      matricula: datos.matricula || null,

      fechaIngreso: datos.fechaIngreso ||
        new Date().toISOString().split("T")[0],

      extensionTelefono: datos.extensionTelefono || null,

      avisoPrivacidadBiometricos: Boolean(
        datos.avisoPrivacidadBiometricos
      ),

      idRolAcceso: datos.idRolAcceso
        ? Number(datos.idRolAcceso)
        : null
    };


    const res = await fetch(url, {
      method: idActual ? "PUT" : "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(carga)
    });

    if (!res.ok) {
      const errorText = await res.text();

      console.error("Error de API al guardar empleado:", errorText);

      throw new Error(
        errorText || "Error al guardar el empleado"
      );
    }

    const text = await res.text();

    return text ? JSON.parse(text) : {};
  },

  desactivar: async (id: string | number) => {
    const res = await fetch(`${BASE_URL}/empleados/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error("Error al desactivar el empleado");
    }

    return res.ok;
  },

  reactivar: async (id: string | number) => {
    const res = await fetch(`${BASE_URL}/empleados/${id}/reactivar`, {
      method: "POST",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error("Error al reactivar el empleado");
    }

    return res.ok;
  },

  obtenerSueldos: async (id: string | number) => {
    const res = await fetch(`${BASE_URL}/empleados/${id}/sueldos`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error("Error al cargar sueldos");
    }

    return res.json();
  },

  guardarSueldo: async (id: string | number, datos: any) => {
    const res = await fetch(`${BASE_URL}/empleados/${id}/sueldos`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(datos)
    });

    if (!res.ok) {
      throw new Error("Error al guardar el sueldo");
    }

    return res.json();
  },

  obtenerVacaciones: async (id: string | number) => {
    const res = await fetch(`${BASE_URL}/vacaciones/${id}`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error("Error al cargar vacaciones");
    }

    return res.json();
  }

};
