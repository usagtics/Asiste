"use client";
import { useCampus } from "../../modulos/campus/logica/useCampus";
import { TablaCampus } from "../../modulos/campus/componentes/TablaCampus";
import { ModalCampus } from "../../modulos/campus/componentes/ModalCampus";

export default function CampusPage() {
  const {
    searchTerm,
    setSearchTerm,
    campusData,
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
  } = useCampus();

  return (
    <>
      <TablaCampus 
        campus={campusData}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNuevoCampus={abrirModalCreacion}
        onEditar={abrirModalEdicion}
        onDesactivar={eliminarCampus}
        onReactivar={reactivarCampus}
        userRole="admin"
      />

      <ModalCampus 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        modoEdicion={modoEdicion}
        idCampusActual={idCampusActual}
        formData={formData}
        empresasData={empresasData}
        errorInput={errorInput}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onSubmit={guardarCampus}
      />
    </>
  );
}