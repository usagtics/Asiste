"use client";
import { useChecadores } from "../../modulos/checadores/logica/useChecadores";
import { TablaChecadores } from "../../modulos/checadores/componentes/TablaChecadores";
import { ModalChecador } from "../../modulos/checadores/componentes/ModalChecador";

export default function ChecadoresPage() {
  const {
    searchTerm,
    setSearchTerm,
    checadoresData,
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
  } = useChecadores();

  return (
    <>
      <TablaChecadores 
        checadores={checadoresData}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNuevoChecador={abrirModalCreacion}
        onEditar={abrirModalEdicion}
        onDesactivar={eliminarChecador}
        onReactivar={reactivarChecador}
        userRole="admin"
      />

      <ModalChecador 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        modoEdicion={modoEdicion}
        idChecadorActual={idChecadorActual}
        formData={formData}
        errorInput={errorInput}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onSubmit={guardarChecador}
      />
    </>
  );
}