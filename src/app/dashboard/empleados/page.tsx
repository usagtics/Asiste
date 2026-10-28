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
  puesto: string;
  campus: string;
  estado: string;
  rawId: any;
}

export default function EmpleadosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [empleadosData, setEmpleadosData] = useState<Empleado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [departamentosList, setDepartamentosList] = useState<any[]>([]);
  const [perfilesList, setPerfilesList] = useState<any[]>([]);
  const [reglasList, setReglasList] = useState<any[]>([]);
  const [campusList, setCampusList] = useState<any[]>([]);
  const [puestosList, setPuestosList] = useState<any[]>([]);
  const [empleadosList, setEmpleadosList] = useState<any[]>([]);
  const [checadoresList, setChecadoresList] = useState<any[]>([]);
  const [estatusLaboralList, setEstatusLaboralList] = useState<any[]>([]);

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
  const [idEstatusLaboral, setIdEstatusLaboral] = useState("1");

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
        setEmpleadosList(listaEmpleados);

        const empleadosFormateados = listaEmpleados.map((emp: any) => {
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
      if (resDep.ok) {
        const dData = await resDep.json();
        setDepartamentosList(dData.elementos || dData);
      }

      const resPer = await fetch("https://localhost:7097/api/catalogos/admin/perfiles", { headers });
      if (resPer.ok) {
        const pData = await resPer.json();
        setPerfilesList(pData.elementos || pData);
      }

      const resReg = await fetch("https://localhost:7097/api/catalogos/admin/reglas-asistencia", { headers });
      if (resReg.ok) {
        const rData = await resReg.json();
        setReglasList(rData.elementos || rData);
      }

      const resCamp = await fetch("https://localhost:7097/api/catalogos/admin/campus?incluirInactivos=false", { headers });
      if (resCamp.ok) {
        const cData = await resCamp.json();
        setCampusList(cData.elementos || cData);
      }

      const resPue = await fetch("https://localhost:7097/api/catalogos/admin/puestos?incluirInactivos=false", { headers });
      if (resPue.ok) {
        const puData = await resPue.json();
        setPuestosList(puData.elementos || puData);
      }

      const resChec = await fetch("https://localhost:7097/api/catalogos/admin/checadores", { headers });
      if (resChec.ok) {
        const chData = await resChec.json();
        setChecadoresList(chData.elementos || chData);
      }

      const resEstatus = await fetch("https://localhost:7097/api/catalogos/estatus-laborales", { headers });
      if (resEstatus.ok) {
        const eData = await resEstatus.json();
        setEstatusLaboralList(eData.elementos || eData);
      }
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

      const estatusNum = idEstatusLaboral ? parseInt(idEstatusLaboral) : 1;
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
        numeroChecador: numeroChecador ? parseInt(numeroChecador) : null,
        matricula: matricula.trim() || null,
        fechaIngreso: fechaIngreso || null,
        extensionTelefono: extensionTelefono.trim() || null,
        avisoPrivacidadBiometricos: avisoPrivacidadBiometricos,
        idRolAcceso: idRolAcceso ? parseInt(idRolAcceso) : null,
        idEstatusLaboral: estatusNum,
        estatusLaboralId: estatusNum,
        id_estatus_laboral: estatusNum,
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
    if (!empId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7097/api/empleados/${empId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setModoEdicion(true);
        setIdEmpleadoActual(empId);
        
        setNombre(data.nombre ?? data.nombre_completo ?? "");
        setApellidoPaterno(data.apellidoPaterno ?? data.apellido_paterno ?? "");
        setApellidoMaterno(data.apellidoMaterno ?? data.apellido_materno ?? "");
        setCurp(data.curp ?? "");
        setRfc(data.rfc ?? "");
        setCorreoElectronico(data.correoElectronico ?? data.correo_electronico ?? data.correo ?? "");
        setTelefono(data.telefono ? data.telefono.toString() : "");
        setMatricula(data.matricula ? data.matricula.toString() : "");
        
        const numChecadorApi = data.numeroChecador ?? data.numero_checador ?? data.idChecador ?? data.id_checador;
        setNumeroChecador(numChecadorApi !== undefined && numChecadorApi !== null ? numChecadorApi.toString() : "");

        setIdDepartamento((data.idDepartamento ?? data.id_departamento)?.toString() ?? "");
        setIdPerfil((data.idPerfil ?? data.id_perfil)?.toString() ?? "");
        setIdPuesto((data.idPuesto ?? data.id_puesto)?.toString() ?? "");
        setIdCampus((data.idCampus ?? data.id_campus)?.toString() ?? "");
        setIdJefeDirecto((data.idJefeDirecto ?? data.id_jefe_directo)?.toString() ?? "");
        setIdRolAcceso((data.idRolAcceso ?? data.id_rol_acceso)?.toString() ?? "");
        
        const estatusApi = 
          data.id_estatus_laboral ?? 
          data.idEstatusLaboral ?? 
          data.estatusLaboralId ?? 
          data.estatus_laboral_id ?? 
          data.estatusLaboral?.id ?? 
          "1";
          
        setIdEstatusLaboral(estatusApi.toString());

        setFechaIngreso(data.fechaIngreso ?? data.fecha_ingreso ? (data.fechaIngreso ?? data.fecha_ingreso).split('T')[0] : "");
        setExtensionTelefono(data.extensionTelefono ?? data.extension_telefono ?? "");
        setAvisoPrivacidadBiometricos(data.avisoPrivacidadBiometricos ?? data.aviso_privacidad_biometricos ?? true);
        
        setActiveStep(1);
        setIsDrawerOpen(true);
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
    setIdEstatusLaboral("1");
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

  const inputStyle = "w-full bg-gray-50/50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 dark:text-white transition-all duration-300 ease-in-out hover:border-usagBlue/50 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-usagBlue/20 focus:border-usagBlue shadow-xs cursor-pointer";

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
              placeholder="Buscar por nombre, matrícula, CURP, RFC..." 
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
                <th className="px-6 py-4 font-bold">Depto. / Puesto / Campus</th>
                <th className="px-6 py-4 font-bold">Estado</th>
                {userRole === 'admin' && <th className="px-6 py-4 font-bold text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredEmpleados.map((empleado, index) => {
                const isActive = empleado.estado.toLowerCase() === 'activo';
                return (
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
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{empleado.puesto} • {empleado.campus}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isActive ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' : 
                        'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {empleado.estado}
                      </span>
                    </td>
                    {userRole === 'admin' && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => abrirModalEdicion(empleado.rawId)}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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
                          isActive ? 'bg-usagBlue dark:bg-blue-600 text-white shadow-md scale-110' : 
                          isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                        }`}>
                          {isCompleted ? '✓' : stepNum}
                        </div>
                        <span className={`text-[0.65rem] uppercase tracking-widest font-bold ${isActive ? 'text-usagBlue dark:text-blue-400' : 'text-gray-400'}`}>
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
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Nombre(s) *</label>
                          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputStyle} placeholder="Ej. Juan Carlos" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Apellido Paterno *</label>
                          <input type="text" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Apellido Materno</label>
                          <input type="text" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">CURP</label>
                          <input type="text" maxLength={18} value={curp} onChange={(e) => setCurp(e.target.value)} className={`${inputStyle} uppercase`} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">RFC</label>
                          <input type="text" maxLength={13} value={rfc} onChange={(e) => setRfc(e.target.value)} className={`${inputStyle} uppercase`} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Correo Electrónico</label>
                          <input type="email" value={correoElectronico} onChange={(e) => setCorreoElectronico(e.target.value)} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Teléfono / Extensión</label>
                          <div className="flex gap-2">
                            <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={`w-2/3 ${inputStyle}`} />
                            <input type="text" placeholder="Ext." value={extensionTelefono} onChange={(e) => setExtensionTelefono(e.target.value)} className={`w-1/3 ${inputStyle}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-6 animate-fade-in-up">
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">Datos Contractuales y Estructura</h3>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Matrícula Institucional</label>
                          <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} className={inputStyle} placeholder="Ej. 2026001" />
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Número Checador (Hikvision)</label>
                          <select 
                            value={numeroChecador} 
                            onChange={(e) => setNumeroChecador(e.target.value)} 
                            className={`${inputStyle} font-mono`}
                          >
                            <option value="">Seleccionar Número Checador...</option>
                            {checadoresList.map((ch: any) => {
                              const idCh = ch.idChecador ?? ch.id_checador ?? ch.numeroChecador ?? ch.numero_checador ?? ch.id;
                              const descCh = ch.nombreChecador ?? ch.descripcion ?? ch.nombre ?? `Checador #${idCh}`;
                              return (
                                <option key={idCh} value={idCh}>
                                  {idCh} - {descCh}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Departamento</label>
                          <select value={idDepartamento} onChange={(e) => setIdDepartamento(e.target.value)} className={inputStyle}>
                            <option value="">Seleccionar Departamento...</option>
                            {departamentosList.map((dep: any) => (
                              <option key={dep.idDepartamento ?? dep.id} value={dep.idDepartamento ?? dep.id}>{dep.nombreDepartamento ?? dep.descripcion}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Puesto</label>
                          <select value={idPuesto} onChange={(e) => setIdPuesto(e.target.value)} className={inputStyle}>
                            <option value="">Seleccionar Puesto...</option>
                            {puestosList.map((pue: any) => (
                              <option key={pue.idPuesto ?? pue.id} value={pue.idPuesto ?? pue.id}>{pue.nombrePuesto ?? pue.nombre}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Campus</label>
                          <select value={idCampus} onChange={(e) => setIdCampus(e.target.value)} className={inputStyle}>
                            <option value="">Seleccionar Campus...</option>
                            {campusList.map((cam: any) => (
                              <option key={cam.idCampus ?? cam.id} value={cam.idCampus ?? cam.id}>{cam.nombreCampus ?? cam.nombre}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Perfil de Usuario</label>
                          <select value={idPerfil} onChange={(e) => setIdPerfil(e.target.value)} className={inputStyle}>
                            <option value="">Seleccionar Perfil...</option>
                            {perfilesList.map((per: any) => (
                              <option key={per.idPerfil ?? per.id} value={per.idPerfil ?? per.id}>{per.nombrePerfil ?? per.nombre}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Jefe Directo</label>
                          <select value={idJefeDirecto} onChange={(e) => setIdJefeDirecto(e.target.value)} className={inputStyle}>
                            <option value="">Sin jefe directo (Opcional)</option>
                            {empleadosList.map((emp: any) => (
                              <option key={emp.idEmpleado ?? emp.id} value={emp.idEmpleado ?? emp.id}>{emp.nombreCompleto ?? `${emp.nombre} ${emp.apellidoPaterno}`}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Fecha de Ingreso</label>
                          <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className={inputStyle} />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Regla de Asistencia</label>
                          <select value={idRolAcceso} onChange={(e) => setIdRolAcceso(e.target.value)} className={inputStyle}>
                            <option value="">Seleccionar Regla...</option>
                            {reglasList.map((reg: any) => (
                              <option key={reg.idReglaAsistencia ?? reg.id} value={reg.idReglaAsistencia ?? reg.id}>{reg.nombreRegla ?? reg.nombre}</option>
                            ))}
                          </select>
                        </div>

                        {/* SELECTOR DE ESTATUS LABORAL ADAPTADO A LA BD */}
                        <div className="space-y-1.5">
                          <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Estatus Laboral</label>
                          <select value={idEstatusLaboral} onChange={(e) => setIdEstatusLaboral(e.target.value)} className={inputStyle}>
                            <option value="">Seleccionar Estatus...</option>
                            {estatusLaboralList.map((est: any) => {
                              const idEst = est.id_estatus_laboral ?? est.id ?? est.idEstatusLaboral;
                              const descEst = est.descripcion ?? est.clave;
                              return (
                                <option key={idEst} value={idEst}>
                                  {descEst}
                                </option>
                              );
                            })}
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