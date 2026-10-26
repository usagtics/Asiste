"use client";

import { useState } from "react";
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("general");
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-usagBlue tracking-tight">Mi Perfil</h1>
        <p className="text-usagBlue/60 text-sm font-medium tracking-wide">
          Gestiona tu información personal y preferencias de seguridad.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-usagBlue/5 overflow-hidden">
            <div className="h-32 bg-linear-to-r from-usagBlue to-[#2f457d] relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            </div>
            
            <div className="px-8 pb-8 relative text-center">
              <div className="w-24 h-24 mx-auto -mt-12 mb-4 bg-white rounded-full p-1.5 shadow-lg border border-gray-100 relative z-10">
                <div className="w-full h-full rounded-full bg-usagBlue/10 flex items-center justify-center text-3xl font-bold text-usagBlue">
                  AD
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Administrador</h2>
              <p className="text-xs font-semibold text-usagBlue/60 uppercase tracking-widest mt-1">Super Usuario</p>
              
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span className="text-gray-600 font-medium">admin@usag.edu.mx</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="text-gray-600 font-medium">Campus Central, Guanajuato</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-usagBlue/5 p-8">
          
          <div className="flex gap-6 border-b border-gray-100 mb-8">
            <button 
              onClick={() => setActiveTab("general")}
              className={`pb-4 text-sm font-bold tracking-wide transition-all border-b-2 ${
                activeTab === "general" 
                  ? "border-usagBlue text-usagBlue" 
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Datos Generales
            </button>
            <button 
              onClick={() => setActiveTab("seguridad")}
              className={`pb-4 text-sm font-bold tracking-wide transition-all border-b-2 ${
                activeTab === "seguridad" 
                  ? "border-usagBlue text-usagBlue" 
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Seguridad y Contraseña
            </button>
          </div>

          {activeTab === "general" ? (
            <form className="space-y-6 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Nombre Completo</label>
                  <input type="text" defaultValue="Administrador Sistema" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm font-medium focus:outline-none focus:border-usagBlue focus:bg-white transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Matrícula / ID</label>
                  <input type="text" defaultValue="USAG-0001" disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 text-sm font-medium cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Correo Electrónico</label>
                  <input type="email" defaultValue="admin@usag.edu.mx" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm font-medium focus:outline-none focus:border-usagBlue focus:bg-white transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Teléfono de Contacto</label>
                  <input type="text" placeholder="+52 (477) 000 0000" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm font-medium focus:outline-none focus:border-usagBlue focus:bg-white transition-all" />
                </div>
              </div>
              <div className="pt-6 flex justify-end">
                <button type="button" className="bg-usagBlue text-white px-8 py-3 rounded-xl font-bold tracking-wide text-sm shadow-[0_8px_20px_-6px_rgba(38,56,102,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(38,56,102,0.5)] hover:-translate-y-0.5 transition-all duration-300">
                  Guardar Cambios
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6 animate-fade-in-up">
              <div className="max-w-md space-y-6">
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Contraseña Actual</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm font-medium focus:outline-none focus:border-usagBlue focus:bg-white transition-all tracking-widest" />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Nueva Contraseña</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm font-medium focus:outline-none focus:border-usagBlue focus:bg-white transition-all tracking-widest" />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Confirmar Nueva Contraseña</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm font-medium focus:outline-none focus:border-usagBlue focus:bg-white transition-all tracking-widest" />
                </div>
              </div>
              <div className="pt-6 flex justify-start">
                <button type="button" className="bg-usagBlue text-white px-8 py-3 rounded-xl font-bold tracking-wide text-sm shadow-[0_8px_20px_-6px_rgba(38,56,102,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(38,56,102,0.5)] hover:-translate-y-0.5 transition-all duration-300">
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}