"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCatalogosOpen, setIsCatalogosOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const catalogosItems = [
    { name: "Empleados", href: "/dashboard/empleados", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { name: "Departamentos", href: "/dashboard/departamentos", icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" },
    { name: "Perfiles", href: "/dashboard/perfiles", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
    { name: "Reglas de Asistencia", href: "/dashboard/reglas-asistencia", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] dark:bg-gray-900 flex font-sans selection:bg-blue-200 selection:text-blue-900 transition-colors duration-300">
      
      <aside 
        className={`${
          isSidebarOpen ? "w-[260px]" : "w-[88px]"
        } bg-linear-to-b from-usagBlue via-usagBlue to-[#131f40] dark:from-gray-900 dark:via-gray-900 dark:to-black text-white transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.04)] dark:border-r dark:border-gray-800`}
      >
        <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-white/5 to-transparent pointer-events-none"></div>

        <div className="h-28 flex items-center justify-between px-6 pt-4 relative z-10">
          <div className={`flex items-center gap-4 overflow-hidden transition-opacity duration-300 ${!isSidebarOpen ? "opacity-0 w-0" : "opacity-100"}`}>
            <div className="w-36 h-16 relative shrink-0 bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20 shadow-lg">
               <Image src="/assets/usag.png" alt="USAG" fill className="object-contain p-1" priority />
            </div>
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all focus:outline-none shrink-0"
            aria-label="Toggle Sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M12 12h8.25m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto relative z-10 scrollbar-hide">
          
          <Link 
            href="/dashboard"
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
              pathname === "/dashboard" 
                ? "text-white shadow-lg shadow-black/10 bg-white/10" 
                : "text-blue-100/50 hover:text-white hover:bg-white/5"
            }`}
          >
            {pathname === "/dashboard" && (
              <div className="absolute inset-0 bg-linear-to-r from-white/20 to-white/5 opacity-100 border border-white/10"></div>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={pathname === "/dashboard" ? 2 : 1.5} stroke="currentColor" className="w-5 h-5 shrink-0 relative z-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className={`font-semibold text-[0.9rem] tracking-wide relative z-10 whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen && "opacity-0 w-0 hidden"}`}>
              Resumen
            </span>
          </Link>

          <div className="pt-2">
            {isSidebarOpen && (
              <p className="px-4 text-[0.65rem] font-bold text-blue-100/40 uppercase tracking-widest mb-2">
                Catálogos y Estructura
              </p>
            )}
            
            <div className="space-y-1">
              {catalogosItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? "text-white bg-white/10 shadow-md border border-white/10" 
                        : "text-blue-100/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={isActive ? 2 : 1.5} stroke="currentColor" className="w-4 h-4 shrink-0 relative z-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    <span className={`font-semibold text-[0.85rem] tracking-wide relative z-10 whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen && "opacity-0 w-0 hidden"}`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
            <Link 
              href="/dashboard/asistencias"
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                pathname === "/dashboard/asistencias" 
                  ? "text-white shadow-lg shadow-black/10 bg-white/10" 
                  : "text-blue-100/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {pathname === "/dashboard/asistencias" && (
                <div className="absolute inset-0 bg-linear-to-r from-white/20 to-white/5 opacity-100 border border-white/10"></div>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 relative z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-semibold text-[0.9rem] tracking-wide relative z-10 whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen && "opacity-0 w-0 hidden"}`}>
                Asistencias
              </span>
            </Link>

            <Link 
              href="/dashboard/reportes"
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                pathname === "/dashboard/reportes" 
                  ? "text-white shadow-lg shadow-black/10 bg-white/10" 
                  : "text-blue-100/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {pathname === "/dashboard/reportes" && (
                <div className="absolute inset-0 bg-linear-to-r from-white/20 to-white/5 opacity-100 border border-white/10"></div>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 relative z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className={`font-semibold text-[0.9rem] tracking-wide relative z-10 whitespace-nowrap transition-opacity duration-300 ${!isSidebarOpen && "opacity-0 w-0 hidden"}`}>
                Reportes / Pre-nómina
              </span>
            </Link>
          </div>

        </nav>

        <div className="p-6 relative z-10">
          <Link 
            href="/dashboard/profile"
            className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group ${
              isSidebarOpen ? "bg-white/10 hover:bg-white/20 border border-white/10 shadow-sm" : "justify-center hover:bg-white/10"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm shrink-0 shadow-inner border border-white/20 text-white group-hover:scale-105 transition-transform duration-300">
              AD
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold text-white truncate">Administrador</p>
                <p className="text-[0.65rem] text-blue-100/60 truncate font-semibold uppercase tracking-widest mt-0.5">admin@usag.edu.mx</p>
              </div>
            )}
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        <header className="h-24 bg-[#F4F7F9]/70 dark:bg-gray-900/70 backdrop-blur-2xl flex items-center justify-between px-10 z-10 shrink-0 transition-colors duration-300 border-b border-transparent dark:border-gray-800">
          
          <div className="flex items-center gap-3 text-[0.8rem] font-bold uppercase tracking-widest text-gray-400">
            <span className="text-gray-400/60 dark:text-gray-500 hidden sm:block">USAG</span>
            <span className="text-gray-300 dark:text-gray-600 hidden sm:block">/</span>
            <span className="text-usagBlue dark:text-white transition-colors duration-300">Portal Administrativo</span>
          </div>
          
          <div className="flex items-center gap-6">
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-gray-400 hover:text-usagBlue dark:text-gray-500 dark:hover:text-amber-400 transition-all hover:scale-110 focus:outline-none bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700"
              title={isDarkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            <button className="relative p-2 text-gray-400 hover:text-usagBlue dark:hover:text-blue-400 transition-all hover:scale-110 focus:outline-none">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>
            
            <Link 
              href="/login" 
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 text-[0.75rem] font-bold text-gray-500 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 border border-transparent dark:border-gray-700 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 uppercase tracking-widest"
            >
              Cerrar Sesión
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-10 pt-4 relative">
          {children}
        </main>
      </div>

    </div>
  );
}

