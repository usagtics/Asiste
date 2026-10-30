"use client";
import { useState, useEffect, useMemo } from "react";
import { EmpleadosService } from "../servicios/empleados.service";
import { Empleado } from "../types/empleado.types";

export const useEmpleados = () => {
  const [empleadosData, setEmpleadosData] = useState<Empleado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorGlobal, setErrorGlobal] = useState("");

  const fetchEmpleados = async () => {
    try {
      setIsLoading(true);
      setErrorGlobal("");
      
      const listaEmpleados = await EmpleadosService.obtenerTodos();
      const elementos = listaEmpleados.elementos || listaEmpleados;
      
      const empleadosFormateados = elementos.map((emp: any) => {
        const numChec = emp.numeroChecador ?? emp.numero_checador ?? emp.idChecador ?? emp.id_checador;
        const estatusObj = emp.estatusLaboral ?? emp.estatus_laboral ?? emp.estatus ?? emp.estado;
        
        let descEstatus = "Activo";
        if (typeof estatusObj === 'object' && estatusObj !== null) {
          descEstatus = estatusObj.descripcion ?? estatusObj.nombre ?? "Activo";
        } else if (typeof estatusObj === 'string') {
          descEstatus = estatusObj;
        }

        return {
          id: (emp.matricula ?? emp.idEmpleado ?? emp.id_empleado ?? "").toString(),
          nombre: emp.nombreCompleto ?? emp.nombre_completo ?? `${emp.nombre ?? ""} ${emp.apellidoPaterno ?? emp.apellido_paterno ?? ""}`.trim(),
          email: emp.correoElectronico ?? emp.correo_electronico ?? emp.correo ?? emp.email ?? "Sin correo",
          curp: emp.curp ?? "N/A",
          rfc: emp.rfc ?? "N/A",
          idChecador: numChec !== undefined && numChec !== null && numChec !== "" ? numChec.toString() : "Sin checador",
          departamento: emp.departamento ?? "Sin departamento",
          puesto: emp.puesto ?? "Sin puesto",
          campus: emp.campus ?? "Sin campus",
          estado: descEstatus,
          rawId: emp.idEmpleado ?? emp.id_empleado ?? emp.id
        };
      });

      setEmpleadosData(empleadosFormateados);
    } catch (error: any) {
      console.error("Error al cargar empleados:", error);
      setErrorGlobal("No se pudieron cargar los empleados.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const filteredEmpleados = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return empleadosData.filter((empleado) =>
      empleado.nombre.toLowerCase().includes(searchLower) ||
      empleado.id.toLowerCase().includes(searchLower) ||
      empleado.email.toLowerCase().includes(searchLower) ||
      empleado.curp.toLowerCase().includes(searchLower) ||
      empleado.rfc.toLowerCase().includes(searchLower)
    );
  }, [empleadosData, searchTerm]);

  return {
    empleadosData: filteredEmpleados,
    isLoading,
    errorGlobal,
    searchTerm,
    setSearchTerm,
    refetchEmpleados: fetchEmpleados
  };
};