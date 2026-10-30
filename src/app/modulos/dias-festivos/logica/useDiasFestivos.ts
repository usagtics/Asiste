import { useState, useEffect } from "react";
import { DiasFestivosService } from "../servicios/dias-festivos.service";
import { DiaFestivo, DiaFestivoFormData } from "../types/dias-festivos.types";
export function useDiasFestivos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [diasData, setDiasData] = useState<DiaFestivo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); 
  const [idDiaActual, setIdDiaActual] = useState<string | null>(null); 
  
  const [formData, setFormData] = useState<DiaFestivoFormData>({
    fecha: "",
    descripcionFestividad: "",
    esLaborable: false,
    activo: true
  });
  
  const [errorInput, setErrorInput] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const lista = await DiasFestivosService.obtenerTodos();
      const diasFormateados = lista.map((d: any) => ({
        id: (d.idDiaFestivo || d.id)?.toString(),
        fecha: d.fecha ? d.fecha.split("T")[0] : "",
        descripcion: d.descripcionFestividad || d.descripcion || "", 
        esLaborable: d.esLaborable ?? false,
        activo: d.activo ?? d.Activo ?? true,
      }));
      setDiasData(diasFormateados);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
    if (errorInput) setErrorInput("");
  };

  const guardarDiaFestivo = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!formData.fecha) {
      setErrorInput("La fecha es obligatoria.");
      return;
    }
    if (!formData.descripcionFestividad.trim()) {
      setErrorInput("La descripción de la festividad es obligatoria.");
      return;
    }

    setErrorInput(""); 
    setIsSubmitting(true);

    try {
      await DiasFestivosService.guardar(formData, modoEdicion ? idDiaActual : null);
      setIsDrawerOpen(false); 
      fetchData(); 
    } catch (error: any) {
      setErrorInput(error.message || "Error al conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reactivarDia = async (d: DiaFestivo) => {
    if (!window.confirm(`¿Deseas reactivar el día festivo "${d.descripcion}"?`)) return;
    try {
      await DiasFestivosService.reactivar(d.id);
      fetchData();
    } catch (error) {
      console.error("Error al reactivar:", error);
    }
  };

  const eliminarDia = async (id: string, descripcion: string) => {
    if (!window.confirm(`¿Estás seguro de desactivar el día festivo "${descripcion}"?`)) return;
    try {
      await DiasFestivosService.desactivar(id);
      fetchData();
    } catch (error) {
      console.error("Error al desactivar:", error);
    }
  };

  const abrirModalEdicion = (d: DiaFestivo) => {
    setModoEdicion(true);
    setIdDiaActual(d.id);
    setFormData({
      fecha: d.fecha,
      descripcionFestividad: d.descripcion,
      esLaborable: d.esLaborable,
      activo: d.activo
    });
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const abrirModalCreacion = () => {
    setModoEdicion(false);
    setIdDiaActual(null);
    setFormData({
      fecha: "",
      descripcionFestividad: "",
      esLaborable: false,
      activo: true
    });
    setErrorInput("");
    setIsDrawerOpen(true);
  };

  const filteredDias = diasData.filter((d) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      d.descripcion.toLowerCase().includes(searchLower) ||
      d.fecha.toLowerCase().includes(searchLower)
    );
  });

  return {
    searchTerm,
    setSearchTerm,
    diasData: filteredDias,
    isLoading,
    isDrawerOpen,
    setIsDrawerOpen,
    modoEdicion,
    idDiaActual,
    formData,
    errorInput,
    isSubmitting,
    handleChange,
    guardarDiaFestivo,
    reactivarDia,
    eliminarDia,
    abrirModalEdicion,
    abrirModalCreacion
  };
}