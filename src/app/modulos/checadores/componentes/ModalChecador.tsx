import React from "react";
interface ModalChecadorProps {
  isOpen: boolean;
  onClose: () => void;
  modoEdicion: boolean;
  idChecadorActual: string | null;
  formData: any;
  errorInput: string;
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ModalChecador = ({
  isOpen,
  onClose,
  modoEdicion,
  idChecadorActual,
  formData,
  errorInput,
  isSubmitting,
  onChange,
  onSubmit
}: ModalChecadorProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in" 
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-4xl w-full flex">
        <div className="w-full h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-100 dark:border-gray-800 relative">
          
          <div className="px-8 py-6 bg-gradient-to-r from-[#1e293b] via-[#28385e] to-[#1e293b] text-white flex justify-between items-center shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">{modoEdicion ? "Editar Checador" : "Registrar Nuevo Checador"}</h2>
                <p className="text-xs text-blue-200/80 font-medium tracking-wider uppercase">ASISTE • Portal Administrativo</p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 dark:bg-gray-900/50 pb-32">
            <form id="formChecador" className="space-y-6" onSubmit={onSubmit}>
              
              {errorInput && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-center gap-3">
                  <span className="font-bold">Error:</span> {errorInput}
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Información del Dispositivo Biométrico</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[0.7rem] font-bold text-slate-500 uppercase">ID Checador</label>
                    <input 
                      type="text" 
                      value={idChecadorActual || "Automático"} 
                      className="w-full bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-gray-400 cursor-not-allowed" 
                      disabled 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Nombre del Checador *</label>
                    <input 
                      type="text" 
                      name="nombreChecador" 
                      value={formData.nombreChecador} 
                      onChange={onChange} 
                      className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white" 
                      placeholder="Ej. Checador Entrada Principal" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Número de Serie *</label>
                    <input 
                      type="text" 
                      name="numeroSerie" 
                      value={formData.numeroSerie} 
                      onChange={onChange} 
                      className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white" 
                      placeholder="Ej. SN-123456" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.7rem] font-bold text-slate-500 uppercase">IP del Dispositivo</label>
                    <input 
                      type="text" 
                      name="ipDispositivo" 
                      value={formData.ipDispositivo} 
                      onChange={onChange} 
                      className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white" 
                      placeholder="Ej. 192.168.1.100" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Ubicación</label>
                  <textarea 
                    name="ubicacion" 
                    value={formData.ubicacion} 
                    onChange={onChange} 
                    rows={3} 
                    className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white" 
                    placeholder="Ej. Edificio Administrativo - Vestíbulo" 
                  />
                </div>

                {modoEdicion && (
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-gray-700">
                    <input 
                      type="checkbox" 
                      name="activo" 
                      id="checkActivoChecador" 
                      checked={formData.activo} 
                      onChange={onChange} 
                      className="w-4 h-4 text-usagBlue rounded border-gray-300 cursor-pointer" 
                    />
                    <label htmlFor="checkActivoChecador" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">Checador Activo</label>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-8 py-5 border-t border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end items-center gap-3 shadow-2xl">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2.5 rounded-xl font-bold tracking-wide text-sm text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              form="formChecador"
              disabled={isSubmitting} 
              className="bg-gradient-to-r from-usagBlue to-[#2f457d] hover:shadow-[0_8px_20px_-6px_rgba(38,56,102,0.4)] text-white px-8 py-2.5 rounded-xl font-bold tracking-wide text-sm shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center min-w-[150px] cursor-pointer"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                modoEdicion ? "Actualizar Cambios" : "Guardar Checador"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};