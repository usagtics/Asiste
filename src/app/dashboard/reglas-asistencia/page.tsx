"use client";

import { useState, useEffect } from "react";

interface ReglaAsistencia {
  id: string;
  nombre: string;
  tolerancia: number;
  limiteFalta: number;
  maxRetardos: number;
  aplicaSancion: boolean;
  vigencia: string;
}

export default function ReglasAsistenciaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reglasData, setReglasData] = useState<ReglaAsistencia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const userRole = 'admin'; 

  useEffect(() => {
    const fetchReglas = async () => {
      try {
        setIsLoading(true);
        // AQUÍ VA MI API DEL BACK 
      
      } catch (error) {
        console.error("Error al cargar las reglas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReglas();
  }, []);

  const filteredReglas = reglasData.filter((regla) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      regla.nombre.toLowerCase().includes(searchLower) ||
      regla.id.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up relative">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-usagBlue tracking-tight">Reglas de Asistencia</h1>
          <p className="text-usagBlue/60 text-sm font-medium tracking-wide">
            Configuración de tolerancias, retardos y sanciones del personal.
          </p>
        </div>
        
        {userRole === 'admin' && (
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="bg-linear-to-r from-usagBlue to-[#2f457d] text-white px-6 py-2.5 rounded-xl font-bold tracking-wide text-sm shadow-[0_8px_20px_-6px_rgba(38,56,102,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(38,56,102,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nueva Regla
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-usagBlue/5 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Buscar regla por nombre o ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-usagBlue focus:ring-1 focus:ring-usagBlue transition-all text-gray-700"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px] relative">
          {isLoading && (
             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-usagBlue mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
             </div>
          )}

          {!isLoading && filteredReglas.length === 0 && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mb-3 opacity-50">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <p className="text-sm font-medium">No hay reglas de asistencia configuradas</p>
             </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-[0.65rem] uppercase tracking-widest text-usagBlue/50">
                <th className="px-6 py-4 font-bold">ID Regla</th>
                <th className="px-6 py-4 font-bold">Nombre</th>
                <th className="px-6 py-4 font-bold text-center">Tolerancia</th>
                <th className="px-6 py-4 font-bold text-center">Límite Falta</th>
                <th className="px-6 py-4 font-bold text-center">Sanción</th>
                {userRole === 'admin' && <th className="px-6 py-4 font-bold text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReglas.map((regla, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">{regla.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800">{regla.nombre}</p>
                    <p className="text-[0.65rem] text-gray-500 uppercase tracking-widest mt-0.5">Vigencia: {regla.vigencia}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">{regla.tolerancia} min</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">&gt; {regla.limiteFalta} min</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {regla.aplicaSancion ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                        Inactiva
                      </span>
                    )}
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-usagBlue/70 bg-usagBlue/5 hover:text-usagBlue hover:bg-usagBlue/10 rounded-lg transition-all border border-transparent hover:border-usagBlue/20 shadow-sm" title="Editar">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        <button className="p-2 text-gray-400 bg-gray-50 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-100 shadow-sm" title="Eliminar">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          <div className="fixed inset-y-0 right-0 max-w-lg w-full flex">
            <div className="w-full h-full bg-white shadow-2xl flex flex-col animate-slide-in-right border-l border-gray-100 relative">
              
              <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-xl font-extrabold text-usagBlue tracking-tight">Nueva Regla de Asistencia</h2>
                  <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">Motor de Cálculo ASISTE</p>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-white">
                <form className="space-y-6">
                  <div className="space-y-6 animate-fade-in-up">
                    
                    <div className="space-y-1.5">
                      <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Nombre de la Regla</label>
                      <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-usagBlue transition-colors" placeholder="Ej. Horario Docentes 2026" />
                    </div>

                    <div className="grid grid-cols-2 gap-5 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span> Minutos Tolerancia
                        </label>
                        <input type="number" min="0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-usagBlue transition-colors" placeholder="Ej. 10" />
                      </div>
                      
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-400"></span> Límite Falta (Minutos)
                        </label>
                        <input type="number" min="0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-usagBlue transition-colors" placeholder="Ej. 16" />
                      </div>
                      
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Máximo de retardos permitidos (por mes/quincena)</label>
                        <input type="number" min="0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-usagBlue transition-colors" placeholder="Ej. 3" />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mt-2">
                      <input type="checkbox" className="mt-1 w-4 h-4 text-usagBlue border-gray-300 rounded focus:ring-usagBlue" />
                      <div>
                        <p className="text-sm font-bold text-gray-800">Aplica sanción por falta</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Si se activa, el motor deducirá el monto correspondiente en pre-nómina al superar el límite.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5 mt-6 border-t border-gray-100 pt-6">
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Vigencia Inicio</label>
                        <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-usagBlue transition-colors text-gray-600" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Vigencia Fin</label>
                        <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-usagBlue transition-colors text-gray-600" />
                      </div>
                    </div>

                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0 flex justify-end items-center gap-3">
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold tracking-wide text-sm text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                
                <button 
                  className="bg-usagBlue text-white px-8 py-2.5 rounded-xl font-bold tracking-wide text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Guardar Regla
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}