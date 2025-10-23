import { useState, useId } from "react";
import { BasuraIcon, LoadingIcon } from "../../assets/iconos.jsx";
import { useClientes } from "./variablesClientes.js";
import { TablaClientes } from "./tablaClientes.jsx";

export function Clientes() {
  const inputIdUsuarioId = useId();
  const inputNombreId = useId();
  const inputPedidosId = useId();
  const inputUltimoPedidoId = useId();

  const { clientes, isLoading, isError, error, refetch } = useClientes();

  const [filtersClientes, setFilterClientes] = useState({
    id_usuario: "",
    nombre: "",
    pedidos: "",
    ultimo_pedido: "",
  });

  const filterClientes = (clientes) => {
    return clientes.filter((cliente) => {
      return (
        (filtersClientes.id_usuario === "" ||
          cliente.id_usuario.toString().includes(filtersClientes.id_usuario)) &&
        (filtersClientes.nombre === "" ||
          cliente.cliente
            .toLowerCase()
            .includes(filtersClientes.nombre.toLowerCase())) &&
        (filtersClientes.pedidos === "" ||
          cliente.pedidos.toString().includes(filtersClientes.pedidos)) &&
        (filtersClientes.ultimo_pedido === "" ||
          cliente.ultimo_pedido
            .toString()
            .includes(filtersClientes.ultimo_pedido))
      );
    });
  };

  function clearFilters() {
    setFilterClientes({
      id_usuario: "",
      nombre: "",
      pedidos: "",
      ultimo_pedido: "",
    });
  }

  const filteredClientes = filterClientes(clientes);

  const handleIdUsuarioChange = (e) => {
    setFilterClientes((prev) => ({ ...prev, id_usuario: e.target.value }));
  };

  const handleNombreChange = (e) => {
    setFilterClientes((prev) => ({
      ...prev,
      nombre: e.target.value,
    }));
  };

  const handlePedidosChange = (e) => {
    setFilterClientes((prev) => ({
      ...prev,
      pedidos: e.target.value,
    }));
  };

  const handleUltimoPedidoChange = (e) => {
    setFilterClientes((prev) => ({
      ...prev,
      ultimo_pedido: e.target.value,
    }));
  };

  return (
    <section className="bg-[#111827] p-6 rounded-lg shadow-md shadow-[#374151] mt-5">
      <div className="flex flex-row items-center justify-center gap-5">
        <h2 className="text-2xl font-bold text-[#F9FAFB] mb-2">
          Hola, administrador
        </h2>
        <p className="text-[#9CA3AF]">
          Aqui podras ver los clientes registrados.
        </p>
      </div>

      <h3 className="text-xl text-center font-semibold text-[#F9FAFB] mt-4 mb-2">
        Clientes
      </h3>

      {clientes.length > 0 && (
        <form
          className="flex flex-col justify-evenly sm:flex-row flex-wrap gap-4 mb-6"
          aria-label="Filtros de clientes"
        >
          <fieldset className="flex flex-col min-w-[150px]">
            <legend className="sr-only">Filtro por ID de Usuario</legend>
            <label
              htmlFor={inputIdUsuarioId}
              className="text-sm text-[#CBD5E1] mb-1"
            >
              ID Usuario
            </label>
            <input
              id={inputIdUsuarioId}
              type="text"
              value={filtersClientes.id_usuario}
              placeholder="Ej: 101"
              className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] 
              text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none 
              focus:ring-2 focus:ring-[#3B82F6]"
              onChange={handleIdUsuarioChange}
            />
          </fieldset>

          <fieldset className="flex flex-col min-w-[180px]">
            <legend className="sr-only">Filtro por Nombre de Cliente</legend>
            <label
              htmlFor={inputNombreId}
              className="text-sm text-[#CBD5E1] mb-1"
            >
              Nombre de Cliente
            </label>
            <input
              id={inputNombreId}
              type="text"
              value={filtersClientes.nombre}
              placeholder="Ej: Juan Pérez"
              className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] 
              text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none 
              focus:ring-2 focus:ring-[#3B82F6]"
              onChange={handleNombreChange}
            />
          </fieldset>

          <fieldset className="flex flex-col min-w-[180px]">
            <legend className="sr-only">Filtro por numero de Pedidos</legend>
            <label
              htmlFor={inputPedidosId}
              className="text-sm text-[#CBD5E1] mb-1"
            >
              Pedidos
            </label>
            <input
              id={inputPedidosId}
              type="text"
              value={filtersClientes.pedidos}
              placeholder="Ej: 10"
              className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] 
              text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none 
              focus:ring-2 focus:ring-[#3B82F6]"
              onChange={handlePedidosChange}
            />
          </fieldset>

          <fieldset className="flex flex-col min-w-[150px]">
            <legend className="sr-only">Filtro por ID de ultimo pedido</legend>
            <label
              htmlFor={inputUltimoPedidoId}
              className="text-sm text-[#CBD5E1] mb-1"
            >
              Ultimo Pedido
            </label>
            <input
              id={inputUltimoPedidoId}
              type="text"
              value={filtersClientes.ultimo_pedido}
              placeholder="Ej: 104"
              className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] 
              text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none 
              focus:ring-2 focus:ring-[#3B82F6]"
              onChange={handleUltimoPedidoChange}
            />
          </fieldset>

          <div className="flex items-end w-full sm:w-auto">
            <button
              onClick={() => clearFilters()}
              className="bg-[#991B1B] hover:bg-[#B91C1C] text-white px-4 py-2 rounded-lg text-sm 
              transition-all duration-300 cursor-pointer flex items-center gap-1"
            >
              <BasuraIcon /> Limpiar Filtros
            </button>
          </div>
          <div className="flex items-end w-full sm:w-auto">
            <button
              onClick={() => refetch()}
              className="bg-[#3B82F6] hover:bg-[#60A5FA] text-[#F9FAFB] px-4 py-2 rounded-lg text-sm
              transition-all duration-300 cursor-pointer flex items-center gap-1"
            >
              <LoadingIcon /> Actualizar Clientes
            </button>
          </div>
        </form>
      )}

      <section
        className="flex flex-col gap-4 justify-center items-center"
        aria-live="polite"
      >
        {isLoading && (
          <p className="text-[#9CA3AF]">Cargando los clientes...</p>
        )}
        {isError && (
          <p className="text-red-500">
            {error?.message || "Error al cargar los datos de los clientes."}
          </p>
        )}
        {!isLoading && !isError && clientes.length === 0 && (
          <p className="text-[#9CA3AF]">No hay clientes registrados.</p>
        )}
        {clientes.length > 0 && <TablaClientes clientes={filteredClientes} />}
      </section>
    </section>
  );
}
