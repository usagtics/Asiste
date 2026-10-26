"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-usagBlue/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div 
        className={`bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-[1200px] min-h-[650px] flex overflow-hidden border border-white/60 transition-all duration-1000 ease-out transform z-10 ${
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-linear-to-br from-usagBlue via-usagBlue to-[#131f40] text-white p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-[0.03] blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-900 opacity-[0.05] blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center w-full text-center mt-12">
            <div className="mb-10 relative w-80 h-32 hover:scale-105 transition-transform duration-700 ease-out">
              <Image 
                src="/assets/usag.png" 
                alt="Logo Universidad San Andrés de Guanajuato" 
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-contain object-center drop-shadow-lg"
                priority
              />
            </div>
            
            <div className="space-y-6 w-full flex flex-col items-center">
              <h2 className="text-4xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-linear-to-r from-white to-blue-200">
                ASISTE
              </h2>
              <div className="w-full max-w-[280px] h-[1px] bg-linear-to-r from-transparent via-blue-300/50 to-transparent"></div>
              <p className="text-[1.05rem] font-light text-blue-50/90 max-w-[360px] leading-relaxed tracking-wide">
                Sistema Integral de Recursos Humanos y Control de Asistencias.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 text-center mb-4">
            <p className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-white/80">
              Universidad San Andrés de Guanajuato
            </p>
            <p className="text-[0.65rem] text-blue-200/50 mt-2 font-normal tracking-widest uppercase">
              Plataforma Administrativa
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-16 lg:px-24 lg:py-20 flex flex-col justify-between relative bg-white">
          
          <div className="flex-grow flex flex-col justify-center">
            <div className="md:hidden text-center mb-10">
              <h1 className="text-3xl font-extrabold text-usagBlue tracking-tight">ASISTE</h1>
              <p className="text-xs text-usagBlue/70 mt-1 font-semibold tracking-wide uppercase">Universidad San Andrés de Guanajuato</p>
            </div>

            <div className="mb-14">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Iniciar Sesión</h2>
              <p className="text-sm text-gray-500 mt-3 font-medium">
                Ingresa tus credenciales.
              </p>
            </div>
            
            <form className="space-y-8">
              <div className="space-y-2 relative group">
                <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-[0.15em] transition-colors group-focus-within:text-usagBlue">
                  Usuario / Matrícula
                </label>
                <input 
                  type="text" 
                  className="w-full border-b-2 border-gray-100 bg-transparent px-0 py-2 text-gray-800 text-lg focus:outline-none focus:border-usagBlue transition-all duration-300 placeholder-gray-300 font-medium"
                  placeholder="Ingresa tu matrícula"
                  required
                />
              </div>
              
              <div className="space-y-2 relative group pt-2">
                <label className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-[0.15em] transition-colors group-focus-within:text-usagBlue">
                  Contraseña
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full border-b-2 border-gray-100 bg-transparent px-0 py-2 pr-10 text-gray-800 text-lg focus:outline-none focus:border-usagBlue transition-all duration-300 placeholder-gray-300 font-medium tracking-widest"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-usagBlue transition-colors focus:outline-none"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="pt-8">
                <button 
                  type="submit" 
                  className="w-full bg-linear-to-r from-usagBlue to-[#2f457d] text-white py-4 rounded-xl font-bold tracking-wide text-[0.95rem] shadow-[0_8px_20px_-6px_rgba(38,56,102,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(38,56,102,0.6)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
                >
                  Ingresar al Sistema
                </button>
              </div>
            </form>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-100 text-center">
            <p className="text-[0.65rem] font-bold text-gray-400 tracking-widest uppercase">
              &copy; {new Date().getFullYear()} Universidad San Andrés de Guanajuato.
            </p>
          </div>
          
        </div>
      </div>
    </main>
  );
}