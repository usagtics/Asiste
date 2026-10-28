"use client";
import { useState, useEffect } from "react";

interface Empresa {
  id: string;
  razonSocial: string;
  nombreComercial: string;
  rfc: string;
  codigoPostalExpedicion: string;
  idRegimenFiscal: string;
  activo: boolean;
}

export default function EmpresasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [empresasData, setEmpresasData] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [regimenesData, setRegimenesData] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); 
  const [idEmpresaActual, setIdEmpresaActual] = useState<string | null>(null); 
  const [nuevaRazonSocial, setNuevaRazonSocial] = useState(""); 
  const [nuevoNombreComercial, setNuevoNombreComercial] = useState(""); 
  const [nuevoRfc, setNuevoRfc] = useState(""); 
  const [nuevoCodigoPostal, setNuevoCodigoPostal] = useState(""); 
  const [nuevoIdRegimen, setNuevoIdRegimen] = useState("");
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

      const [resEmpresas, resRegimenes] = await Promise.all([
        fetch("https://localhost:7097/api/catalogos/admin/empresas?incluirInactivos=true", { method: "GET", headers }),
        fetch("https://localhost:7097/api/catalogos/regimenes-fiscales", { method: "GET", headers })
      ]);

      if (resRegimenes.ok) {
        const regData = await resRegimenes.json();
        setRegimenesData(regData.elementos || regData);
      }

      if (resEmpresas.ok) {
        const data = await resEmpresas.json();
        const lista = data.elementos || data;
        const empresasFormateadas = lista.map((e: any) => ({
          id: e.idEmpresa?.toString(),
          razonSocial: e.razonSocial || "",
          nombreComercial: e.nombreComercial || "", 
          rfc: e.rfc || "",
          codigoPostalExpedicion: e.codigoPostalExpedicion || "",
          idRegimenFiscal: e.idRegimenFiscal?.toString() || "",
          activo: e.activo ?? e.Activo ?? true,
        }));
        setEmpresasData(empresasFormateadas);
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

  const guardarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!nuevaRazonSocial.trim()) {
      setErrorInput("La razón social es obligatoria.");
      return;
    }
    if (!nuevoRfc.trim()) {
      setErrorInput("El RFC es obligatorio.");
      return;
    }
    if (!nuevoIdRegimen) {
      setErrorInput("Debes seleccionar un régimen fiscal.");
      return;
    }

    setErrorInput(""); 
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      
      const url = modoEdicion 
        ? `https://localhost:7097/api/catalogos/admin/empresas/${idEmpresaActual}`
        : "https://localhost:7097/api/catalogos/admin/empresas";
      
      const method = modoEdicion ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          razonSocial: nuevaRazonSocial.trim(),
          nombreComercial: nuevoNombreComercial.trim() || nuevaRazonSocial.trim(),
          rfc: nuevoRfc.trim(),
          idRegimenFiscal: parseInt(nuevoIdRegimen),
          codigoPostalExpedicion: nuevoCodigoPostal.trim() || "",
          dominioCorreo: null,
          ouDirectorio: null,
          numeroCertificadoCsd: null,
          rutaCertificadoCsd: null,
          vigenciaCsd: null,
          proveedorPac: null,
          serieRecibos: null,
          activo: nuevoActivo
        })
      });

      if (response.ok) {
        setNuevaRazonSocial("");
        setNuevoNombreComercial(""); 
        setNuevoRfc("");
        setNuevoCodigoPostal("");
        setNuevoIdRegimen("");
        setNuevoActivo(true);
        setIsDrawerOpen(false); 
        setModoEdicion(false);
        setIdEmpresaActual(null);
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

  const reactivarEmpresa = async (emp: Empresa) => {
    const confirmado = window.confirm(`¿Deseas reactivar la empresa "${emp.razonSocial}"?`);
    if (!confirmado) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7097/api/catalogos/admin/empresas/${emp.id}/reactivar`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) fetchData();
    } catch (error) {
      console.error("Error al reactivar:", error);
    }
  };

  const abrirModalEdicion = (emp: Empresa) => {
    setModoEdicion(true);
    setIdEmpresaActual(emp.id);
    setNuevaRazonSocial(emp.razonSocial);
    setNuevoNombreComercial(emp.nombreComercial);
    setNuevoRfc(emp.rfc);
    setNuevoCodigoPostal(emp.codigoPostalExpedicion);
    setNuevoIdRegimen(emp.idRegimenFiscal);
    setNuevoActivo(emp.activo);
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const abrirModalCreacion = () => {
    setModoEdicion(false);
    setIdEmpresaActual(null);
    setNuevaRazonSocial("");
    setNuevoNombreComercial("");
    setNuevoRfc("");
    setNuevoCodigoPostal("");
    setNuevoIdRegimen("");
    setNuevoActivo(true);
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const eliminarEmpresa = async (id: string, nombre: string) => {
    const confirmado = window.confirm(`¿Estás seguro de desactivar la empresa "${nombre}"?`);
    if (!confirmado) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://localhost:7097/api/catalogos/admin/empresas/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) fetchData();
    } catch (error) {
      console.error("Error al desactivar:", error);
    }
  };

  const filteredEmpresas = empresasData.filter((emp) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      emp.razonSocial.toLowerCase().includes(searchLower) ||
      emp.nombreComercial.toLowerCase().includes(searchLower) ||
      emp.rfc.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up relative">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-usagBlue dark:text-white tracking-tight transition-colors">Empresas</h1>
          <p className="text-usagBlue/60 dark:text-blue-200/70 text-sm font-medium tracking-wide transition-colors">
            Administración de razones sociales y entidades fiscales.
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
            Nueva Empresa
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
              placeholder="Buscar por RFC, razón social o nombre comercial..." 
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

          {!isLoading && filteredEmpresas.length === 0 && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
               <p className="text-sm font-medium">No hay empresas registradas</p>
             </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-[0.65rem] uppercase tracking-widest text-usagBlue/50 dark:text-blue-200/50">
                <th className="px-6 py-4 font-bold">RFC</th>
                <th className="px-6 py-4 font-bold">Razón Social</th>
                <th className="px-6 py-4 font-bold">Nombre Comercial</th>
                <th className="px-6 py-4 font-bold">Estatus</th>
                {userRole === 'admin' && <th className="px-6 py-4 font-bold text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredEmpresas.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md">{emp.rfc || "N/A"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{emp.razonSocial}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{emp.nombreComercial}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      emp.activo 
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800" 
                        : "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-100 dark:border-rose-800"
                    }`}>
                      {emp.activo ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => abrirModalEdicion(emp)}
                          className="p-2 text-usagBlue/70 dark:text-blue-400 bg-usagBlue/5 dark:bg-blue-900/30 hover:text-usagBlue dark:hover:text-blue-300 hover:bg-usagBlue/10 dark:hover:bg-blue-900/50 rounded-lg transition-all" 
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </button>

                        {!emp.activo && (
                          <button 
                            onClick={() => reactivarEmpresa(emp)}
                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg transition-all" 
                            title="Reactivar Empresa"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                          </button>
                        )}

                        {emp.activo && (
                          <button 
                            onClick={() => eliminarEmpresa(emp.id, emp.razonSocial)}
                            className="p-2 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-gray-600 rounded-lg transition-all" 
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
                    {modoEdicion ? "Editar Empresa" : "Nueva Empresa"}
                  </h2>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest">Catálogo Fiscal</p>
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
                <form className="space-y-6" onSubmit={guardarEmpresa}>
                  <div className="space-y-6 animate-fade-in-up">
                    
                    <div className="space-y-1.5">
                      <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Razón Social *</label>
                      <input 
                        type="text" 
                        value={nuevaRazonSocial}
                        onChange={(e) => {
                          setNuevaRazonSocial(e.target.value);
                          if (errorInput) setErrorInput(""); 
                        }}
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors dark:text-white dark:bg-gray-800 ${
                          errorInput && !nuevaRazonSocial.trim()
                            ? "border-rose-500 focus:border-rose-500" 
                            : "border-gray-200 dark:border-gray-700 focus:border-usagBlue dark:focus:border-blue-500"
                        }`}
                        placeholder="Ej. Operadora S.A. de C.V." 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Nombre Comercial</label>
                      <input 
                        type="text" 
                        value={nuevoNombreComercial}
                        onChange={(e) => setNuevoNombreComercial(e.target.value)}
                        className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors dark:text-white"
                        placeholder="Ej. Mi Empresa" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">RFC *</label>
                      <input 
                        type="text" 
                        value={nuevoRfc}
                        onChange={(e) => {
                          setNuevoRfc(e.target.value.toUpperCase());
                          if (errorInput) setErrorInput(""); 
                        }}
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors dark:text-white dark:bg-gray-800 ${
                          errorInput && !nuevoRfc.trim()
                            ? "border-rose-500 focus:border-rose-500" 
                            : "border-gray-200 dark:border-gray-700 focus:border-usagBlue dark:focus:border-blue-500"
                        }`}
                        placeholder="ABC123456T1" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Régimen Fiscal *</label>
                      <select
                        value={nuevoIdRegimen}
                        onChange={(e) => {
                          setNuevoIdRegimen(e.target.value);
                          if (errorInput) setErrorInput("");
                        }}
                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors dark:text-white dark:bg-gray-800 ${
                          errorInput && !nuevoIdRegimen
                            ? "border-rose-500 focus:border-rose-500" 
                            : "border-gray-200 dark:border-gray-700 focus:border-usagBlue dark:focus:border-blue-500"
                        }`}
                      >
                        <option value="">-- Selecciona un Régimen --</option>
                        {regimenesData.map((reg) => (
                          <option key={reg.idRegimenFiscal || reg.id} value={reg.idRegimenFiscal || reg.id}>
                            {reg.clave ? `${reg.clave} - ` : ""}{reg.descripcion || reg.nombre || `Régimen ${reg.idRegimenFiscal}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[0.65rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Código Postal (Expedición)</label>
                      <input 
                        type="text" 
                        value={nuevoCodigoPostal}
                        onChange={(e) => setNuevoCodigoPostal(e.target.value)}
                        className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors dark:text-white"
                        placeholder="Ej. 37000" 
                        maxLength={5}
                      />
                    </div>

                    {errorInput && (
                      <p className="text-xs text-rose-500 font-semibold mt-1 animate-fade-in">{errorInput}</p>
                    )}

                    {modoEdicion && (
                      <div className="flex items-center gap-3 pt-2">
                        <input 
                          type="checkbox"
                          id="checkActivoEmpresa"
                          checked={nuevoActivo}
                          onChange={(e) => setNuevoActivo(e.target.checked)}
                          className="w-4 h-4 text-usagBlue rounded border-gray-300 focus:ring-usagBlue"
                        />
                        <label htmlFor="checkActivoEmpresa" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                          Empresa Activa
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
                        modoEdicion ? "Actualizar Cambios" : "Guardar Empresa"
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