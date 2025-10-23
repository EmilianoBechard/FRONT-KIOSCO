import { useState, useId } from "react";
import { TablaDetalleDePedidos } from "./detalleDePedidos.jsx";
import { BasuraIcon, LoadingIcon } from "../../assets/iconos.jsx";
import { useOrderDetails } from "./variablesDetalleDePedidos.js";
import { getTodayStart } from "../../constantsAndFunctions.jsx";

export function DetallesDePedidos() {
  const inputIdPedidoId = useId();
  const inputClienteId = useId();
  const inputFechaId = useId();
  const inputEstadoId = useId();

  const [refreshMessage, setRefreshMessage] = useState(false);

  const [filtersInput, setFiltersInput] = useState({
    id_pedido: "",
    cliente: "",
    fecha: getTodayStart(),
    detalle_estado: "",
  });

  const [filtersQuery, setFilterQuery] = useState(filtersInput);

  const {
    pedidosConDetalles,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useOrderDetails(filtersQuery);

  const toMySQLDateTimeLocal = (dt) => (dt ? dt.replace("T", " ") + ":00" : "");

  const handleActualizarFiltros = async () => {
    const convertedFilters = {
      ...filtersInput,
      fecha: toMySQLDateTimeLocal(filtersInput.fecha),
    };
    setFilterQuery(convertedFilters);
    refetch();
    setRefreshMessage(true);
    setTimeout(() => setRefreshMessage(false), 2000);
  };

  const clearFilters = () => {
    setFiltersInput({
      id_pedido: "",
      cliente: "",
      fecha: "",
      detalle_estado: "",
    });
    setFilterQuery({});
  };

  const handleChange = (field) => (e) => {
    setFiltersInput((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <section className="bg-[#111827] p-6 rounded-lg shadow-md shadow-[#374151] mt-5">
      <div className="flex flex-row items-center justify-center gap-5">
        <h2 className="text-2xl font-bold text-[#F9FAFB] mb-2">
          Hola, administrador
        </h2>
        <p className="text-[#9CA3AF]">
          Aqui podras ver los pedidos y sus detalles.
        </p>
      </div>

      <h3 className="text-xl text-center font-semibold text-[#F9FAFB] mt-4 mb-2">
        Detalle de Pedidos
      </h3>

      <form className="flex flex-col justify-evenly sm:flex-row flex-wrap gap-4 mb-6">
        <fieldset className="flex flex-col min-w-[150px]">
          <legend className="sr-only">Filtro por ID de Pedido</legend>
          <label
            htmlFor={inputIdPedidoId}
            className="text-sm text-[#CBD5E1] mb-1"
          >
            ID Pedido
          </label>
          <input
            id={inputIdPedidoId}
            type="text"
            value={filtersInput.id_pedido}
            placeholder="Ej: 101"
            className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] 
              text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none 
              focus:ring-2 focus:ring-[#3B82F6]"
            onChange={handleChange("id_pedido")}
          />
        </fieldset>

        <fieldset className="flex flex-col min-w-[180px]">
          <legend className="sr-only">Filtro por nombre de cliente</legend>
          <label
            htmlFor={inputClienteId}
            className="text-sm text-[#CBD5E1] mb-1"
          >
            Cliente
          </label>
          <input
            id={inputClienteId}
            type="text"
            value={filtersInput.cliente}
            placeholder="Ej: Juan Pérez"
            className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] 
              text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none 
              focus:ring-2 focus:ring-[#3B82F6]"
            onChange={handleChange("cliente")}
          />
        </fieldset>

        <fieldset className="flex flex-col min-w-[180px]">
          <legend className="sr-only">Filtro por fecha</legend>
          <label htmlFor={inputFechaId} className="text-sm text-[#CBD5E1] mb-1">
            Fecha
          </label>
          <input
            type="datetime-local"
            value={filtersInput.fecha}
            className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            onChange={handleChange("fecha")}
          />
        </fieldset>

        <fieldset className="flex flex-col min-w-[150px]">
          <legend className="sr-only">Filtro por estado</legend>
          <label
            htmlFor={inputEstadoId}
            className="text-sm text-[#CBD5E1] mb-1"
          >
            Estado
          </label>
          <input
            id={inputEstadoId}
            type="text"
            value={filtersInput.detalle_estado}
            placeholder="Ej: PENDIENTE"
            className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] 
              text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none 
              focus:ring-2 focus:ring-[#3B82F6]"
            onChange={handleChange("detalle_estado")}
          />
        </fieldset>

        <div className="flex items-end w-full sm:w-auto">
          <button
            type="button"
            onClick={clearFilters}
            className="bg-[#991B1B] hover:bg-[#B91C1C] text-white px-4 py-2 rounded-lg text-sm 
              transition-all duration-300 cursor-pointer flex items-center gap-1"
          >
            <BasuraIcon /> Limpiar Filtros
          </button>
        </div>
        <div className="flex flex-col items-baseline justify-end flex-wrap w-full sm:w-auto">
          <button
            type="button"
            onClick={handleActualizarFiltros}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 cursor-pointer flex items-center gap-1 ${
              isLoading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[#3B82F6] hover:bg-[#60A5FA] text-[#F9FAFB]"
            }`}
          >
            <LoadingIcon />{" "}
            {isLoading ? "Actualizando..." : "Actualizar Pedidos"}
          </button>
          {refreshMessage && (
            <span
              className="text-green-500 text-sm font-medium"
              role="status"
              aria-live="polite"
            >
              Pedidos actualizados ✅
            </span>
          )}
        </div>
      </form>

      <section className="flex flex-col gap-4 justify-center items-center">
        {pedidosConDetalles.length > 0 && (
          <TablaDetalleDePedidos pedidos={pedidosConDetalles} />
        )}
        {isLoading && (
          <p className="text-[#9CA3AF]">Cargando detalles de pedidos...</p>
        )}
        {isError && (
          <p className="text-red-500">
            {error?.message || "Error al cargar los detalles de los pedidos."}
          </p>
        )}
        {!isLoading && !isError && pedidosConDetalles.length === 0 && (
          <p className="text-[#9CA3AF]">
            No hay detalles de pedidos disponibles.
          </p>
        )}
        {!isLoading && !isError && hasNextPage && (
          <button
            onClick={fetchNextPage}
            className="bg-[#3B82F6] hover:bg-[#60A5FA] text-[#F9FAFB] px-4 py-2 rounded-lg text-sm transition-all duration-300 cursor-pointer flex items-center gap-1"
          >
            <LoadingIcon /> Cargar más pedidos
          </button>
        )}
      </section>
    </section>
  );
}
