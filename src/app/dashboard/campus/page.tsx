"use client";

import { useState, useEffect } from "react";

interface Campus {
  id: string;
  clave: string;
  nombre: string;
  direccion: string;
  activo: boolean;
  idEmpresa: string;
}

export default function CampusPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [campusData, setCampusData] = useState<Campus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [empresasData, setEmpresasData] = useState<any[]>([]);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); 
  const [idCampusActual, setIdCampusActual] = useState<string | null>(null); 
  
  const [nuevaClave, setNuevaClave] = useState(""); 
  const [nuevoNombre, setNuevoNombre] = useState(""); 
  const [nuevaDireccion, setNuevaDireccion] = useState(""); 
  const [nuevoIdEmpresa, setNuevoIdEmpresa] = useState("");
  const [nuevoActivo, setNuevoActivo] = useState(true); 
  
  const [errorInput, setErrorInput] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const userRole = 'admin'; 

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token"); 
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      const [resCampus, resEmpresas] = await Promise.all([
        fetch("https://localhost:7097/api/catalogos/admin/campus?incluirInactivos=true", { method: "GET", headers }),
        fetch("https://localhost:7097/api/catalogos/empresas", { method: "GET", headers })
      ]);
if (resEmpresas.ok) {
        const empData = await resEmpresas.json();
        const listaEmpresas = empData.elementos || empData;        
        setEmpresasData(listaEmpresas);
      }

      if (resCampus.ok) {
        const data = await resCampus.json();
        const listaCampus = data.elementos || data;
        const campusFormateados = listaCampus.map((c: any) => ({
          id: c.idCampus.toString(),
          clave: c.clave || "",
          nombre: c.nombreCampus || c.nombre, 
          direccion: c.calleNumero || c.direccion || "Sin dirección especificada",
          activo: c.activo ?? c.Activo ?? true,
          idEmpresa: c.idEmpresa?.toString() || ""
        }));
        setCampusData(campusFormateados);
      }
    } catch (error) {
      console.error("Error de red al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const guardarCampus = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!nuevaClave.trim()) {
      setErrorInput("La clave del campus es obligatoria.");
      return;
    }
    if (!nuevoNombre.trim()) {
      setErrorInput("El nombre del campus no puede estar vacío.");
      return;
    }
    if (!nuevoIdEmpresa) {
      setErrorInput("Debes seleccionar una empresa.");
      return;
    }

    setErrorInput(""); 
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      
      const url = modoEdicion 
        ? `https://localhost:7097/api/catalogos/admin/campus/${idCampusActual}`
        : "https://localhost:7097/api/catalogos/admin/campus";
      
      const method = modoEdicion ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          idEmpresa: parseInt(nuevoIdEmpresa),
          clave: nuevaClave.trim(),
          nombreCampus: nuevoNombre.trim(),
          calleNumero: nuevaDireccion.trim() || null,
          ciudad: null,
          idEstado: null,
          codigoPostal: null,
          telefono: null,
          ouDirectorio: null,
          activo: nuevoActivo,
          idUsuarioCreacion: 1
        })
      });

      if (response.ok) {
        setNuevaClave("");
        setNuevoNombre(""); 
        setNuevaDireccion("");
        setNuevoIdEmpresa("");
        setNuevoActivo(true);
        setIsDrawerOpen(false); 
        setModoEdicion(false);
        setIdCampusActual(null);
        fetchData(); 
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

  const reactivarCampus = async (camp: Campus) => {
    const confirmado = window.confirm(`¿Deseas reactivar el campus "${camp.nombre}"?`);
    if (!confirmado) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7097/api/catalogos/admin/campus/${camp.id}/reactivar`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) fetchData();
    } catch (error) {
      console.error("Error al reactivar:", error);
    }
  };

  const abrirModalEdicion = (camp: Campus) => {
    setModoEdicion(true);
    setIdCampusActual(camp.id);
    setNuevaClave(camp.clave);
    setNuevoNombre(camp.nombre);
    setNuevaDireccion(camp.direccion === "Sin dirección especificada" ? "" : camp.direccion);
    setNuevoIdEmpresa(camp.idEmpresa);
    setNuevoActivo(camp.activo);
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const abrirModalCreacion = () => {
    setModoEdicion(false);
    setIdCampusActual(null);
    setNuevaClave("");
    setNuevoNombre("");
    setNuevaDireccion("");
    setNuevoIdEmpresa("");
    setNuevoActivo(true);
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const eliminarCampus = async (id: string, nombre: string) => {
    const confirmado = window.confirm(`¿Estás seguro de desactivar el campus "${nombre}"?`);
    if (!confirmado) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7097/api/catalogos/admin/campus/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) fetchData();
    } catch (error) {
      console.error("Error al desactivar:", error);
    }
  };

  const filteredCampus = campusData.filter((camp) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      camp.nombre.toLowerCase().includes(searchLower) ||
      camp.clave.toLowerCase().includes(searchLower) ||
      camp.direccion.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up relative">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-usagBlue dark:text-white tracking-tight transition-colors">Campus</h1>
          <p className="text-usagBlue/60 dark:text-blue-200/70 text-sm font-medium tracking-wide transition-colors">
            Administración de planteles e instalaciones institucionales.
          </p>
        </div>
        
        {userRole === 'admin' && (
          <button 
            onClick={abrirModalCreacion}
            className="bg-linear-to-r from-usagBlue to-[#2f457d] text-white px-6 py-2.5 rounded-xl font-bold tracking-wide text-sm shadow-[0_8px_20px_-6px_rgba(38,56,102,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(38,56,102,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Campus
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
              placeholder="Buscar por clave, campus o dirección..." 
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

          {!isLoading && filteredCampus.length === 0 && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mb-3 opacity-50">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
               </svg>
               <p className="text-sm font-medium">No hay campus registrados</p>
             </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-[0.65rem] uppercase tracking-widest text-usagBlue/50 dark:text-blue-200/50">
                <th className="px-6 py-4 font-bold">Clave</th>
                <th className="px-6 py-4 font-bold">Nombre del Campus</th>
                <th className="px-6 py-4 font-bold">Dirección</th>
                <th className="px-6 py-4 font-bold">Estatus</th>
                {userRole === 'admin' && <th className="px-6 py-4 font-bold text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredCampus.map((camp) => (
                <tr key={camp.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md">{camp.clave || camp.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{camp.nombre}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{camp.direccion}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      camp.activo 
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800" 
                        : "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-100 dark:border-rose-800"
                    }`}>
                      {camp.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => abrirModalEdicion(camp)}
                          className="p-2 text-usagBlue/70 dark:text-blue-400 bg-usagBlue/5 dark:bg-blue-900/30 hover:text-usagBlue dark:hover:text-blue-300 hover:bg-usagBlue/10 dark:hover:bg-blue-900/50 rounded-lg transition-all border border-transparent hover:border-usagBlue/20 shadow-sm" 
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </button>

                        {!camp.activo && (
                          <button 
                            onClick={() => reactivarCampus(camp)}
                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg transition-all border border-transparent hover:border-emerald-200 shadow-sm" 
                            title="Reactivar Campus"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                          </button>
                        )}

                        {camp.activo && (
                          <button 
                            onClick={() => eliminarCampus(camp.id, camp.nombre)}
                            className="p-2 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-gray-600 rounded-lg transition-all border border-transparent hover:border-rose-100 shadow-sm" 
                            title="Desactivar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        )}
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
            className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
            <div className="w-full h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-slide-in-right border-l border-gray-100 dark:border-gray-800 relative">
              
              <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-xl font-extrabold text-usagBlue dark:text-white tracking-tight">
                    {modoEdicion ? "Editar Campus" : "Nuevo Campus"}
                  </h2>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest">Catálogo Estructural</p>
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

              <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-gray-900">
                <form className="space-y-6" onSubmit={guardarCampus}>
                  <div className="space-y-6 animate-fade-in-up">
                    
                    <div className="space-y-1.5">
                      <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">ID Campus</label>
                      <input 
                        type="text" 
                        value={idCampusActual || "Automático"} 
                        className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors bg-gray-50 dark:text-gray-300" 
                        disabled 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Clave del Campus *</label>
                      <input 
                        type="text" 
                        value={nuevaClave}
                        onChange={(e) => {
                          setNuevaClave(e.target.value);
                          if (errorInput) setErrorInput(""); 
                        }}
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors dark:text-white dark:bg-gray-800 ${
                          errorInput && !nuevaClave.trim()
                            ? "border-rose-500 focus:border-rose-500" 
                            : "border-gray-200 dark:border-gray-700 focus:border-usagBlue dark:focus:border-blue-500"
                        }`}
                        placeholder="Ej. CAMP-01" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Nombre del Campus *</label>
                      <input 
                        type="text" 
                        value={nuevoNombre}
                        onChange={(e) => {
                          setNuevoNombre(e.target.value);
                          if (errorInput) setErrorInput(""); 
                        }}
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors dark:text-white dark:bg-gray-800 ${
                          errorInput && !nuevoNombre.trim()
                            ? "border-rose-500 focus:border-rose-500" 
                            : "border-gray-200 dark:border-gray-700 focus:border-usagBlue dark:focus:border-blue-500"
                        }`}
                        placeholder="Ej. Campus Central" 
                      />
                    </div>

                    {/* SELECT DE EMPRESA */}
                    <div className="space-y-1.5">
                      <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Empresa *</label>
                      <select
                        value={nuevoIdEmpresa}
                        onChange={(e) => {
                          setNuevoIdEmpresa(e.target.value);
                          if (errorInput) setErrorInput("");
                        }}
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors dark:text-white dark:bg-gray-800 ${
                          errorInput && !nuevoIdEmpresa
                            ? "border-rose-500 focus:border-rose-500" 
                            : "border-gray-200 dark:border-gray-700 focus:border-usagBlue dark:focus:border-blue-500"
                        }`}
                      >
                        <option value="">-- Selecciona una Empresa --</option>
                      {empresasData.map((emp) => {
                        const idVal = emp.idEmpresa || emp.id;
                        const nombreEmpresa = emp.razonSocial || emp.nombreComercial || emp.descripcion || emp.nombreEmpresa || emp.nombre || `Empresa ${idVal}`;
                        return (
                         <option key={idVal} value={idVal}>
                           {nombreEmpresa}
                         </option>
                           );
})}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Dirección (Calle y Número)</label>
                      <textarea 
                        value={nuevaDireccion}
                        onChange={(e) => setNuevaDireccion(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors dark:text-white"
                        placeholder="Ej. Blvd. Universitario #100"
                      />
                    </div>

                    {errorInput && (
                      <p className="text-xs text-rose-500 font-semibold mt-1 animate-fade-in">{errorInput}</p>
                    )}

                    {modoEdicion && (
                      <div className="flex items-center gap-3 pt-2">
                        <input 
                          type="checkbox"
                          id="checkActivo"
                          checked={nuevoActivo}
                          onChange={(e) => setNuevoActivo(e.target.checked)}
                          className="w-4 h-4 text-usagBlue rounded border-gray-300 focus:ring-usagBlue"
                        />
                        <label htmlFor="checkActivo" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                          Campus Activo
                        </label>
                      </div>
                    )}

                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="px-6 py-2.5 rounded-xl font-bold tracking-wide text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-usagBlue dark:bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold tracking-wide text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                    >
                      {isSubmitting ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        modoEdicion ? "Actualizar Cambios" : "Guardar Campus"
                      )}
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