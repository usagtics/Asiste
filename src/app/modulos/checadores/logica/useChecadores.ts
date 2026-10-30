import { useState, useEffect } from "react";
import { ChecadoresService } from "../servicios/checadores.service";
import { Checador, ChecadorFormData } from "../types/checadores.types";
export function useChecadores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [checadoresData, setChecadoresData] = useState<Checador[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); 
  const [idChecadorActual, setIdChecadorActual] = useState<string | null>(null); 
  
  const [formData, setFormData] = useState<ChecadorFormData>({
    nombreChecador: "",
    numeroSerie: "",
    ipDispositivo: "",
    ubicacion: "",
    activo: true
  });
  
  const [errorInput, setErrorInput] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const lista = await ChecadoresService.obtenerTodos();
      const checadoresFormateados = lista.map((ch: any) => ({
        id: (ch.idChecador || ch.id)?.toString(),
        nombre: ch.nombreChecador || ch.nombre || "",
        numeroSerie: ch.numeroSerie || "", 
        ipDispositivo: ch.ipDispositivo || "No asignada",
        ubicacion: ch.ubicacion || "Sin ubicación especificada",
        activo: ch.activo ?? ch.Activo ?? true,
      }));
      setChecadoresData(checadoresFormateados);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
    if (errorInput) setErrorInput("");
  };

  const guardarChecador = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!formData.nombreChecador.trim()) {
      setErrorInput("El nombre del checador es obligatorio.");
      return;
    }
    if (!formData.numeroSerie.trim()) {
      setErrorInput("El número de serie es obligatorio.");
      return;
    }

    setErrorInput(""); 
    setIsSubmitting(true);

    try {
      await ChecadoresService.guardar(formData, modoEdicion ? idChecadorActual : null);
      setIsDrawerOpen(false); 
      fetchData(); 
    } catch (error: any) {
      setErrorInput(error.message || "Error al conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reactivarChecador = async (ch: Checador) => {
    if (!window.confirm(`¿Deseas reactivar el checador "${ch.nombre}"?`)) return;
    try {
      await ChecadoresService.reactivar(ch.id);
      fetchData();
    } catch (error) {
      console.error("Error al reactivar:", error);
    }
  };

  const eliminarChecador = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de desactivar el checador "${nombre}"?`)) return;
    try {
      await ChecadoresService.desactivar(id);
      fetchData();
    } catch (error) {
      console.error("Error al desactivar:", error);
    }
  };

  const abrirModalEdicion = (ch: Checador) => {
    setModoEdicion(true);
    setIdChecadorActual(ch.id);
    setFormData({
      nombreChecador: ch.nombre,
      numeroSerie: ch.numeroSerie,
      ipDispositivo: ch.ipDispositivo === "No asignada" ? "" : ch.ipDispositivo,
      ubicacion: ch.ubicacion === "Sin ubicación especificada" ? "" : ch.ubicacion,
      activo: ch.activo
    });
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const abrirModalCreacion = () => {
    setModoEdicion(false);
    setIdChecadorActual(null);
    setFormData({
      nombreChecador: "",
      numeroSerie: "",
      ipDispositivo: "",
      ubicacion: "",
      activo: true
    });
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const filteredChecadores = checadoresData.filter((ch) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ch.nombre.toLowerCase().includes(searchLower) ||
      ch.numeroSerie.toLowerCase().includes(searchLower) ||
      ch.ipDispositivo.toLowerCase().includes(searchLower) ||
      ch.ubicacion.toLowerCase().includes(searchLower)
    );
  });

  return {
    searchTerm,
    setSearchTerm,
    checadoresData: filteredChecadores,
    isLoading,
    isDrawerOpen,
    setIsDrawerOpen,
    modoEdicion,
    idChecadorActual,
    formData,
    errorInput,
    isSubmitting,
    handleChange,
    guardarChecador,
    reactivarChecador,
    eliminarChecador,
    abrirModalEdicion,
    abrirModalCreacion
  };
}