"use client";
import { useState, useEffect } from "react";

interface Horario {
  idHistorialHorario: number;
  idEmpleado: number;
  diaSemana: number;
  horaEntrada: string;
  horaSalida: string;
  horaComidaInicio: string | null;
  horaComidaFin: string | null;
  idReglaAsistencia: number;
  regla: string;
  idMateria: number | null;
  materia: string | null;
  idPeriodo: number | null;
  periodo: string | null;
  fechaInicioVigencia: string;
  fechaFinVigencia: string | null;
}

const DIAS_SEMANA = [
  { id: 1, nombre: "Lunes", corto: "Lun" },
  { id: 2, nombre: "Martes", corto: "Mar" },
  { id: 3, nombre: "Miércoles", corto: "Mié" },
  { id: 4, nombre: "Jueves", corto: "Jue" },
  { id: 5, nombre: "Viernes", corto: "Vie" },
  { id: 6, nombre: "Sábado", corto: "Sáb" },
  { id: 7, nombre: "Domingo", corto: "Dom" }
];

export default function HorariosPage() {
  const [mounted, setMounted] = useState(false);
  const [horariosData, setHorariosData] = useState<Horario[]>([]);
  const [empleadosData, setEmpleadosData] = useState<any[]>([]);
  const [reglasData, setReglasData] = useState<any[]>([]);
  const [materiasData, setMateriasData] = useState<any[]>([]);
  const [periodosData, setPeriodosData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [soloVigentes, setSoloVigentes] = useState(true);
  const [empleadoFiltro, setEmpleadoFiltro] = useState<number | "">("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<number | null>(null);
  const [errorInput, setErrorInput] = useState("");
  const [idEmpleado, setIdEmpleado] = useState<number | "">("");
  const [diasSemana, setDiasSemana] = useState<number[]>([]);
  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [horaComidaInicio, setHoraComidaInicio] = useState("");
  const [horaComidaFin, setHoraComidaFin] = useState("");
  const [idReglaAsistencia, setIdReglaAsistencia] = useState<number | "">("");
  const [idMateria, setIdMateria] = useState<number | "">("");
  const [idPeriodo, setIdPeriodo] = useState<number | "">("");
  const [fechaInicioVigencia, setFechaInicioVigencia] = useState("");

  useEffect(() => {
    setMounted(true);
    fetchCatalogos();
  }, []);

  useEffect(() => {
    fetchHorarios();
  }, [soloVigentes, empleadoFiltro]);

  const fetchCatalogos = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };

      const [resEmp, resReglas, resMat, resPer] = await Promise.all([
        fetch("https://localhost:7097/api/empleados", { headers }).catch(() => null),
        fetch("https://localhost:7097/api/catalogos/admin/reglas-asistencia", { headers }).catch(() => null),
        fetch("https://localhost:7097/api/catalogos/admin/materias", { headers }).catch(() => null),
        fetch("https://localhost:7097/api/catalogos/admin/periodos-escolares", { headers }).catch(() => null)
      ]);

      if (resEmp?.ok) {
        const data = await resEmp.json();
        setEmpleadosData(data.elementos || data);
      }
      
      if (resReglas?.ok) {
        const data = await resReglas.json();
        setReglasData(data.elementos || data);
      }
      
      if (resMat?.ok) {
        const data = await resMat.json();
        setMateriasData(data.elementos || data);
      }
      
      if (resPer?.ok) {
        const data = await resPer.json();
        setPeriodosData(data.elementos || data);
      }
    } catch (error) {
      console.error("Error cargando catálogos:", error);
    }
  };

  const fetchHorarios = async () => {
    if (!empleadoFiltro) {
      setHorariosData([]);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7097/api/horarios?idEmpleado=${empleadoFiltro}&soloVigentes=${soloVigentes}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHorariosData(data.elementos || data);
      } else {
        setHorariosData([]);
      }
    } catch (error) {
      console.error("Error al cargar horarios:", error);
      setHorariosData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDia = (idDia: number) => {
    setDiasSemana(prev => 
      prev.includes(idDia) ? prev.filter(d => d !== idDia) : [...prev, idDia].sort()
    );
  };

  const reglaSeleccionada = reglasData.find(r => (r.idReglaAsistencia ?? r.id) === idReglaAsistencia);
  const esReglaDocente = reglaSeleccionada && (reglaSeleccionada.nombreRegla ?? reglaSeleccionada.nombre ?? "").toLowerCase().includes("docente");

  const limpiarParcial = () => {
    setDiasSemana([]); 
    setHoraEntrada(""); 
    setHoraSalida("");
    setIdMateria("");
    setErrorInput("");
  };

  const limpiarFormulario = () => {
    setIdEmpleado(""); setDiasSemana([]); setHoraEntrada(""); setHoraSalida("");
    setHoraComidaInicio(""); setHoraComidaFin(""); setIdReglaAsistencia("");
    setIdMateria(""); setIdPeriodo(""); setFechaInicioVigencia("");
    setErrorInput("");
  };

  const guardarHorario = async (e: React.FormEvent | React.MouseEvent, mantenerAbierto: boolean = false) => {
    e.preventDefault();
    setErrorInput("");

    if (!idEmpleado || diasSemana.length === 0 || !horaEntrada || !horaSalida || !idReglaAsistencia || !fechaInicioVigencia) {
      setErrorInput("Por favor selecciona al menos un día y llena todos los campos marcados con *.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      
      const peticiones = diasSemana.map(dia => {
        const bodyData = {
          idEmpleado: Number(idEmpleado),
          diaSemana: dia,
          horaEntrada: horaEntrada + (horaEntrada.split(':').length === 2 ? ':00' : ''),
          horaSalida: horaSalida + (horaSalida.split(':').length === 2 ? ':00' : ''),
          horaComidaInicio: (!esReglaDocente && horaComidaInicio) ? horaComidaInicio + (horaComidaInicio.split(':').length === 2 ? ':00' : '') : null,
          horaComidaFin: (!esReglaDocente && horaComidaFin) ? horaComidaFin + (horaComidaFin.split(':').length === 2 ? ':00' : '') : null,
          idReglaAsistencia: Number(idReglaAsistencia),
          idMateria: idMateria ? Number(idMateria) : null,
          idPeriodo: idPeriodo ? Number(idPeriodo) : null,
          fechaInicioVigencia
        };

        return fetch("https://localhost:7097/api/horarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(bodyData)
        });
      });

      const respuestas = await Promise.all(peticiones);
      const todosExitosos = respuestas.every(r => r.ok);

      if (todosExitosos) {
        if (mantenerAbierto) {
          limpiarParcial();
          alert("✓ Horario guardado con éxito. Puedes capturar el siguiente bloque.");
        } else {
          limpiarFormulario();
          setIsDrawerOpen(false);
        }
        
        if (Number(idEmpleado) === empleadoFiltro) {
          fetchHorarios();
        }
      } else {
        setErrorInput("Algunos días no se pudieron registrar correctamente. Revisa si hay choques de horario.");
        if (Number(idEmpleado) === empleadoFiltro) fetchHorarios();
      }
    } catch (error) {
      setErrorInput("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const terminarHorario = async (idHistorial: number) => {
    if (!window.confirm("¿Estás seguro de terminar la vigencia de este horario? Ya no aplicará para asistencias futuras.")) return;

    try {
      setIsActionLoading(idHistorial);
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7097/api/horarios/${idHistorial}/terminar`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        fetchHorarios();
      } else {
        alert("Error al terminar el horario: " + await response.text());
      }
    } catch (error) {
      alert("Error de conexión al intentar terminar el horario.");
    } finally {
      setIsActionLoading(null);
    }
  };

  if (!mounted) return <div className="w-full max-w-[96%] 2xl:max-w-[1600px] mx-auto min-h-[400px]"></div>;

  const inputStyle = "w-full bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 dark:text-white transition-all duration-300 ease-in-out hover:border-usagBlue/40 hover:shadow-sm focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-usagBlue/10 focus:border-usagBlue shadow-xs cursor-pointer";
  const labelStyle = "text-[0.7rem] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block ml-1";

  const getNombreDia = (idDia: number) => DIAS_SEMANA.find(d => d.id === idDia)?.nombre || `Día ${idDia}`;

  const filteredHorarios = horariosData.filter(item => {
    const searchString = `${item.idHistorialHorario} ${getNombreDia(item.diaSemana)}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (

    <div className="w-full max-w-[96%] 2xl:max-w-[1600px] mx-auto space-y-8 animate-fade-in-up relative">
      

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 transition-all">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-usagBlue to-[#2f457d] rounded-2xl flex items-center justify-center shadow-lg shadow-usagBlue/20 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Gestión de Horarios</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base font-medium tracking-wide">
              Administra turnos, bloques de materias y vigencias del personal.
            </p>
          </div>
        </div>
        <button 
          onClick={() => { limpiarFormulario(); setIsDrawerOpen(true); }}
          className="bg-gradient-to-r from-usagBlue to-[#2f457d] text-white px-8 py-3.5 rounded-xl font-bold tracking-wide text-sm shadow-lg shadow-usagBlue/25 hover:shadow-usagBlue/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Asignar Horario
        </button>
      </div>


      <div className="bg-white dark:bg-gray-800/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors flex flex-col min-h-[500px]">
        

        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row justify-between items-center gap-5 bg-gray-50/50 dark:bg-gray-800/50">
          
          <div className="relative w-full lg:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <select 
              value={empleadoFiltro} 
              onChange={(e) => setEmpleadoFiltro(e.target.value === "" ? "" : Number(e.target.value))} 
              className="w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-base font-bold text-usagBlue dark:text-blue-300 focus:outline-none focus:border-usagBlue focus:ring-4 focus:ring-usagBlue/10 transition-all cursor-pointer shadow-sm appearance-none truncate"
            >
              <option value="" disabled>Seleccionar empleado para buscar horarios...</option>
              {empleadosData.map(emp => (
                <option key={emp.idEmpleado ?? emp.id} value={emp.idEmpleado ?? emp.id}>
                  {emp.numNomina ? `[${emp.numNomina}] ` : ""}{emp.nombreCompleto ?? emp.nombre}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-usagBlue">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-center">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Buscar por día o ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-base focus:outline-none focus:border-usagBlue focus:ring-4 focus:ring-usagBlue/10 transition-all disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                disabled={!empleadoFiltro}
              />
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-gray-900 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:border-usagBlue/30">
              <input 
                type="checkbox" 
                checked={soloVigentes} 
                onChange={(e) => setSoloVigentes(e.target.checked)} 
                className="w-4 h-4 text-usagBlue bg-gray-100 border-gray-300 rounded focus:ring-usagBlue focus:ring-2 cursor-pointer"
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">Mostrar vigentes</span>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto relative flex-1 flex flex-col">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center transition-all">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-usagBlue animate-spin mb-3"></div>
              <p className="text-sm font-semibold text-usagBlue dark:text-blue-300 animate-pulse">Cargando horarios...</p>
            </div>
          )}

          {!isLoading && !empleadoFiltro && (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-80 hover:opacity-100 transition-opacity">
               <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-12 h-12 text-gray-400 dark:text-gray-500">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                 </svg>
               </div>
               <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Ningún empleado seleccionado</h3>
               <p className="text-base font-medium text-gray-500 mt-1 max-w-sm">Utiliza el buscador superior para seleccionar un empleado y visualizar o administrar sus horarios asignados.</p>
             </div>
          )}

          {!isLoading && empleadoFiltro && filteredHorarios.length === 0 && (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-80 hover:opacity-100 transition-opacity">
               <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-12 h-12 text-usagBlue/50 dark:text-blue-400/50">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                 </svg>
               </div>
               <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">No hay horarios registrados</h3>
               <p className="text-base font-medium text-gray-500 mt-1">Este empleado aún no tiene un turno o materia asignada en el sistema.</p>
               <button 
                 onClick={() => { limpiarFormulario(); setIsDrawerOpen(true); }}
                 className="mt-6 px-6 py-2.5 bg-usagBlue/10 text-usagBlue dark:text-blue-400 font-bold text-sm rounded-xl hover:bg-usagBlue hover:text-white transition-colors"
               >
                 Asignar su primer horario
               </button>
             </div>
          )}

          {empleadoFiltro && filteredHorarios.length > 0 && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-[0.7rem] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                  <th className="px-8 py-5">ID</th>
                  <th className="px-8 py-5">Día de la Semana</th>
                  <th className="px-8 py-5">Jornada (Entrada/Salida)</th>
                  <th className="px-8 py-5">Regla de Asistencia</th>
                  <th className="px-8 py-5 text-center">Periodo de Vigencia</th>
                  <th className="px-8 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filteredHorarios.map((item) => {
                  const isActivo = !item.fechaFinVigencia || new Date(item.fechaFinVigencia) > new Date();
                  
                  return (
                    <tr key={item.idHistorialHorario} className="hover:bg-blue-50/40 dark:hover:bg-gray-700/30 transition-all duration-200 group">
                      <td className="px-8 py-5 font-mono text-sm font-semibold text-gray-500 dark:text-gray-400">
                        #{item.idHistorialHorario}
                      </td>
                      <td className="px-8 py-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-sm font-bold text-usagBlue dark:text-blue-400 group-hover:border-usagBlue/30 transition-colors">
                          <span className="w-2 h-2 rounded-full bg-usagBlue/60 dark:bg-blue-500/60"></span>
                          {getNombreDia(item.diaSemana)}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                          <span>{item.horaEntrada.slice(0,5)}</span>
                          <span className="text-gray-300 dark:text-gray-600">→</span>
                          <span>{item.horaSalida.slice(0,5)}</span>
                        </div>
                        {item.horaComidaInicio && (
                          <div className="text-[0.75rem] font-bold text-amber-700 dark:text-amber-500 mt-2 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 px-2.5 py-1 rounded-md w-fit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Comida: {item.horaComidaInicio.slice(0,5)} a {item.horaComidaFin?.slice(0,5)}
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm font-bold text-gray-700 dark:text-gray-200">
                          {item.regla || `ID: ${item.idReglaAsistencia}`}
                        </div>
                        {item.materia && (
                          <div className="text-xs font-semibold text-usagBlue/80 dark:text-blue-300 mt-1.5 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md w-fit border border-blue-100 dark:border-blue-800/30">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                            {item.materia}
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                          isActivo 
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${isActivo ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                          {item.fechaInicioVigencia.split("T")[0]} {item.fechaFinVigencia ? ` al ${item.fechaFinVigencia.split("T")[0]}` : " (Actual)"}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {isActivo && (
                          <button 
                            onClick={() => terminarHorario(item.idHistorialHorario)}
                            disabled={isActionLoading === item.idHistorialHorario}
                            className="px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all border border-gray-200 hover:border-rose-200 dark:border-gray-700 dark:hover:border-rose-800/50 shadow-sm flex items-center justify-end gap-1.5 ml-auto opacity-0 group-hover:opacity-100 disabled:opacity-50 focus:opacity-100"
                            title="Cortar vigencia del horario"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            Terminar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div 
            className="absolute inset-0 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setIsDrawerOpen(false)}
          ></div>
          
          <div className="fixed inset-y-0 right-0 max-w-4xl w-full flex">
            <div className="w-full h-full bg-gray-50 dark:bg-gray-900 shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0 border-l border-gray-200 dark:border-gray-800">
              
              <div className="px-10 py-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-10 shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-usagBlue/10 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-usagBlue dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Asignación de Horario</h2>
                    <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Captura un nuevo bloque</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)} 
                  className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 relative">
                <form className="space-y-8 max-w-3xl mx-auto pb-10">
                  
                  {errorInput && (
                    <div className="p-5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm rounded-2xl font-bold flex items-start gap-3 shadow-sm animate-fade-in-up">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 shrink-0 mt-0.5 text-rose-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {errorInput}
                    </div>
                  )}

                  <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                    <h3 className="text-base font-extrabold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-4 flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center text-sm">1</span>
                      Datos del Empleado
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5 md:col-span-2">
                        <label className={labelStyle}>Empleado Seleccionado *</label>
                        <select value={idEmpleado} onChange={(e) => setIdEmpleado(Number(e.target.value))} className={inputStyle}>
                          <option value="" disabled>Seleccionar Empleado...</option>
                          {empleadosData.map((emp: any) => <option key={emp.idEmpleado ?? emp.id} value={emp.idEmpleado ?? emp.id}>{emp.numNomina ? `[${emp.numNomina}] ` : ""}{emp.nombreCompleto ?? emp.nombre}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className={labelStyle}>Regla de Asistencia *</label>
                        <select value={idReglaAsistencia} onChange={(e) => setIdReglaAsistencia(Number(e.target.value))} className={inputStyle}>
                          <option value="" disabled>Seleccionar Regla...</option>
                          {reglasData.map((reg: any) => (
                            <option key={reg.idReglaAsistencia ?? reg.id} value={reg.idReglaAsistencia ?? reg.id}>
                              {reg.nombreRegla ?? reg.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {esReglaDocente && (
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100/50 dark:border-blue-900/30 shadow-inner space-y-6 animate-fade-in-up">
                       <h3 className="text-base font-extrabold text-usagBlue dark:text-blue-300 border-b border-blue-100 dark:border-blue-800/30 pb-4 flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-usagBlue/10 dark:bg-blue-900/40 text-usagBlue dark:text-blue-300 flex items-center justify-center text-sm">🎓</span>
                        Asignación Académica
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className={labelStyle}>Materia a impartir *</label>
                          <select value={idMateria} onChange={(e) => setIdMateria(Number(e.target.value))} className={inputStyle}>
                            <option value="">Seleccionar Materia...</option>
                            {materiasData.map((m: any) => <option key={m.idMateria ?? m.id} value={m.idMateria ?? m.id}>{m.nombreMateria ?? m.materia}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className={labelStyle}>Periodo Escolar *</label>
                          <select value={idPeriodo} onChange={(e) => setIdPeriodo(Number(e.target.value))} className={inputStyle}>
                            <option value="">Seleccionar Periodo...</option>
                            {periodosData.map((p: any) => <option key={p.idPeriodo ?? p.id} value={p.idPeriodo ?? p.id}>{p.nombrePeriodo ?? p.descripcion ?? p.periodo}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
                    <h3 className="text-base font-extrabold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-4 flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center text-sm">2</span>
                      Días y Horarios del Turno
                    </h3>
                    
                    <div className="space-y-3">
                      <label className={labelStyle}>Selecciona los Días de la Semana *</label>
                      <div className="flex flex-wrap gap-3 pt-1">
                        {DIAS_SEMANA.map(dia => {
                          const seleccionado = diasSemana.includes(dia.id);
                          return (
                            <button
                              key={dia.id}
                              type="button"
                              onClick={() => toggleDia(dia.id)}
                              className={`px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 border ${
                                seleccionado 
                                ? 'bg-gradient-to-br from-usagBlue to-[#2f457d] text-white border-transparent shadow-md shadow-usagBlue/30 scale-[1.03] -translate-y-0.5' 
                                : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-usagBlue/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'
                              }`}
                            >
                              {dia.nombre}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                      <div className="space-y-1.5">
                        <label className={labelStyle}>Hora Entrada *</label>
                        <input type="time" value={horaEntrada} onChange={(e) => setHoraEntrada(e.target.value)} className={inputStyle} />
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelStyle}>Hora Salida *</label>
                        <input type="time" value={horaSalida} onChange={(e) => setHoraSalida(e.target.value)} className={inputStyle} />
                      </div>
                    </div>

                    {!esReglaDocente && (
                      <div className="grid grid-cols-2 gap-6 pt-5 border-t border-dashed border-gray-200 dark:border-gray-700 bg-amber-50/30 dark:bg-amber-900/5 -mx-8 px-8 pb-3">
                        <div className="space-y-1.5">
                          <label className={labelStyle}>Entrada Comida (Opcional)</label>
                          <input type="time" value={horaComidaInicio} onChange={(e) => setHoraComidaInicio(e.target.value)} className={inputStyle} />
                        </div>
                        <div className="space-y-1.5">
                          <label className={labelStyle}>Salida Comida (Opcional)</label>
                          <input type="time" value={horaComidaFin} onChange={(e) => setHoraComidaFin(e.target.value)} className={inputStyle} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                     <h3 className="text-base font-extrabold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-4 flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center text-sm">3</span>
                      Periodo de Aplicación
                    </h3>
                    <div className="space-y-1.5">
                      <label className={labelStyle}>Fecha de Inicio de Vigencia *</label>
                      <input type="date" value={fechaInicioVigencia} onChange={(e) => setFechaInicioVigencia(e.target.value)} className={inputStyle} />
                      <p className="text-xs font-semibold text-gray-400 mt-2 pl-1">El sistema tomará este horario como activo a partir del día seleccionado.</p>
                    </div>
                  </div>

                </form>
              </div>

              <div className="p-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                <button 
                  type="button" 
                  onClick={() => setIsDrawerOpen(false)} 
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold tracking-wide text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                
                <div className="flex w-full sm:w-auto gap-4">
                  <button 
                    type="button" 
                    disabled={isSubmitting} 
                    onClick={(e) => guardarHorario(e, true)}
                    className="flex-1 sm:flex-none bg-white dark:bg-gray-800 text-usagBlue dark:text-blue-400 border-2 border-usagBlue/20 dark:border-blue-900 px-8 py-3.5 rounded-xl font-bold text-sm shadow-sm hover:border-usagBlue hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Guardar y otro
                  </button>

                  <button 
                    type="button" 
                    disabled={isSubmitting} 
                    onClick={(e) => guardarHorario(e, false)}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-usagBlue to-[#2f457d] text-white px-10 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-usagBlue/25 hover:shadow-usagBlue/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Procesando...' : 'Finalizar Asignación'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}