import { useState, useEffect } from "react";
import { PerfilesService } from "../servicios/perfiles.service";
import { Perfil, PerfilFormData } from "../types/perfiles.types";
export function usePerfiles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [perfilesData, setPerfilesData] = useState<Perfil[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); 
  const [idPerfilActual, setIdPerfilActual] = useState<string | null>(null);  
  
  const [formData, setFormData] = useState<PerfilFormData>({
    nombrePerfil: ""
  });
  
  const [errorInput, setErrorInput] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const fetchPerfiles = async () => {
    try {
      setIsLoading(true);
      const data = await PerfilesService.obtenerTodos();
      const perfilesFormateados = data.map((p: any) => ({
        id: (p.idPerfil ?? p.id ?? "").toString(),
        nombre: p.nombrePerfil ?? p.nombre ?? "",
        activo: p.activo ?? p.Activo ?? true
      }));
      setPerfilesData(perfilesFormateados);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfiles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errorInput) setErrorInput("");
  };

  const guardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!formData.nombrePerfil.trim()) {
      setErrorInput("El nombre del perfil no puede estar vacío.");
      return;
    }

    if (formData.nombrePerfil.trim().length < 3) {
      setErrorInput("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    setErrorInput(""); 
    setIsSubmitting(true);

    try {
      await PerfilesService.guardar(formData, modoEdicion ? idPerfilActual : null);
      setIsDrawerOpen(false); 
      fetchPerfiles(); 
    } catch (error: any) {
      setErrorInput(error.message || "Error al conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const abrirModalEdicion = (perfil: Perfil) => {
    setModoEdicion(true);
    setIdPerfilActual(perfil.id);
    setFormData({ nombrePerfil: perfil.nombre });
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const abrirModalCreacion = () => {
    setModoEdicion(false);
    setIdPerfilActual(null);
    setFormData({ nombrePerfil: "" });
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const eliminarPerfil = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el perfil "${nombre}"?`)) return;

    try {
      await PerfilesService.eliminar(id);
      fetchPerfiles();
    } catch (error) {
      console.error("Error al intentar eliminar:", error);
      alert("No se pudo eliminar el perfil. Es posible que tenga registros asociados.");
    }
  };

  const filteredPerfiles = perfilesData.filter((perfil) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      perfil.nombre.toLowerCase().includes(searchLower) ||
      perfil.id.toLowerCase().includes(searchLower)
    );
  });

  return {
    searchTerm,
    setSearchTerm,
    perfilesData: filteredPerfiles,
    isLoading,
    isDrawerOpen,
    setIsDrawerOpen,
    modoEdicion,
    idPerfilActual,
    formData,
    errorInput,
    isSubmitting,
    handleChange,
    guardarPerfil,
    eliminarPerfil,
    abrirModalEdicion,
    abrirModalCreacion
  };
}