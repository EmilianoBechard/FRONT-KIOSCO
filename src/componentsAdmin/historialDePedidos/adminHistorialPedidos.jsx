import { useState, useId } from "react";
import { TablaHistorialPedidos } from "./tablaHistorialPedidos.jsx";
import { BasuraIcon, LoadingIcon } from "../../assets/iconos.jsx";
import { useHistorialPedidos } from "./variablesHistorialPedidos.js";
import { getTodayStart } from "../../constantsAndFunctions.jsx";

export function HistorialPedidos() {
  const inputIdPedidoId = useId();
  const inputClienteId = useId();
  const inputEstadoId = useId();
  const inputUsuarioModificadorId = useId();

  const [filtersInput, setFiltersInput] = useState({
    id_pedido: "",
    cliente: "",
    fecha_pedido_desde: "",
    fecha_pedido_hasta: "",
    detalle_estado: "",
    fecha_modificacion_desde: getTodayStart(),
    fecha_modificacion_hasta: "",
    usuario_modificador: "",
  });

  const [filtersQuery, setFiltersQuery] = useState(filtersInput);

  const {
    historialPedidos,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useHistorialPedidos(filtersQuery);

  const toMySQLDateTimeLocal = (dt) => (dt ? dt.replace("T", " ") + ":00" : "");

  const actualizarFiltros = () => {
    const convertedFilters = {
      ...filtersInput,
      fecha_pedido_desde: toMySQLDateTimeLocal(filtersInput.fecha_pedido_desde),
      fecha_pedido_hasta: toMySQLDateTimeLocal(filtersInput.fecha_pedido_hasta),
      fecha_modificacion_desde: toMySQLDateTimeLocal(
        filtersInput.fecha_modificacion_desde
      ),
      fecha_modificacion_hasta: toMySQLDateTimeLocal(
        filtersInput.fecha_modificacion_hasta
      ),
    };
    setFiltersQuery(convertedFilters);
    refetch();
  };

  const clearFilters = () => {
    setFiltersInput({
      id_pedido: "",
      cliente: "",
      fecha_pedido_desde: "",
      fecha_pedido_hasta: "",
      detalle_estado: "",
      fecha_modificacion_desde: "",
      fecha_modificacion_hasta: "",
      usuario_modificador: "",
    });
    setFiltersQuery({});
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
          Aquí podrás ver el historial de pedidos.
        </p>
      </div>

      <h3 className="text-xl text-center font-semibold text-[#F9FAFB] mt-4 mb-2">
        Historial de Pedidos
      </h3>

      <form className="flex flex-col justify-evenly sm:flex-row flex-wrap gap-4 mb-6">
        {/* ID Pedido */}
        <fieldset className="flex flex-col min-w-[150px]">
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
            className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            onChange={handleChange("id_pedido")}
          />
        </fieldset>

        {/* Cliente */}
        <fieldset className="flex flex-col min-w-[180px]">
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
            placeholder="Ej: Emiliano"
            className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            onChange={handleChange("cliente")}
          />
        </fieldset>

        {/* Fecha del pedido */}
        <fieldset className="flex flex-col min-w-[220px]">
          <label className="text-sm text-[#CBD5E1] mb-1">
            Fecha Pedido Desde
          </label>
          <input
            type="datetime-local"
            value={filtersInput.fecha_pedido_desde}
            className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            onChange={handleChange("fecha_pedido_desde")}
          />
          <label className="text-sm text-[#CBD5E1] mt-2 mb-1">Hasta</label>
          <input
            type="datetime-local"
            value={filtersInput.fecha_pedido_hasta}
            className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            onChange={handleChange("fecha_pedido_hasta")}
          />
        </fieldset>

        {/* Estado */}
        <fieldset className="flex flex-col min-w-[150px]">
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
            className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            onChange={handleChange("detalle_estado")}
          />
        </fieldset>

        {/* Fecha de modificación */}
        <fieldset className="flex flex-col min-w-[220px]">
          <label className="text-sm text-[#CBD5E1] mb-1">
            Fecha Modificación Desde
          </label>
          <input
            type="datetime-local"
            value={filtersInput.fecha_modificacion_desde}
            className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            onChange={handleChange("fecha_modificacion_desde")}
          />
          <label className="text-sm text-[#CBD5E1] mt-2 mb-1">Hasta</label>
          <input
            type="datetime-local"
            value={filtersInput.fecha_modificacion_hasta}
            className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            onChange={handleChange("fecha_modificacion_hasta")}
          />
        </fieldset>

        {/* Usuario modificador */}
        <fieldset className="flex flex-col min-w-[150px]">
          <label
            htmlFor={inputUsuarioModificadorId}
            className="text-sm text-[#CBD5E1] mb-1"
          >
            Usuario Modificador
          </label>
          <input
            id={inputUsuarioModificadorId}
            type="text"
            value={filtersInput.usuario_modificador}
            placeholder="Ej: Mauro Biondi"
            className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            onChange={handleChange("usuario_modificador")}
          />
        </fieldset>

        {/* Botones */}
        <div className="flex items-end w-full sm:w-auto gap-2">
          <button
            type="button"
            onClick={clearFilters}
            className="bg-[#991B1B] hover:bg-[#B91C1C] text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 cursor-pointer flex items-center gap-1"
          >
            <BasuraIcon /> Limpiar Filtros
          </button>
          <button
            type="button"
            onClick={actualizarFiltros}
            className="bg-[#3B82F6] hover:bg-[#60A5FA] text-[#F9FAFB] px-4 py-2 rounded-lg text-sm transition-all duration-300 cursor-pointer flex items-center gap-1"
          >
            <LoadingIcon /> Actualizar Historial
          </button>
        </div>
      </form>

      <section className="flex flex-col gap-4 justify-center items-center">
        {historialPedidos.length > 0 && (
          <TablaHistorialPedidos pedidos={historialPedidos} />
        )}
        {isLoading && (
          <p className="text-[#9CA3AF]">Cargando historial de pedidos...</p>
        )}
        {isError && (
          <p className="text-red-500">
            {error?.message || "Error al cargar el historial de pedidos."}
          </p>
        )}
        {!isLoading && !isError && historialPedidos.length === 0 && (
          <p className="text-[#9CA3AF]">No hay historial de pedidos.</p>
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
