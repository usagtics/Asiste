"use client";
import React, { useState, useEffect } from 'react';
import { EmpleadosService } from '../servicios/empleados.service';
import { EmpleadoFormData } from '../types/empleado.types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmpleadoGuardado: () => void;
  empleadoAEditar?: any | null;
}

export const ModalNuevoEmpleado = ({ isOpen, onClose, onEmpleadoGuardado, empleadoAEditar }: ModalProps) => {
  const [seccionActiva, setSeccionActiva] = useState<'personal' | 'laboral' | 'sueldos' | 'horarios'>('personal');

  const [formData, setFormData] = useState<Partial<EmpleadoFormData>>({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    curp: '',
    rfc: '',
    correoElectronico: '',
    telefono: '',
    extensionTelefono: '',
    idEmpresa: 1,
    idDepartamento: undefined,
    idPerfil: undefined,
    idPuesto: undefined,
    idCampus: undefined,
    idJefeDirecto: undefined,
    numeroChecador: undefined,
    idModoChecada: undefined,
    matricula: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    avisoPrivacidadBiometricos: true,
    idRolAcceso: undefined,
    idEstatusLaboral: 1,
    activo: true
  });

  const [sueldosData, setSueldosData] = useState<any[]>([]);
  const [nuevoSueldo, setNuevoSueldo] = useState({ sueldoDiario: '', sueldoMensual: '', fechaInicio: '' });

  const [catalogos, setCatalogos] = useState({
    empresas: [],
    departamentos: [],
    puestos: [],
    campus: [],
    perfiles: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSeccionActiva('personal');
      cargarCatalogos();
      if (empleadoAEditar) {
        const empId = empleadoAEditar.rawId || empleadoAEditar.id;
        cargarSueldos(empId);
        setFormData({
          nombre: empleadoAEditar.raw?.nombre || empleadoAEditar.nombre || '',
          apellidoPaterno: empleadoAEditar.raw?.apellidoPaterno || '',
          apellidoMaterno: empleadoAEditar.raw?.apellidoMaterno || '',
          curp: empleadoAEditar.raw?.curp || '',
          rfc: empleadoAEditar.raw?.rfc || '',
          correoElectronico: empleadoAEditar.raw?.correoElectronico || empleadoAEditar.email || '',
          telefono: empleadoAEditar.raw?.telefono || '',
          extensionTelefono: empleadoAEditar.raw?.extensionTelefono || '',
          idEmpresa: empleadoAEditar.raw?.idEmpresa || 1,
          idDepartamento: empleadoAEditar.raw?.idDepartamento || undefined,
          idPerfil: empleadoAEditar.raw?.idPerfil || undefined,
          idPuesto: empleadoAEditar.raw?.idPuesto || undefined,
          idCampus: empleadoAEditar.raw?.idCampus || undefined,
          idJefeDirecto: empleadoAEditar.raw?.idJefeDirecto || undefined,
          numeroChecador: empleadoAEditar.raw?.numeroChecador || undefined,
          idModoChecada: empleadoAEditar.raw?.idModoChecada || undefined,
          matricula: empleadoAEditar.raw?.matricula || empleadoAEditar.id || '',
          fechaIngreso: empleadoAEditar.raw?.fechaIngreso ? empleadoAEditar.raw.fechaIngreso.split('T')[0] : new Date().toISOString().split('T')[0],
          avisoPrivacidadBiometricos: empleadoAEditar.raw?.avisoPrivacidadBiometricos ?? true,
          idRolAcceso: empleadoAEditar.raw?.idRolAcceso || undefined,
          idEstatusLaboral: empleadoAEditar.raw?.idEstatusLaboral || 1,
          activo: empleadoAEditar.raw?.activo ?? (empleadoAEditar.estado === 'Activo')
        });
      } else {
        setSueldosData([]);
        setFormData({
          nombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          curp: '',
          rfc: '',
          correoElectronico: '',
          telefono: '',
          extensionTelefono: '',
          idEmpresa: 1,
          idDepartamento: undefined,
          idPerfil: undefined,
          idPuesto: undefined,
          idCampus: undefined,
          idJefeDirecto: undefined,
          numeroChecador: undefined,
          idModoChecada: undefined,
          matricula: '',
          fechaIngreso: new Date().toISOString().split('T')[0],
          avisoPrivacidadBiometricos: true,
          idRolAcceso: undefined,
          idEstatusLaboral: 1,
          activo: true
        });
      }
    }
  }, [isOpen, empleadoAEditar]);

  const cargarCatalogos = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };
      const baseUrl = "https://localhost:7097/api/catalogos";

      const [resEmp, resDep, resPue, resCam, resPer] = await Promise.all([
        fetch(`${baseUrl}/admin/empresas?incluirInactivos=true`, { headers }).catch(() => ({ ok: false })),
        fetch(`${baseUrl}/admin/departamentos?incluirInactivos=true`, { headers }).catch(() => ({ ok: false })),
        fetch(`${baseUrl}/admin/puestos?incluirInactivos=true`, { headers }).catch(() => ({ ok: false })),
        fetch(`${baseUrl}/admin/campus?incluirInactivos=true`, { headers }).catch(() => ({ ok: false })),
        fetch(`${baseUrl}/admin/perfiles?incluirInactivos=true`, { headers }).catch(() => ({ ok: false }))
      ]);

      const getJson = async (res: any) => {
        if (!res.ok) return [];
        const data = await res.json();
        return data.elementos || data;
      };

      setCatalogos({
        empresas: await getJson(resEmp),
        departamentos: await getJson(resDep),
        puestos: await getJson(resPue),
        campus: await getJson(resCam),
        perfiles: await getJson(resPer)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const cargarSueldos = async (id: string | number) => {
    try {
      const data = await EmpleadosService.obtenerSueldos(id);
      setSueldosData(data.elementos || data || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const carga = {
        ...formData,
        idEmpresa: Number(formData.idEmpresa),
        idDepartamento: formData.idDepartamento ? Number(formData.idDepartamento) : null,
        idPerfil: formData.idPerfil ? Number(formData.idPerfil) : null,
        idPuesto: formData.idPuesto ? Number(formData.idPuesto) : null,
        idCampus: formData.idCampus ? Number(formData.idCampus) : null,
        idJefeDirecto: formData.idJefeDirecto ? Number(formData.idJefeDirecto) : null,
        numeroChecador: formData.numeroChecador ? Number(formData.numeroChecador) : null,
        idModoChecada: formData.idModoChecada ? Number(formData.idModoChecada) : null,
        idRolAcceso: formData.idRolAcceso ? Number(formData.idRolAcceso) : null,
        idEstatusLaboral: Number(formData.idEstatusLaboral)
      };

      await EmpleadosService.guardar(carga, empleadoAEditar ? empleadoAEditar.rawId || empleadoAEditar.id : null);
      onEmpleadoGuardado();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el empleado');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarSueldoExtra = async () => {
    if (!empleadoAEditar) return;
    try {
      await EmpleadosService.guardarSueldo(empleadoAEditar.rawId || empleadoAEditar.id, {
        sueldoDiario: Number(nuevoSueldo.sueldoDiario),
        sueldoMensual: Number(nuevoSueldo.sueldoMensual),
        fechaInicio: nuevoSueldo.fechaInicio
      });
      setNuevoSueldo({ sueldoDiario: '', sueldoMensual: '', fechaInicio: '' });
      cargarSueldos(empleadoAEditar.rawId || empleadoAEditar.id);
    } catch (err: any) {
      setError(err.message || 'Error al guardar sueldo');
    }
  };

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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">{empleadoAEditar ? "Editar Expediente de Empleado" : "Registrar Nuevo Empleado"}</h2>
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

          <div className="px-8 py-3 bg-slate-100 dark:bg-gray-800/80 border-b border-slate-200 dark:border-gray-700 flex gap-2 shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSeccionActiva('personal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${seccionActiva === 'personal' ? 'bg-usagBlue text-white shadow-sm' : 'text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700'}`}
            >
              1. Datos Personales
            </button>
            <button
              type="button"
              onClick={() => setSeccionActiva('laboral')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${seccionActiva === 'laboral' ? 'bg-usagBlue text-white shadow-sm' : 'text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700'}`}
            >
              2. Info Institucional
            </button>
            <button
              type="button"
              onClick={() => setSeccionActiva('sueldos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${seccionActiva === 'sueldos' ? 'bg-usagBlue text-white shadow-sm' : 'text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700'}`}
            >
              3. Historial de Sueldos
            </button>
            <button
              type="button"
              onClick={() => setSeccionActiva('horarios')}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${seccionActiva === 'horarios' ? 'bg-usagBlue text-white shadow-sm' : 'text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700'}`}
            >
              4. Horarios y Turnos
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 dark:bg-gray-900/50 pb-32">
            <form id="formEmpleado" onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-center gap-3 animate-shake">
                  <span className="font-bold">Error:</span> {error}
                </div>
              )}

              {seccionActiva === 'personal' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-xs space-y-4 animate-fade-in">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Información Personal y de Contacto</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Nombre(s) *</label>
                      <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white" placeholder="Nombre" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Ap. Paterno *</label>
                      <input type="text" name="apellidoPaterno" required value={formData.apellidoPaterno} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white" placeholder="Paterno" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Ap. Materno</label>
                      <input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white" placeholder="Materno" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">CURP</label>
                      <input type="text" name="curp" value={formData.curp} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white uppercase" placeholder="CURP" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">RFC</label>
                      <input type="text" name="rfc" value={formData.rfc} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white uppercase" placeholder="RFC" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Correo Electrónico</label>
                      <input type="email" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white" placeholder="correo@usag.edu.mx" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Teléfono</label>
                      <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white" placeholder="Teléfono" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Extensión</label>
                      <input type="text" name="extensionTelefono" value={formData.extensionTelefono} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white" placeholder="Ext." />
                    </div>
                  </div>
                </div>
              )}

              {seccionActiva === 'laboral' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-xs space-y-4 animate-fade-in">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Información Institucional y Organizacional</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Matrícula *</label>
                      <input type="text" name="matricula" required value={formData.matricula} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white" placeholder="Ej. E004" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">No. Checador</label>
                      <input type="number" name="numeroChecador" value={formData.numeroChecador ?? ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white" placeholder="ID biométrico" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Fecha de Ingreso</label>
                      <input type="date" name="fechaIngreso" value={formData.fechaIngreso} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Empresa</label>
                      <select name="idEmpresa" value={formData.idEmpresa} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white">
                        {catalogos.empresas.map((emp: any) => (
                          <option key={emp.idEmpresa || emp.id} value={emp.idEmpresa || emp.id}>{emp.razonSocial || emp.nombreComercial}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Departamento</label>
                      <select name="idDepartamento" value={formData.idDepartamento ?? ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white">
                        <option value="">-- Seleccionar --</option>
                        {catalogos.departamentos.map((dep: any) => (
                          <option key={dep.idDepartamento || dep.id} value={dep.idDepartamento || dep.id}>{dep.nombreDepartamento || dep.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Puesto</label>
                      <select name="idPuesto" value={formData.idPuesto ?? ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white">
                        <option value="">-- Seleccionar --</option>
                        {catalogos.puestos.map((pue: any) => (
                          <option key={pue.idPuesto || pue.id} value={pue.idPuesto || pue.id}>{pue.nombrePuesto || pue.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Campus</label>
                      <select name="idCampus" value={formData.idCampus ?? ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white">
                        <option value="">-- Seleccionar --</option>
                        {catalogos.campus.map((cam: any) => (
                          <option key={cam.idCampus || cam.id} value={cam.idCampus || cam.id}>{cam.nombreCampus || cam.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Perfil</label>
                      <select name="idPerfil" value={formData.idPerfil ?? ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white">
                        <option value="">-- Seleccionar --</option>
                        {catalogos.perfiles.map((per: any) => (
                          <option key={per.idPerfil || per.id} value={per.idPerfil || per.id}>{per.nombrePerfil || per.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[0.7rem] font-bold text-slate-500 uppercase">Estatus Laboral</label>
                      <select name="idEstatusLaboral" value={formData.idEstatusLaboral} onChange={handleChange} className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm dark:text-white">
                        <option value={1}>Activo</option>
                        <option value={2}>Baja</option>
                        <option value={3}>Licencia / Suspendido</option>
                      </select>
                    </div>
                  </div>

                  {empleadoAEditar && (
                    <div className="flex items-center gap-3 pt-2">
                      <input type="checkbox" id="checkActivoEmp" name="activo" checked={formData.activo} onChange={handleChange} className="w-4 h-4 text-usagBlue rounded border-gray-300" />
                      <label htmlFor="checkActivoEmp" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">Empleado Activo en el Sistema</label>
                    </div>
                  )}
                </div>
              )}

              {seccionActiva === 'sueldos' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-xs space-y-4 animate-fade-in">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Historial de Sueldos y Percepciones</h3>
                  
                  {empleadoAEditar ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-gray-900 p-4 rounded-xl border">
                        <div>
                          <label className="text-[0.65rem] font-bold text-slate-500 uppercase">Sueldo Diario</label>
                          <input type="number" step="0.01" value={nuevoSueldo.sueldoDiario} onChange={(e) => setNuevoSueldo({ ...nuevoSueldo, sueldoDiario: e.target.value })} className="w-full border rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 dark:text-white" placeholder="0.00" />
                        </div>
                        <div>
                          <label className="text-[0.65rem] font-bold text-slate-500 uppercase">Sueldo Mensual</label>
                          <input type="number" step="0.01" value={nuevoSueldo.sueldoMensual} onChange={(e) => setNuevoSueldo({ ...nuevoSueldo, sueldoMensual: e.target.value })} className="w-full border rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 dark:text-white" placeholder="0.00" />
                        </div>
                        <div>
                          <label className="text-[0.65rem] font-bold text-slate-500 uppercase">Fecha Inicio</label>
                          <div className="flex gap-2">
                            <input type="date" value={nuevoSueldo.fechaInicio} onChange={(e) => setNuevoSueldo({ ...nuevoSueldo, fechaInicio: e.target.value })} className="w-full border rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 dark:text-white" />
                            <button type="button" onClick={handleGuardarSueldoExtra} className="bg-usagBlue text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer">Agregar</button>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b text-slate-400">
                              <th className="py-2">Sueldo Diario</th>
                              <th className="py-2">Sueldo Mensual</th>
                              <th className="py-2">Fecha Inicio</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {sueldosData.map((s: any, idx: number) => (
                              <tr key={idx}>
                                <td className="py-2 font-medium">${s.sueldoDiario}</td>
                                <td className="py-2 font-medium">${s.sueldoMensual}</td>
                                <td className="py-2">{s.fechaInicio ? s.fechaInicio.split('T')[0] : 'N/A'}</td>
                              </tr>
                            ))}
                            {sueldosData.length === 0 && (
                              <tr>
                                <td colSpan={3} className="py-4 text-center text-slate-400">No hay registros de sueldos.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic p-4 bg-slate-50 dark:bg-gray-900 rounded-xl text-center">Primero guarda el registro base del empleado para poder gestionar sus sueldos y horarios.</p>
                  )}
                </div>
              )}

              {seccionActiva === 'horarios' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-xs space-y-4 animate-fade-in">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Horarios y Turnos Asignados</h3>
                  <p className="text-sm text-slate-500 italic p-4 bg-slate-50 dark:bg-gray-900 rounded-xl text-center">Configuración de turnos y checadores biométricos disponible próximamente para este perfil.</p>
                </div>
              )}

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
              form="formEmpleado"
              disabled={loading}
              className="bg-gradient-to-r from-usagBlue to-[#2f457d] hover:shadow-[0_8px_20px_-6px_rgba(38,56,102,0.4)] text-white px-8 py-2.5 rounded-xl font-bold tracking-wide text-sm shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center min-w-[150px] cursor-pointer"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                empleadoAEditar ? "Actualizar Cambios" : "Guardar Empleado"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};