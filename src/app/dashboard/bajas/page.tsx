"use client";
import { useState, useEffect } from "react";

interface BajaLaboral {
  id?: number;
  idBaja?: number;
  idEmpleado: number;
  idMotivoBaja: number;
  fechaBaja: string;
  montoFiniquitoCalculado?: number;
  estatusPago: string;
  idNominaFiniquito?: number;
  activo?: boolean;
  empleadoNombre?: string;
  motivoBajaNombre?: string;
}

export default function BajasLaboralesPage() {
  const [mounted, setMounted] = useState(false);
  
  const [bajasData, setBajasData] = useState<BajaLaboral[]>([]);
  const [empleadosData, setEmpleadosData] = useState<any[]>([]);
  const [motivosData, setMotivosData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idActual, setIdActual] = useState<number | null>(null);
  const [idEmpleado, setIdEmpleado] = useState<number | "">("");
  const [idMotivoBaja, setIdMotivoBaja] = useState<number | "">("");
  const [fechaBaja, setFechaBaja] = useState("");
  const [montoFiniquito, setMontoFiniquito] = useState<number | "">("");
  const [estatusPago, setEstatusPago] = useState("Pendiente");
  const [idNominaFiniquito, setIdNominaFiniquito] = useState<number | "">("");
  const [activo, setActivo] = useState(true);

  const [errorInput, setErrorInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchDatosEstructurales();
  }, []);

  const fetchDatosEstructurales = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      const [resBajas, resEmpleados, resMotivos] = await Promise.all([
        fetch("https://localhost:7097/api/bajas", { method: "GET", headers }),
        fetch("https://localhost:7097/api/empleados", { method: "GET", headers }),
        fetch("https://localhost:7097/api/catalogos/motivos-baja", { method: "GET", headers })
      ]);

      if (resBajas.ok) {
        const dataBajas = await resBajas.json();
        setBajasData(dataBajas.elementos || dataBajas);
      }
      if (resEmpleados.ok) {
        const dataEmpleados = await resEmpleados.json();
        setEmpleadosData(dataEmpleados.elementos || dataEmpleados);
      }
      if (resMotivos.ok) {
        const dataMotivos = await resMotivos.json();
        setMotivosData(dataMotivos.elementos || dataMotivos);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const guardarBaja = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorInput("");
    
    if (idEmpleado === "" || idMotivoBaja === "" || !fechaBaja || !estatusPago) {
      setErrorInput("Empleado, Motivo, Fecha de Baja y Estatus de Pago son obligatorios.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const url = modoEdicion && idActual !== null
        ? `https://localhost:7097/api/bajas/${idActual}`
        : "https://localhost:7097/api/bajas";
      
      const method = modoEdicion ? "PUT" : "POST";

      const bodyData = {
        idEmpleado: Number(idEmpleado),
        idMotivoBaja: Number(idMotivoBaja),
        fechaBaja: fechaBaja,
        montoFiniquitoCalculado: montoFiniquito === "" ? null : Number(montoFiniquito),
        estatusPago: estatusPago.trim(),
        idNominaFiniquito: idNominaFiniquito === "" ? null : Number(idNominaFiniquito),
        activo
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
        fetchDatosEstructurales();
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

  const calcularFiniquito = async (idBaja: number) => {
    if (!window.confirm("¿Deseas calcular el finiquito para esta baja?")) return;

    try {
      setIsActionLoading(idBaja);
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7097/api/bajas/${idBaja}/finiquito`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ fechaPago: new Date().toISOString().split("T")[0] })
      });

      if (response.ok) {
        alert("¡Finiquito calculado con éxito!");
        fetchDatosEstructurales();
      } else {
        const errorText = await response.text();
        alert(`Error al calcular: ${errorText}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setIsActionLoading(null);
    }
  };

  const marcarComoPagada = async (idBaja: number) => {
    if (!window.confirm("¿Deseas marcar esta baja como pagada?")) return;

    try {
      setIsActionLoading(idBaja);
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7097/api/bajas/${idBaja}/pagada`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchDatosEstructurales();
      } else {
        const errorText = await response.text();
        alert(`Error al marcar pagada: ${errorText}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setIsActionLoading(null);
    }
  };

  const abrirEdicion = (item: BajaLaboral) => {
    const idEncontrado = item.id ?? item.idBaja ?? null;
    setModoEdicion(true);
    setIdActual(idEncontrado);
    
    setIdEmpleado(item.idEmpleado ?? "");
    setIdMotivoBaja(item.idMotivoBaja ?? "");
    setFechaBaja(item.fechaBaja ? item.fechaBaja.split("T")[0] : "");
    setMontoFiniquito(item.montoFiniquitoCalculado ?? "");
    setEstatusPago(item.estatusPago || "Pendiente");
    setIdNominaFiniquito(item.idNominaFiniquito ?? "");
    setActivo(item.activo ?? true);

    setIsDrawerOpen(true);
  };

  const limpiarFormulario = () => {
    setIdEmpleado("");
    setIdMotivoBaja("");
    setFechaBaja("");
    setMontoFiniquito("");
    setEstatusPago("Pendiente");
    setIdNominaFiniquito("");
    setActivo(true);
    
    setModoEdicion(false);
    setIdActual(null);
    setErrorInput("");
  };

  if (!mounted) {
    return <div className="max-w-7xl mx-auto space-y-8 min-h-[400px]"></div>;
  }

  const inputStyle = "w-full bg-gray-50/50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 dark:text-white transition-all focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-usagBlue/20 focus:border-usagBlue shadow-xs";
  const labelStyle = "text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest";

  const filteredBajas = bajasData.filter((item) => {
    const empleado = empleadosData.find(e => e.id === item.idEmpleado || e.idEmpleado === item.idEmpleado);
    const searchString = `${item.idBaja} ${empleado?.nombreCompleto || item.empleadoNombre}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up relative">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-usagBlue dark:text-white tracking-tight">Bajas Laborales</h1>
          <p className="text-usagBlue/60 dark:text-blue-200/70 text-sm font-medium tracking-wide">
            Administración de separaciones, finiquitos y estatus de pago.
          </p>
        </div>
        
        <button 
          onClick={() => { limpiarFormulario(); setIsDrawerOpen(true); }}
          className="bg-linear-to-r from-usagBlue to-[#2f457d] text-white px-6 py-2.5 rounded-xl font-bold tracking-wide text-sm shadow-[0_8px_20px_-6px_rgba(38,56,102,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(38,56,102,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Registrar Baja
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-usagBlue/5 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Buscar por ID o empleado..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-usagBlue"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px] relative">
          {isLoading && (
             <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-usagBlue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
             </div>
          )}

          {!isLoading && filteredBajas.length === 0 && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
               <p className="text-sm font-medium">No hay bajas registradas</p>
             </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-[0.65rem] uppercase tracking-widest text-usagBlue/50">
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">Empleado</th>
                <th className="px-6 py-4 font-bold">Fecha Baja</th>
                <th className="px-6 py-4 font-bold">Finiquito</th>
                <th className="px-6 py-4 font-bold text-center">Estatus Pago</th>
                <th className="px-6 py-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredBajas.map((item, idx) => {
                const itemId = item.id ?? item.idBaja ?? idx + 1;
                const empleadoVinculado = empleadosData.find(e => e.idEmpleado === item.idEmpleado || e.id === item.idEmpleado);
                
                return (
                  <tr key={itemId} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-600 dark:text-gray-300">{itemId}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-100">
                      {item.empleadoNombre || empleadoVinculado?.nombreCompleto || `ID: ${item.idEmpleado}`}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                      {item.fechaBaja ? item.fechaBaja.split("T")[0] : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.montoFiniquitoCalculado 
                        ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.montoFiniquitoCalculado) 
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        item.estatusPago === 'Pagado' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : item.estatusPago === 'Pendiente' ? 'bg-amber-50 text-amber-600 border border-amber-100'
                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {item.estatusPago}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => itemId && calcularFiniquito(itemId)}
                          disabled={isActionLoading === itemId}
                          className="px-3 py-1.5 text-xs font-bold text-usagBlue bg-usagBlue/10 hover:bg-usagBlue/20 rounded-lg transition-all"
                          title="Calcular Finiquito"
                        >
                          Calcular
                        </button>

                        {item.estatusPago !== 'Pagado' && (
                          <button 
                            onClick={() => itemId && marcarComoPagada(itemId)}
                            disabled={isActionLoading === itemId}
                            className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all"
                            title="Marcar como Pagada"
                          >
                            Pagar
                          </button>
                        )}

                        <button 
                          onClick={() => abrirEdicion(item)}
                          className="p-2 text-usagBlue/70 bg-usagBlue/5 hover:bg-usagBlue/10 rounded-lg transition-all" 
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          
          <div className="fixed inset-y-0 right-0 max-w-2xl w-full flex">
            <div className="w-full h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col relative">
              
              <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-usagBlue dark:text-white">
                  {modoEdicion ? "Editar Baja Laboral" : "Registrar Baja Laboral"}
                </h2>
                <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-rose-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <form className="space-y-6" onSubmit={guardarBaja}>
                  {errorInput && <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl font-semibold border border-rose-100">{errorInput}</div>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    <div className="space-y-1.5 md:col-span-2">
                      <label className={labelStyle}>Empleado *</label>
                      <select 
                        value={idEmpleado} 
                        onChange={(e) => setIdEmpleado(e.target.value === "" ? "" : Number(e.target.value))} 
                        className={`${inputStyle} appearance-none`}
                        disabled={modoEdicion} 
                      >
                        <option value="" disabled>Selecciona un Empleado</option>
                        {empleadosData.map((emp) => {
                          const empId = emp.id ?? emp.idEmpleado ?? emp.empleadoId;
                          return (
                            <option key={empId} value={empId}>
                              {emp.numNomina ? `[${emp.numNomina}] ` : ""}{emp.nombreCompleto || emp.nombre}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className={labelStyle}>Motivo de la Baja *</label>
                      <select 
                        value={idMotivoBaja} 
                        onChange={(e) => setIdMotivoBaja(e.target.value === "" ? "" : Number(e.target.value))} 
                        className={`${inputStyle} appearance-none`}
                      >
                        <option value="" disabled>Selecciona un Motivo</option>
                        {motivosData.map((mot) => {
                          const motId = mot.id ?? mot.idMotivoBaja ?? mot.motivoBajaId;
                          return (
                            <option key={motId} value={motId}>
                              {mot.descripcion || mot.motivo || `Motivo ${motId}`}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelStyle}>Fecha de Baja *</label>
                      <input type="date" value={fechaBaja} onChange={(e) => setFechaBaja(e.target.value)} className={inputStyle} />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelStyle}>Monto Finiquito (Calculado)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={montoFiniquito} 
                        onChange={(e) => setMontoFiniquito(e.target.value === "" ? "" : Number(e.target.value))} 
                        className={inputStyle} 
                        placeholder="Ej. 15000.50" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelStyle}>Estatus de Pago *</label>
                      <select 
                        value={estatusPago} 
                        onChange={(e) => setEstatusPago(e.target.value)} 
                        className={`${inputStyle} appearance-none`}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Proceso">En Proceso</option>
                        <option value="Pagado">Pagado</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelStyle}>ID Nómina Finiquito</label>
                      <input 
                        type="number" 
                        value={idNominaFiniquito} 
                        onChange={(e) => setIdNominaFiniquito(e.target.value === "" ? "" : Number(e.target.value))} 
                        className={inputStyle} 
                        placeholder="ID Nómina (Opcional)" 
                      />
                    </div>

                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={activo} 
                          onChange={(e) => setActivo(e.target.checked)} 
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${activo ? 'bg-usagBlue' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${activo ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {activo ? 'Registro Activo' : 'Registro Inactivo / Cancelado'}
                      </span>
                    </label>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-500">Cancelar</button>
                    <button type="submit" disabled={isSubmitting} className="bg-usagBlue text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2">
                      {isSubmitting ? 'Guardando...' : 'Guardar Baja'}
                    </button>
                  </div>
                  
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}