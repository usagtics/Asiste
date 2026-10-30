"use client";
import { useDiasFestivos } from "../../modulos/dias-festivos/logica/useDiasFestivos";
import { TablaDiasFestivos } from "../../modulos/dias-festivos/componentes/TablaDiasFestivos";
import { ModalDiaFestivo } from "../../modulos/dias-festivos/componentes/ModalDiaFestivo";

export default function DiasFestivosPage() {
  const {
    searchTerm,
    setSearchTerm,
    diasData,
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
  } = useDiasFestivos();

  return (
    <>
      <TablaDiasFestivos 
        dias={diasData}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNuevoDia={abrirModalCreacion}
        onEditar={abrirModalEdicion}
        onDesactivar={eliminarDia}
        onReactivar={reactivarDia}
        userRole="admin"
      />

      <ModalDiaFestivo 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        modoEdicion={modoEdicion}
        idDiaActual={idDiaActual}
        formData={formData}
        errorInput={errorInput}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onSubmit={guardarDiaFestivo}
      />
    </>
  );
}