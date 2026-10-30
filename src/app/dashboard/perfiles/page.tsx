"use client";
import { usePerfiles } from "../../modulos/perfiles/logica/usePerfiles";
import { TablaPerfiles } from "../../modulos/perfiles/componentes/TablaPerfiles";
import { ModalPerfil } from "../../modulos/perfiles/componentes/ModalPerfil";

export default function PerfilesPage() {
  const {
    searchTerm,
    setSearchTerm,
    perfilesData,
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
  } = usePerfiles();

  return (
    <>
      <TablaPerfiles 
        perfiles={perfilesData}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNuevoPerfil={abrirModalCreacion}
        onEditar={abrirModalEdicion}
        onEliminar={eliminarPerfil}
        userRole="admin"
      />

      <ModalPerfil 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        modoEdicion={modoEdicion}
        idPerfilActual={idPerfilActual}
        formData={formData}
        errorInput={errorInput}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onSubmit={guardarPerfil}
      />
    </>
  );
}