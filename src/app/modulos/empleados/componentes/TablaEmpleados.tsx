"use client";
import React, { useState } from 'react';
import { useEmpleados } from '../logica/useEmpleados';
import { ModalNuevoEmpleado } from './ModalNuevoEmpleado';
import { EmpleadosService } from '../servicios/empleados.service';

export const TablaEmpleados = () => {
  const { empleadosData, isLoading, errorGlobal, searchTerm, setSearchTerm, refetchEmpleados } = useEmpleados();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<any | null>(null);
  const userRole = 'admin'; 

  const abrirCreacion = () => {
    setEmpleadoSeleccionado(null);
    setIsModalOpen(true);
  };

  const abrirEdicion = (empleado: any) => {
    setEmpleadoSeleccionado(empleado);
    setIsModalOpen(true);
  };

  const desactivarEmpleado = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de desactivar al empleado "${nombre}"?`)) return;
    try {
      await EmpleadosService.desactivar(id);
      if (refetchEmpleados) refetchEmpleados();
    } catch (err) {
      console.error(err);
    }
  };

  const reactivarEmpleado = async (empleado: any) => {
    if (!window.confirm(`¿Deseas reactivar al empleado "${empleado.nombre}"?`)) return;
    try {
      await EmpleadosService.reactivar(empleado.rawId || empleado.id);
      if (refetchEmpleados) refetchEmpleados();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <svg className="animate-spin h-8 w-8 text-usagBlue dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (errorGlobal) return <div className="p-8 text-center text-rose-500 font-medium">{errorGlobal}</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up relative">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-usagBlue dark:text-white tracking-tight transition-colors">Empleados</h1>
          <p className="text-usagBlue/60 dark:text-blue-200/70 text-sm font-medium tracking-wide transition-colors">
            Directorio y gestión del personal institucional.
          </p>
        </div>
        
        {userRole === 'admin' && (
          <button 
            onClick={abrirCreacion}
            className="bg-gradient-to-r from-usagBlue to-[#2f457d] text-white px-6 py-2.5 rounded-xl font-bold tracking-wide text-sm shadow-[0_8px_20px_-6px_rgba(38,56,102,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(38,56,102,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 cursor-pointer"
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
              placeholder="Buscar por nombre, correo o matrícula..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-usagBlue dark:focus:border-blue-500 focus:ring-1 focus:ring-usagBlue dark:focus:ring-blue-500 transition-all text-gray-700 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-[0.65rem] uppercase tracking-widest text-usagBlue/50 dark:text-blue-200/50">
                <th className="px-6 py-4 font-bold">Matrícula</th>
                <th className="px-6 py-4 font-bold">Empleado</th>
                <th className="px-6 py-4 font-bold">Departamento</th>
                <th className="px-6 py-4 font-bold">Estatus</th>
                {userRole === 'admin' && <th className="px-6 py-4 font-bold text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {empleadosData.map((empleado) => (
                <tr key={empleado.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md">{empleado.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{empleado.nombre}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{empleado.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{empleado.departamento}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      empleado.estado === 'Activo' 
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800" 
                        : "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-100 dark:border-rose-800"
                    }`}>
                      {empleado.estado}
                    </span>
                  </td>
                  {userRole === 'admin' && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => abrirEdicion(empleado)}
                          className="p-2 text-usagBlue/70 dark:text-blue-400 bg-usagBlue/5 dark:bg-blue-900/30 hover:text-usagBlue dark:hover:text-blue-300 hover:bg-usagBlue/10 dark:hover:bg-blue-900/50 rounded-lg transition-all cursor-pointer" 
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                          </svg>
                        </button>

                        {empleado.estado !== 'Activo' ? (
                          <button 
                            onClick={() => reactivarEmpleado(empleado)}
                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg transition-all cursor-pointer" 
                            title="Reactivar Empleado"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                          </button>
                        ) : (
                          <button 
                            onClick={() => desactivarEmpleado(empleado.rawId || empleado.id, empleado.nombre)}
                            className="p-2 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-gray-600 rounded-lg transition-all cursor-pointer" 
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
              
              {empleadosData.length === 0 && (
                <tr>
                  <td colSpan={userRole === 'admin' ? 5 : 4} className="p-12 text-center text-gray-400 dark:text-gray-500 text-sm font-medium">
                    No se encontraron coincidencias para "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalNuevoEmpleado 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        empleadoAEditar={empleadoSeleccionado}
        onEmpleadoGuardado={() => {
          if (refetchEmpleados) refetchEmpleados();
        }}
      />
    </div>
  );
};