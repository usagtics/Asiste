"use client";

import { useState, useEffect } from "react";

interface PeriodoEscolar {
  id?: number;
  idPeriodo?: number;
  periodoId?: number;
  nombrePeriodo: string;
  fechaInicio: string;
  fechaFin: string;
  activo?: boolean;
}

export default function PeriodosEscolaresPage() {
  const [mounted, setMounted] = useState(false);
  const [periodosData, setPeriodosData] = useState<PeriodoEscolar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idActual, setIdActual] = useState<number | null>(null);

  const [nombrePeriodo, setNombrePeriodo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [activo, setActivo] = useState(true);

  const [errorInput, setErrorInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchPeriodos();
  }, []);

  const fetchPeriodos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7097/api/catalogos/admin/periodos-escolares", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const lista = data.elementos || data;
        setPeriodosData(lista);
      }
    } catch (error) {
      console.error("Error al cargar periodos escolares:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const guardarPeriodo = async () => {
    setErrorInput("");
    if (!nombrePeriodo.trim() || !fechaInicio || !fechaFin) {
      setErrorInput("Todos los campos son obligatorios.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const url = modoEdicion && idActual !== null
        ? `https://localhost:7097/api/catalogos/admin/periodos-escolares/${idActual}`
        : "https://localhost:7097/api/catalogos/admin/periodos-escolares";
      
      const method = modoEdicion ? "PUT" : "POST";

      const bodyData = {
        nombrePeriodo: nombrePeriodo.trim(),
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        activo: activo 
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
        fetchPeriodos();
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

  const abrirEdicion = (item: PeriodoEscolar) => {
    const idEncontrado = item.id ?? item.idPeriodo ?? item.periodoId ?? null;
    setModoEdicion(true);
    setIdActual(idEncontrado);
    setNombrePeriodo(item.nombrePeriodo || "");
    setFechaInicio(item.fechaInicio ? item.fechaInicio.split("T")[0] : "");
    setFechaFin(item.fechaFin ? item.fechaFin.split("T")[0] : "");
    setActivo(item.activo ?? true);
    setIsDrawerOpen(true);
  };

  const limpiarFormulario = () => {
    setNombrePeriodo("");
    setFechaInicio("");
    setFechaFin("");
    setActivo(true); 
    setModoEdicion(false);
    setIdActual(null);
    setErrorInput("");
  };

  if (!mounted) {
    return <div className="max-w-7xl mx-auto space-y-8 min-h-[400px]"></div>;
  }

  const filteredPeriodos = periodosData.filter((item) =>
    item.nombrePeriodo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputStyle = "w-full bg-gray-50/50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 dark:text-white transition-all focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-usagBlue/20 focus:border-usagBlue shadow-xs";

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up relative">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-usagBlue dark:text-white tracking-tight">Periodos Escolares</h1>
          <p className="text-usagBlue/60 dark:text-blue-200/70 text-sm font-medium tracking-wide">
            Administra los ciclos, semestres o cuatrimestres institucionales.
          </p>
        </div>
        
        <button 
          onClick={() => { limpiarFormulario(); setIsDrawerOpen(true); }}
          className="bg-linear-to-r from-usagBlue to-[#2f457d] text-white px-6 py-2.5 rounded-xl font-bold tracking-wide text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Periodo Escolar
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-usagBlue/5 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Buscar por nombre de periodo..." 
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

          {!isLoading && filteredPeriodos.length === 0 && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
               <p className="text-sm font-medium">No hay periodos escolares registrados</p>
             </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-[0.65rem] uppercase tracking-widest text-usagBlue/50">
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">Nombre del Periodo</th>
                <th className="px-6 py-4 font-bold">Fecha de Inicio</th>
                <th className="px-6 py-4 font-bold">Fecha de Fin</th>
                <th className="px-6 py-4 font-bold text-center">Estatus</th>
                <th className="px-6 py-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredPeriodos.map((item, idx) => {
                const itemId = item.id ?? item.idPeriodo ?? item.periodoId ?? idx + 1;
                const esActivo = item.activo ?? true;
                return (
                  <tr key={itemId} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-600 dark:text-gray-300">{itemId}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-100">{item.nombrePeriodo}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                      {item.fechaInicio ? item.fechaInicio.split("T")[0] : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                      {item.fechaFin ? item.fechaFin.split("T")[0] : "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        esActivo ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {esActivo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => abrirEdicion(item)}
                        className="p-2 text-usagBlue/70 bg-usagBlue/5 hover:bg-usagBlue/10 rounded-lg transition-all" 
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
                      </button>
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
          <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
            <div className="w-full h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col relative">
              
              <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-extrabold text-usagBlue dark:text-white">
                  {modoEdicion ? "Editar Periodo Escolar" : "Nuevo Periodo Escolar"}
                </h2>
                <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-rose-500">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {errorInput && <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl font-semibold">{errorInput}</div>}

                <div className="space-y-1.5">
                  <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Nombre del Periodo *</label>
                  <input type="text" value={nombrePeriodo} onChange={(e) => setNombrePeriodo(e.target.value)} className={inputStyle} placeholder="Ej. 2026-1 o Otoño 2026" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Fecha de Inicio *</label>
                  <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className={inputStyle} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Fecha de Fin *</label>
                  <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className={inputStyle} />
                </div>


                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={activo} 
                        onChange={(e) => setActivo(e.target.checked)} 
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${activo ? 'bg-usagBlue' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${activo ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {activo ? 'Periodo Activo' : 'Periodo Inactivo'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-between">
                <button onClick={() => setIsDrawerOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-500">Cancelar</button>
                <button disabled={isSubmitting} onClick={guardarPeriodo} className="bg-usagBlue text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}