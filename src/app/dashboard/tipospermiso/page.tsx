"use client";

import { useState, useEffect } from "react";

interface TipoPermiso {
  id: number;
  descripcion: string;
  porHoras: boolean;
  requiereComprobante: boolean;
  conGoce: boolean;
  diasPorAnio: number | null;
}

export default function TiposPermisoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tiposData, setTiposData] = useState<TipoPermiso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idActual, setIdActual] = useState<number | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [porHoras, setPorHoras] = useState(false);
  const [requiereComprobante, setRequiereComprobante] = useState(false);
  const [conGoce, setConGoce] = useState(true);
  const [diasPorAnio, setDiasPorAnio] = useState("");

  const [errorInput, setErrorInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTiposPermiso = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7097/api/catalogos/tipos-permiso", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const lista = data.elementos || data;
        setTiposData(lista);
      }
    } catch (error) {
      console.error("Error al cargar tipos de permiso:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposPermiso();
  }, []);

 const guardarTipoPermiso = async () => {
    setErrorInput("");
    if (!descripcion.trim()) {
      setErrorInput("La descripción es obligatoria.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      
      const url = modoEdicion && idActual !== null
        ? `https://localhost:7097/api/catalogos/tipos-permiso/${idActual}/tope`
        : "https://localhost:7097/api/catalogos/tipos-permiso";
      
      const method = modoEdicion ? "PUT" : "POST";

      const bodyData = modoEdicion 
        ? { diasPorAnio: diasPorAnio ? parseInt(diasPorAnio) : null }
        : {
            descripcion: descripcion.trim(),
            porHoras: porHoras,
            requiereComprobante: requiereComprobante,
            conGoce: conGoce,
            diasPorAnio: diasPorAnio ? parseInt(diasPorAnio) : null
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
        fetchTiposPermiso();
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

  const abrirEdicion = (item: TipoPermiso) => {
    setModoEdicion(true);
    setIdActual(item.id);
    setDescripcion(item.descripcion || "");
    setPorHoras(item.porHoras ?? false);
    setRequiereComprobante(item.requiereComprobante ?? false);
    setConGoce(item.conGoce ?? true);
    setDiasPorAnio(item.diasPorAnio !== null && item.diasPorAnio !== undefined ? item.diasPorAnio.toString() : "");
    setIsDrawerOpen(true);
  };

  const limpiarFormulario = () => {
    setDescripcion("");
    setPorHoras(false);
    setRequiereComprobante(false);
    setConGoce(true);
    setDiasPorAnio("");
    setModoEdicion(false);
    setIdActual(null);
    setErrorInput("");
  };

  const filteredTipos = tiposData.filter((item) =>
    item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputStyle = "w-full bg-gray-50/50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 dark:text-white transition-all focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-usagBlue/20 focus:border-usagBlue shadow-xs";

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up relative">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-usagBlue dark:text-white tracking-tight">Tipos de Permiso</h1>
          <p className="text-usagBlue/60 dark:text-blue-200/70 text-sm font-medium tracking-wide">
            Administra las categorías e incidencias de ausencia permitidas.
          </p>
        </div>
  
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-usagBlue/5 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Buscar por descripción..." 
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

          {!isLoading && filteredTipos.length === 0 && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
               <p className="text-sm font-medium">No hay tipos de permiso registrados</p>
             </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-[0.65rem] uppercase tracking-widest text-usagBlue/50">
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">Descripción</th>
                <th className="px-6 py-4 font-bold">Cálculo</th>
                <th className="px-6 py-4 font-bold">Comprobante</th>
                <th className="px-6 py-4 font-bold">Goce de Sueldo</th>
                <th className="px-6 py-4 font-bold">Tope Días/Año</th>
                <th className="px-6 py-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredTipos.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-600 dark:text-gray-300">{item.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-100">{item.descripcion}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    {item.porHoras ? "Por Horas" : "Por Días"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.requiereComprobante ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                      {item.requiereComprobante ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.conGoce ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {item.conGoce ? "Con Goce" : "Sin Goce"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono font-bold text-gray-700 dark:text-gray-300">
                    {item.diasPorAnio ?? "Definee cuanto"}
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
              ))}
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
                  {modoEdicion ? "Editar Tipo de Permiso" : "Nuevo Tipo de Permiso"}
                </h2>
                <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-rose-500">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {errorInput && <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl font-semibold">{errorInput}</div>}

                <div className="space-y-1.5">
                  <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Descripción *</label>
                  <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className={inputStyle} placeholder="Ej. Enfermedad general" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Tope Días por Año (Opcional)</label>
                  <input type="number" value={diasPorAnio} onChange={(e) => setDiasPorAnio(e.target.value)} className={inputStyle} placeholder="Ej. 15" />
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="porHoras" checked={porHoras} onChange={(e) => setPorHoras(e.target.checked)} className="w-4 h-4 text-usagBlue rounded" />
                    <label htmlFor="porHoras" className="text-sm font-bold text-gray-700 dark:text-gray-300">Calculado por Horas</label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="requiereComprobante" checked={requiereComprobante} onChange={(e) => setRequiereComprobante(e.target.checked)} className="w-4 h-4 text-usagBlue rounded" />
                    <label htmlFor="requiereComprobante" className="text-sm font-bold text-gray-700 dark:text-gray-300">Requiere Comprobante (Justificante)</label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="conGoce" checked={conGoce} onChange={(e) => setConGoce(e.target.checked)} className="w-4 h-4 text-usagBlue rounded" />
                    <label htmlFor="conGoce" className="text-sm font-bold text-gray-700 dark:text-gray-300">Aplica con Goce de Sueldo</label>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-between">
                <button onClick={() => setIsDrawerOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-500">Cancelar</button>
                <button disabled={isSubmitting} onClick={guardarTipoPermiso} className="bg-usagBlue text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">
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