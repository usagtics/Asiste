"use client";

import { useState, useEffect } from "react";

export default function SaldosVacacionesPage() {
  const [mounted, setMounted] = useState(false);
  const [empleadosList, setEmpleadosList] = useState<any[]>([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");
  const [vacacionesData, setVacacionesData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setMounted(true);
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7097/api/empleados", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEmpleadosList(data.elementos || data);
      }
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };
  const consultarVacacionesEmpleado = async (idEmp: string) => {
    if (!idEmp) {
      setVacacionesData(null);
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setVacacionesData(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7097/api/vacaciones/${idEmp}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setVacacionesData(data);
      } else {
        const text = await response.text();
        setErrorMsg(text || "No se encontraron registros de vacaciones para este colaborador.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setErrorMsg("No se pudo conectar con el servidor para consultar los saldos.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return <div className="w-full max-w-[96%] 2xl:max-w-[1600px] mx-auto min-h-[400px]"></div>;

  return (
    <div className="w-full max-w-[96%] 2xl:max-w-[1600px] mx-auto space-y-8 animate-fade-in-up relative">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 transition-all">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-usagBlue to-[#2f457d] rounded-2xl flex items-center justify-center shadow-lg shadow-usagBlue/20 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Saldos de Vacaciones por Colaborador</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base font-medium tracking-wide">
              Consulta individualizada de periodos, días disponibles, vigencias y estatus de prima vacacional.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800/95 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 p-8 transition-colors space-y-6">
        <div className="max-w-xl space-y-2">
          <label className="text-xs font-bold text-usagBlue dark:text-blue-400 uppercase tracking-widest">Seleccionar Colaborador</label>
          <select
            value={empleadoSeleccionado}
            onChange={(e) => {
              setEmpleadoSeleccionado(e.target.value);
              consultarVacacionesEmpleado(e.target.value);
            }}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-usagBlue/20 focus:border-usagBlue transition-all cursor-pointer"
          >
            <option value="">Selecciona un empleado de la lista...</option>
            {empleadosList.map((emp: any) => {
              const idEmp = emp.idEmpleado ?? emp.id_empleado ?? emp.id;
              const nombreEmp = emp.nombreCompleto ?? `${emp.nombre ?? ""} ${emp.apellidoPaterno ?? ""}`.trim();
              return (
                <option key={idEmp} value={idEmp}>
                  {nombreEmp} (Matrícula: {emp.matricula ?? idEmp})
                </option>
              );
            })}
          </select>
        </div>

        {errorMsg && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm rounded-xl font-semibold">
            {errorMsg}
          </div>
        )}

        {isLoading && (
          <div className="py-12 flex justify-center items-center">
            <div className="animate-spin h-8 w-8 border-4 border-usagBlue border-t-transparent rounded-full"></div>
          </div>
        )}

        {vacacionesData && !isLoading && (
          <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-700 animate-fade-in-up">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-5 rounded-2xl">
                <span className="text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Total Disponibles</span>
                <p className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
                  {vacacionesData.disponibles ?? 0} días
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-5 rounded-2xl">
                <span className="text-[0.65rem] font-bold text-usagBlue dark:text-blue-400 uppercase tracking-widest">Total Solicitados</span>
                <p className="text-3xl font-extrabold text-usagBlue dark:text-blue-300 mt-1">
                  {vacacionesData.solicitados ?? 0} días
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Desglose por Año de Servicio</span>
              
              {!vacacionesData.saldos || vacacionesData.saldos.length === 0 ? (
                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center text-sm text-gray-500">
                  Este colaborador no cuenta con saldos vacacionales registrados en este periodo.
                </div>
              ) : (
                <div className="space-y-3 max-w-3xl">
                  {vacacionesData.saldos.map((s: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-900/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <p className="text-base font-bold text-usagBlue dark:text-blue-400">Año de Servicio: #{s.anioServicio ?? (idx + 1)}</p>
                          
                          {s.caducado && (
                            <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-[0.6rem] font-bold rounded-full">
                              Caducado
                            </span>
                          )}

                          <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-bold ${
                            s.primaPagada 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}>
                            {s.primaPagada ? 'Prima Pagada' : 'Prima Pendiente'}
                          </span>
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-4 pt-1">
                          <span>Otorgados: <b>{s.diasOtorgados ?? 0}</b></span>
                          {s.diasExcepcion > 0 && <span className="text-amber-600">Excepción: <b>+{s.diasExcepcion}</b></span>}
                          <span>Disfrutados: <b>{s.diasDisfrutados ?? 0}</b></span>
                          <span>Caduca: <b>{s.fechaCaducidad?.split('T')[0] ?? 'N/A'}</b></span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                          {s.diasRestantes ?? 0} días
                        </span>
                        <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">Restantes</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}