"use client";

export default function DashboardOverview() {
  const stats = [
    { title: "Empleados Activos", value: "248", trend: "+12% este mes", color: "from-usagBlue to-[#2f457d]" },
    { title: "Asistencias Hoy", value: "215", trend: "86% del personal", color: "from-emerald-400 to-emerald-500" },
    { title: "Faltas / Retardos", value: "14", trend: "-3% vs ayer", color: "from-rose-400 to-rose-500" },
    { title: "Turnos Cubiertos", value: "100%", trend: "Operación normal", color: "from-slate-500 to-slate-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-usagBlue tracking-tight">Panel de Control</h1>
        <p className="text-usagBlue/60 text-sm font-medium tracking-wide">Resumen general del Sistema Integral de Recursos Humanos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-usagBlue/5 hover:border-usagBlue/10 hover:shadow-[0_8px_30px_rgba(38,56,102,0.08)] transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[0.7rem] font-bold text-usagBlue/50 uppercase tracking-widest transition-colors group-hover:text-usagBlue/70">{stat.title}</h3>
              <div className={`w-3 h-3 rounded-full bg-linear-to-br ${stat.color} shadow-sm`}></div>
            </div>
            <p className="text-4xl font-black text-usagBlue tracking-tight">{stat.value}</p>
            <p className="text-xs font-semibold text-usagBlue/40 mt-2">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="bg-white w-full min-h-[400px] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-usagBlue/5 p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-usagBlue/5 rounded-2xl flex items-center justify-center mx-auto mb-2 transition-transform hover:scale-105 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-usagBlue/40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-usagBlue">Módulo de Actividad Reciente</h3>
          <p className="text-[0.85rem] font-medium text-usagBlue/50 max-w-sm mx-auto leading-relaxed">
            Aquí implementaremos la tabla de los últimos registros biométricos o gráficas de asistencia en el siguiente paso.
          </p>
        </div>
      </div>

    </div>
  );
}