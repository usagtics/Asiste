import { useState, useEffect } from "react";
import { CampusService } from "../servicios/campus.service";
import { Campus, CampusFormData } from "../types/campus.types";

export function useCampus() {
  const [searchTerm, setSearchTerm] = useState("");
  const [campusData, setCampusData] = useState<Campus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [empresasData, setEmpresasData] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); 
  const [idCampusActual, setIdCampusActual] = useState<string | null>(null); 
  
  const [formData, setFormData] = useState<CampusFormData>({
    idEmpresa: "",
    clave: "",
    nombreCampus: "",
    calleNumero: "",
    activo: true
  });
  
  const [errorInput, setErrorInput] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [listaCampus, listaEmpresas] = await Promise.all([
        CampusService.obtenerTodos(),
        CampusService.obtenerEmpresas()
      ]);

      setEmpresasData(listaEmpresas);

      const campusFormateados = listaCampus.map((c: any) => ({
        id: c.idCampus.toString(),
        clave: c.clave || "",
        nombre: c.nombreCampus || c.nombre, 
        direccion: c.calleNumero || c.direccion || "Sin dirección especificada",
        activo: c.activo ?? c.Activo ?? true,
        idEmpresa: c.idEmpresa?.toString() || ""
      }));
      setCampusData(campusFormateados);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
    if (errorInput) setErrorInput("");
  };

  const guardarCampus = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!formData.clave.trim()) {
      setErrorInput("La clave del campus es obligatoria.");
      return;
    }
    if (!formData.nombreCampus.trim()) {
      setErrorInput("El nombre del campus no puede estar vacío.");
      return;
    }
    if (!formData.idEmpresa) {
      setErrorInput("Debes seleccionar una empresa.");
      return;
    }

    setErrorInput(""); 
    setIsSubmitting(true);

    try {
      await CampusService.guardar(formData, modoEdicion ? idCampusActual : null);
      setIsDrawerOpen(false); 
      fetchData(); 
    } catch (error: any) {
      setErrorInput(error.message || "Error al conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reactivarCampus = async (camp: Campus) => {
    if (!window.confirm(`¿Deseas reactivar el campus "${camp.nombre}"?`)) return;
    try {
      await CampusService.reactivar(camp.id);
      fetchData();
    } catch (error) {
      console.error("Error al reactivar:", error);
    }
  };

  const eliminarCampus = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de desactivar el campus "${nombre}"?`)) return;
    try {
      await CampusService.desactivar(id);
      fetchData();
    } catch (error) {
      console.error("Error al desactivar:", error);
    }
  };

  const abrirModalEdicion = (camp: Campus) => {
    setModoEdicion(true);
    setIdCampusActual(camp.id);
    setFormData({
      idEmpresa: camp.idEmpresa ? Number(camp.idEmpresa) : "",
      clave: camp.clave,
      nombreCampus: camp.nombre,
      calleNumero: camp.direccion === "Sin dirección especificada" ? "" : camp.direccion,
      activo: camp.activo
    });
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const abrirModalCreacion = () => {
    setModoEdicion(false);
    setIdCampusActual(null);
    setFormData({
      idEmpresa: "",
      clave: "",
      nombreCampus: "",
      calleNumero: "",
      activo: true
    });
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const filteredCampus = campusData.filter((camp) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      camp.nombre.toLowerCase().includes(searchLower) ||
      camp.clave.toLowerCase().includes(searchLower) ||
      camp.direccion.toLowerCase().includes(searchLower)
    );
  });

  return {
    searchTerm,
    setSearchTerm,
    campusData: filteredCampus,
    isLoading,
    empresasData,
    isDrawerOpen,
    setIsDrawerOpen,
    modoEdicion,
    idCampusActual,
    formData,
    errorInput,
    isSubmitting,
    handleChange,
    guardarCampus,
    reactivarCampus,
    eliminarCampus,
    abrirModalEdicion,
    abrirModalCreacion
  };
}