import React from "react";

interface TablaChecadoresProps {
  checadores: any[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onNuevoChecador: () => void;
  onEditar: (ch: any) => void;
  onDesactivar: (id: string, nombre: string) => void;
  onReactivar: (ch: any) => void;
  userRole: string;
}

export const TablaChecadores = ({
  checadores,
  isLoading,
  searchTerm,
  onSearchChange,
  onNuevoChecador,
  onEditar,
  onDesactivar,
  onReactivar,
  userRole
}: TablaChecadoresProps) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-usagBlue dark:text-white tracking-tight">Checadores</h1>
          <p className="text-usagBlue/60 dark:text-blue-200/70 text-sm font-medium tracking-wide">
            Administración de terminales biométricas y dispositivos de registro.
          </p>
        </div>
        
        {userRole === 'admin' && (
          <button 
            onClick={onNuevoChecador}
            className="bg-gradient-to-r from-usagBlue to-[#2f457d] text-white px-6 py-2.5 rounded-xl font-bold tracking-wide text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Checador
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-usagBlue/5 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Buscar por nombre, serie, IP o ubicación..." 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-usagBlue dark:text-gray-200"
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

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-[0.65rem] uppercase tracking-widest text-usagBlue/50">
                <th className="px-6 py-4 font-bold">Nombre del Checador</th>
                <th className="px-6 py-4 font-bold">Número de Serie</th>
                <th className="px-6 py-4 font-bold">IP Dispositivo</th>
                <th className="px-6 py-4 font-bold">Ubicación</th>
                <th className="px-6 py-4 font-bold">Estatus</th>
                {userRole === 'admin' && <th className="px-6 py-4 font-bold text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {checadores.map((ch) => (
                <tr key={ch.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4"><p className="text-sm font-bold text-gray-800 dark:text-gray-100">{ch.nombre}</p></td>
                  <td className="px-6 py-4"><span className="text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md">{ch.numeroSerie}</span></td>
                  <td className="px-6 py-4"><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{ch.ipDispositivo}</p></td>
                  <td className="px-6 py-4"><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{ch.ubicacion}</p></td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${ch.activo ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                      {ch.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onEditar(ch)} className="p-2 text-usagBlue bg-usagBlue/5 rounded-lg cursor-pointer" title="Editar">✏️</button>
                        {ch.activo ? (
                          <button onClick={() => onDesactivar(ch.id, ch.nombre)} className="p-2 text-rose-600 bg-rose-50 rounded-lg cursor-pointer" title="Desactivar">🗑️</button>
                        ) : (
                          <button onClick={() => onReactivar(ch)} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg cursor-pointer" title="Reactivar">🔄</button>
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
    </div>
  );
};