import { useState, useEffect } from "react";
import { EmpresasService } from "../servicios/empresas.service";
import { Empresa, EmpresaFormData } from "../types/empresas.types";

export function useEmpresas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [empresasData, setEmpresasData] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [regimenesData, setRegimenesData] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEmpresaActual, setIdEmpresaActual] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<EmpresaFormData>({
    razonSocial: "",
    nombreComercial: "",
    rfc: "",
    codigoPostalExpedicion: "",
    idRegimenFiscal: "",
    activo: true
  });
  
  const [errorInput, setErrorInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [listaEmpresas, listaRegimenes] = await Promise.all([
        EmpresasService.obtenerTodas(),
        EmpresasService.obtenerRegimenes()
      ]);

      setRegimenesData(listaRegimenes);
      
      const empresasFormateadas = listaEmpresas.map((e: any) => ({
        id: e.idEmpresa?.toString(),
        razonSocial: e.razonSocial || "",
        nombreComercial: e.nombreComercial || "", 
        rfc: e.rfc || "",
        codigoPostalExpedicion: e.codigoPostalExpedicion || "",
        idRegimenFiscal: e.idRegimenFiscal?.toString() || "",
        activo: e.activo ?? e.Activo ?? true,
      }));
      setEmpresasData(empresasFormateadas);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
    if (errorInput) setErrorInput("");
  };

  const guardarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.razonSocial.trim()) {
      setErrorInput("La razón social es obligatoria.");
      return;
    }
    if (!formData.rfc.trim()) {
      setErrorInput("El RFC es obligatorio.");
      return;
    }
    if (!formData.idRegimenFiscal) {
      setErrorInput("Debes seleccionar un régimen fiscal.");
      return;
    }

    setErrorInput("");
    setIsSubmitting(true);

    try {
      await EmpresasService.guardar(formData, modoEdicion ? idEmpresaActual : null);
      setIsDrawerOpen(false);
      fetchData();
    } catch (error: any) {
      setErrorInput(error.message || "Error al conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reactivarEmpresa = async (emp: Empresa) => {
    if (!window.confirm(`¿Deseas reactivar la empresa "${emp.razonSocial}"?`)) return;
    try {
      await EmpresasService.reactivar(emp.id);
      fetchData();
    } catch (error) {
      console.error("Error al reactivar:", error);
    }
  };

  const eliminarEmpresa = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de desactivar la empresa "${nombre}"?`)) return;
    try {
      await EmpresasService.desactivar(id);
      fetchData();
    } catch (error) {
      console.error("Error al desactivar:", error);
    }
  };

  const abrirModalEdicion = (emp: Empresa) => {
    setModoEdicion(true);
    setIdEmpresaActual(emp.id);
    setFormData({
      razonSocial: emp.razonSocial,
      nombreComercial: emp.nombreComercial,
      rfc: emp.rfc,
      codigoPostalExpedicion: emp.codigoPostalExpedicion,
      idRegimenFiscal: emp.idRegimenFiscal,
      activo: emp.activo
    });
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const abrirModalCreacion = () => {
    setModoEdicion(false);
    setIdEmpresaActual(null);
    setFormData({
      razonSocial: "",
      nombreComercial: "",
      rfc: "",
      codigoPostalExpedicion: "",
      idRegimenFiscal: "",
      activo: true
    });
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const filteredEmpresas = empresasData.filter((emp) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      emp.razonSocial.toLowerCase().includes(searchLower) ||
      emp.nombreComercial.toLowerCase().includes(searchLower) ||
      emp.rfc.toLowerCase().includes(searchLower)
    );
  });

  return {
    searchTerm,
    setSearchTerm,
    empresasData: filteredEmpresas,
    isLoading,
    regimenesData,
    isDrawerOpen,
    setIsDrawerOpen,
    modoEdicion,
    formData,
    errorInput,
    isSubmitting,
    handleChange,
    guardarEmpresa,
    reactivarEmpresa,
    eliminarEmpresa,
    abrirModalEdicion,
    abrirModalCreacion
  };
}