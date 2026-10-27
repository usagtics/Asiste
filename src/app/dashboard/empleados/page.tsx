"use client";

import { useState, useEffect } from "react";

interface Empleado {
  id: string;
  nombre: string;
  email: string;
  curp: string;
  rfc: string;
  idChecador: string;
  departamento: string;
  rol: string;
  estado: string;
}

export default function EmpleadosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [empleadosData, setEmpleadosData] = useState<Empleado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [departamentosList, setDepartamentosList] = useState<any[]>([]);
  const [perfilesList, setPerfilesList] = useState<any[]>([]);
  const [reglasList, setReglasList] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEmpleadoActual, setIdEmpleadoActual] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [curp, setCurp] = useState("");
  const [rfc, setRfc] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [telefono, setTelefono] = useState("");
  const [idEmpresa, setIdEmpresa] = useState("1");
  const [idDepartamento, setIdDepartamento] = useState("");
  const [idPerfil, setIdPerfil] = useState("");
  const [idPuesto, setIdPuesto] = useState("");
  const [idCampus, setIdCampus] = useState("");
  const [idJefeDirecto, setIdJefeDirecto] = useState("");
  const [numeroChecador, setNumeroChecador] = useState("");
  const [matricula, setMatricula] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [extensionTelefono, setExtensionTelefono] = useState("");
  const [avisoPrivacidadBiometricos, setAvisoPrivacidadBiometricos] = useState(true);
  const [idRolAcceso, setIdRolAcceso] = useState("");

  const [errorInput, setErrorInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRole = 'admin'; 

const fetchEmpleados = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7097/api/empleados", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const listaEmpleados = data.elementos || data; 
        
        if (listaEmpleados.length > 0) {
          console.log("Objeto crudo del empleado desde la API:", listaEmpleados[0]);
        }

        const empleadosFormateados = listaEmpleados.map((emp: any) => ({
          id: (emp.matricula ?? emp.idEmpleado ?? "").toString(),
          nombre: emp.nombreCompleto ?? `${emp.nombre ?? ""} ${emp.apellidoPaterno ?? ""}`.trim(),
          email: emp.correoElectronico ?? emp.correo ?? emp.email ?? emp.correoPersonal ?? "Sin correo",
          curp: emp.curp ?? emp.cURP ?? "N/A",
          rfc: emp.rfc ?? emp.rFC ?? "N/A",
          idChecador: emp.numeroChecador ?? emp.idChecador ?? "N/A",
          departamento: emp.departamento ?? "Sin departamento",
          rol: emp.perfil ?? emp.puesto ?? "Sin perfil",
          estado: emp.estatus ?? "Activo",
          rawId: emp.idEmpleado ?? emp.id
        }));
        setEmpleadosData(empleadosFormateados);
      }
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCatalogos = async () => {
    const token = localStorage.getItem("token");
    const headers = { "Authorization": `Bearer ${token}` };

    try {
      const resDep = await fetch("https://localhost:7097/api/catalogos/admin/departamentos?incluirInactivos=false", { headers });
      if (resDep.ok) setDepartamentosList(await resDep.json());

      const resPer = await fetch("https://localhost:7097/api/catalogos/admin/perfiles", { headers });
      if (resPer.ok) setPerfilesList(await resPer.json());

      const resReg = await fetch("https://localhost:7097/api/catalogos/admin/reglas-asistencia", { headers });
      if (resReg.ok) setReglasList(await resReg.json());
    } catch (error) {
      console.error("Error cargando catálogos:", error);
    }
  };

  useEffect(() => {
    fetchEmpleados();
    fetchCatalogos();
  }, []);

const guardarEmpleado = async () => {
    setErrorInput("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      
      const url = modoEdicion && idEmpleadoActual 
        ? `https://localhost:7097/api/empleados/${idEmpleadoActual}`
        : "https://localhost:7097/api/empleados";
      
      const method = modoEdicion ? "PUT" : "POST";
      console.log(`Enviando petición ${method} a:`, url);

      const bodyData = {
        nombre: nombre.trim(),
        apellidoPaterno: apellidoPaterno.trim(),
        apellidoMaterno: apellidoMaterno.trim() || null,
        curp: curp.trim().toUpperCase() || null,
        rfc: rfc.trim().toUpperCase() || null,
        correoElectronico: correoElectronico.trim() || null,
        telefono: telefono.trim() || null,
        idEmpresa: idEmpresa ? parseInt(idEmpresa) : 1,
        idDepartamento: idDepartamento ? parseInt(idDepartamento) : null,
        idPerfil: idPerfil ? parseInt(idPerfil) : null,
        idPuesto: idPuesto ? parseInt(idPuesto) : null,
        idCampus: idCampus ? parseInt(idCampus) : null,
        idJefeDirecto: idJefeDirecto ? parseInt(idJefeDirecto) : null,
        numeroChecador: numeroChecador.trim() || null,
        matricula: matricula.trim() || null,
        fechaIngreso: fechaIngreso || null,
        extensionTelefono: extensionTelefono.trim() || null,
        avisoPrivacidadBiometricos: avisoPrivacidadBiometricos,
        idRolAcceso: idRolAcceso ? parseInt(idRolAcceso) : null,
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      if (response.ok) {
        limpiarFormulario();
        setIsDrawerOpen(false);
        fetchEmpleados();
      } else {
        const errorText = await response.text();
        setErrorInput(errorText || `Error del servidor (Código: ${response.status})`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setErrorInput("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };
const abrirModalEdicion = async (empId: any) => {
    console.log("Abriendo edición para el ID:", empId);
    if (!empId) {
      alert("Error: El ID del empleado es inválido.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7097/api/empleados/${empId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Datos recibidos para editar:", data);
        setModoEdicion(true);
        setIdEmpleadoActual(empId);
        
        // Mapeo seguro de campos
        setNombre(data.nombre ?? "");
        setApellidoPaterno(data.apellidoPaterno ?? "");
        setApellidoMaterno(data.apellidoMaterno ?? "");
        setCurp(data.curp ?? "");
        setRfc(data.rfc ?? "");
        setCorreoElectronico(data.correoElectronico ?? data.correo ?? "");
        setTelefono(data.telefono ? data.telefono.toString() : "");
        setMatricula(data.matricula ? data.matricula.toString() : "");
        setNumeroChecador(data.numeroChecador ? data.numeroChecador.toString() : "");
        setIdDepartamento(data.idDepartamento?.toString() ?? "");
        setIdPerfil(data.idPerfil?.toString() ?? "");
        setIdRolAcceso(data.idRolAcceso?.toString() ?? "");
        setFechaIngreso(data.fechaIngreso ? data.fechaIngreso.split('T')[0] : "");
        setAvisoPrivacidadBiometricos(data.avisoPrivacidadBiometricos ?? true);
        
        setActiveStep(1);
        setIsDrawerOpen(true);
      } else {
        console.error("Error al obtener el empleado. Código:", response.status);
      }
    } catch (error) {
      console.error("Error de red al consultar el empleado:", error);
    }
  };
  const limpiarFormulario = () => {
    setNombre("");
    setApellidoPaterno("");
    setApellidoMaterno("");
    setCurp("");
    setRfc("");
    setCorreoElectronico("");
    setTelefono("");
    setIdEmpresa("1");
    setIdDepartamento("");
    setIdPerfil("");
    setIdPuesto("");
    setIdCampus("");
    setIdJefeDirecto("");
    setNumeroChecador("");
    setMatricula("");
    setFechaIngreso("");
    setExtensionTelefono("");
    setAvisoPrivacidadBiometricos(true);
    setIdRolAcceso("");
    setModoEdicion(false);
    setIdEmpleadoActual(null);
    setActiveStep(1);
    setErrorInput("");
  };

  const filteredEmpleados = empleadosData.filter((empleado) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      empleado.nombre.toLowerCase().includes(searchLower) ||
      empleado.id.toLowerCase().includes(searchLower) ||
      empleado.email.toLowerCase().includes(searchLower) ||
      empleado.curp.toLowerCase().includes(searchLower) ||
      empleado.rfc.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up relative">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-usagBlue dark:text-white tracking-tight transition-colors">Directorio de Empleados</h1>
          <p className="text-usagBlue/60 dark:text-blue-200/70 text-sm font-medium tracking-wide transition-colors">
            Gestiona la información, roles y estatus del personal.
          </p>
        </div>
        
        {userRole === 'admin' && (
          <button 
            onClick={() => { limpiarFormulario(); setIsDrawerOpen(true); }}
            className="bg-linear-to-r from-usagBlue to-[#2f457d] text-white px-6 py-2.5 rounded-xl font-bold tracking-wide text-sm shadow-[0_8px_20px_-6px_rgba(38,56,102,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(38,56,102,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Empleado
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-usagBlue/5 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 dark:text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Buscar por nombre, matrícula, CURP o RFC..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-usagBlue dark:focus:border-blue-500 focus:ring-1 focus:ring-usagBlue dark:focus:ring-blue-500 transition-all text-gray-700 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px] relative">
          {isLoading && (
             <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-usagBlue dark:text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
             </div>
          )}

          {!isLoading && filteredEmpleados.length === 0 && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mb-3 opacity-50">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
               </svg>
               <p className="text-sm font-medium">No hay empleados registrados</p>
             </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-[0.65rem] uppercase tracking-widest text-usagBlue/50 dark:text-blue-200/50">
                <th className="px-6 py-4 font-bold">Empleado</th>
                <th className="px-6 py-4 font-bold">Matrícula / ID</th>
                <th className="px-6 py-4 font-bold">CURP / RFC</th>
                <th className="px-6 py-4 font-bold">Departamento / Rol</th>
                <th className="px-6 py-4 font-bold">Checador</th>
                <th className="px-6 py-4 font-bold">Estado</th>
                {userRole === 'admin' && <th className="px-6 py-4 font-bold text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredEmpleados.map((empleado, index) => (
                <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-usagBlue/5 dark:bg-blue-900/30 flex items-center justify-center text-usagBlue dark:text-blue-400 font-bold text-xs border border-usagBlue/10 dark:border-blue-800 shrink-0">
                        {empleado.nombre ? empleado.nombre.split(" ").map(n => n[0]).join("").substring(0, 2) : "US"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{empleado.nombre}</p>
                        <p className="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">{empleado.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md">{empleado.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{empleado.curp}</p>
                    <p className="text-[0.7rem] font-medium text-gray-500 dark:text-gray-400">{empleado.rfc}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{empleado.departamento}</p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{empleado.rol}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md">
                      {empleado.idChecador}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      empleado.estado === 'Activo' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' : 
                      empleado.estado === 'Inactivo' ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800' :
                      'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        empleado.estado === 'Activo' ? 'bg-emerald-500' : 
                        empleado.estado === 'Inactivo' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}></span>
                      {empleado.estado}
                    </span>
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => abrirModalEdicion((empleado as any).rawId)}
                          className="p-2 text-usagBlue/70 dark:text-blue-400 bg-usagBlue/5 dark:bg-blue-900/30 hover:text-usagBlue dark:hover:text-blue-300 hover:bg-usagBlue/10 dark:hover:bg-blue-900/50 rounded-lg transition-all border border-transparent hover:border-usagBlue/20 shadow-sm" 
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER PANEL */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div 
            className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          <div className="fixed inset-y-0 right-0 max-w-2xl w-full flex">
            <div className="w-full h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-slide-in-right border-l border-gray-100 dark:border-gray-800 relative">
              
              <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-xl font-extrabold text-usagBlue dark:text-white tracking-tight">
                    {modoEdicion ? "Editar Empleado" : "Registrar Nuevo Empleado"}
                  </h2>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest">Sistema Integral ASISTE</p>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <div className="flex items-center justify-between relative max-w-sm mx-auto">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -z-10"></div>
                  
                  {['Datos Personales', 'Asignación Laboral'].map((step, idx) => {
                    const stepNum = idx + 1;
                    const isActive = activeStep === stepNum;
                    const isCompleted = activeStep > stepNum;
                    
                    return (
                      <div key={step} className="flex flex-col items-center gap-2 bg-white dark:bg-gray-900 px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isActive ? 'bg-usagBlue dark:bg-blue-600 text-white shadow-md shadow-blue-900/20 scale-110' : 
                          isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                        }`}>
                          {isCompleted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                          ) : stepNum}
                        </div>
                        <span className={`text-[0.65rem] uppercase tracking-widest font-bold ${isActive ? 'text-usagBlue dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-gray-900">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  
                  {errorInput && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl font-semibold">
                      {errorInput}
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="space-y-6 animate-fade-in-up">
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">Información de Identidad</h3>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2 space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Nombre(s)</label>
                          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-usagBlue dark:focus:border-blue-500 transition-colors dark:text-white" placeholder="Ej. Juan Carlos" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Apellido Paterno</label>
                          <input type="text" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-usagBlue dark:focus:border-blue-500 transition-colors dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Apellido Materno</label>
                          <input type="text" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-usagBlue dark:focus:border-blue-500 transition-colors dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">CURP</label>
                          <input type="text" maxLength={18} value={curp} onChange={(e) => setCurp(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm uppercase focus:outline-none focus:border-usagBlue dark:focus:border-blue-500 transition-colors dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">RFC</label>
                          <input type="text" maxLength={13} value={rfc} onChange={(e) => setRfc(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm uppercase focus:outline-none focus:border-usagBlue dark:focus:border-blue-500 transition-colors dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Correo Electrónico</label>
                          <input type="email" value={correoElectronico} onChange={(e) => setCorreoElectronico(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-usagBlue dark:focus:border-blue-500 transition-colors dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Teléfono / Extensión</label>
                          <div className="flex gap-2">
                            <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-2/3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white" />
                            <input type="text" placeholder="Ext." value={extensionTelefono} onChange={(e) => setExtensionTelefono(e.target.value)} className="w-1/3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none dark:text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-6 animate-fade-in-up">
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">Datos Contractuales</h3>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Matrícula Institucional</label>
                          <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white" placeholder="Ej. 2026001" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Número Checador (Hikvision)</label>
                          <input type="text" value={numeroChecador} onChange={(e) => setNumeroChecador(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white font-mono" placeholder="Ej. 10045" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Departamento</label>
                          <select value={idDepartamento} onChange={(e) => setIdDepartamento(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white">
                            <option value="">Seleccionar Departamento...</option>
                            {departamentosList.map((dep: any) => (
                              <option key={dep.idDepartamento} value={dep.idDepartamento}>{dep.nombreDepartamento}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Perfil (Puesto)</label>
                          <select value={idPerfil} onChange={(e) => setIdPerfil(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white">
                            <option value="">Seleccionar Perfil...</option>
                            {perfilesList.map((per: any) => (
                              <option key={per.idPerfil ?? per.id} value={per.idPerfil ?? per.id}>{per.nombrePerfil ?? per.nombre}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Fecha de Ingreso</label>
                          <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Regla de Asistencia</label>
                          <select value={idRolAcceso} onChange={(e) => setIdRolAcceso(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white">
                            <option value="">Seleccionar Regla...</option>
                            {reglasList.map((reg: any) => (
                              <option key={reg.idReglaAsistencia ?? reg.id} value={reg.idReglaAsistencia ?? reg.id}>{reg.nombreRegla ?? reg.nombre}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2 flex items-center gap-3 mt-2">
                          <input type="checkbox" id="biometricos" checked={avisoPrivacidadBiometricos} onChange={(e) => setAvisoPrivacidadBiometricos(e.target.checked)} className="w-4 h-4 text-usagBlue rounded border-gray-300" />
                          <label htmlFor="biometricos" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                            Aviso de Privacidad Biométricos Firmado
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                </form>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 shrink-0 flex justify-between items-center">
                <button 
                  type="button"
                  onClick={() => activeStep > 1 ? setActiveStep(activeStep - 1) : setIsDrawerOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold tracking-wide text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {activeStep === 1 ? 'Cancelar' : 'Atrás'}
                </button>
                
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    if (activeStep < 2) {
                      setActiveStep(activeStep + 1);
                    } else {
                      guardarEmpleado();
                    }
                  }}
                  className="bg-usagBlue dark:bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold tracking-wide text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : activeStep === 2 ? 'Guardar Empleado' : 'Siguiente Paso'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}