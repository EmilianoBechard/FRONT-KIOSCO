import { useState, useId } from "react";
import { BasuraIcon, LoadingIcon } from "../../assets/iconos.jsx";
import { useCategorias } from "./variablesCategorias.js";
import { TablaCategorias } from "./tablaCategorias.jsx";
import axios from "axios";
import { url } from "../../constantsAndFunctions.jsx";

export function Categorias() {
  const inputIdCategoriaId = useId();
  const inputCategoriaId = useId();
  const inputNuevaCategoriaId = useId();

  const { categorias, isLoading, isError, error, refetch } = useCategorias();

  const [filtersCategorias, setFiltersOrderDetails] = useState({
    id_categoria: "",
    categoria: "",
  });

  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [errorCategoria, setErrorCategoria] = useState("");
  const [loadingCategoria, setLoadingCategoria] = useState(false);
  const [exitoCategoria, setExitoCategoria] = useState(false);

  const filterCategorias = (orderDetails) => {
    return orderDetails.filter((order) => {
      return (
        (filtersCategorias.id_categoria === "" ||
          order.id_categoria
            .toString()
            .includes(filtersCategorias.id_categoria)) &&
        (filtersCategorias.categoria === "" ||
          order.categoria
            .toLowerCase()
            .includes(filtersCategorias.categoria.toLowerCase()))
      );
    });
  };

  function clearFilters() {
    setFiltersOrderDetails({
      id_categoria: "",
      categoria: "",
    });
  }

  const filteredCategorias = filterCategorias(categorias);

  const handleIdCategoriaChange = (e) => {
    setFiltersOrderDetails((prev) => ({
      ...prev,
      id_categoria: e.target.value,
    }));
  };

  const handleCategoriaChange = (e) => {
    setFiltersOrderDetails((prev) => ({
      ...prev,
      categoria: e.target.value,
    }));
  };

  const handleNuevaCategoriaChange = (e) => {
    setNuevaCategoria(e.target.value);
    setErrorCategoria("");
  };

  const handleCrearCategoria = async () => {
    const trimmed = nuevaCategoria.trim();

    // Validación
    if (trimmed.length < 5) {
      setErrorCategoria("La categoría debe tener al menos 5 caracteres.");
      return;
    }
    if (trimmed.length > 20) {
      setErrorCategoria("La categoría no puede superar 20 caracteres.");
      return;
    }

    setLoadingCategoria(true);
    try {
      await axios.post(
        `${url}/admin/categorias`,
        { categoria: trimmed },
        { withCredentials: true }
      );
      setExitoCategoria(true);
      setNuevaCategoria("");
      refetch();
      setTimeout(() => setExitoCategoria(false), 3000);
    } catch (e) {
      setErrorCategoria(e.response?.data?.error || e.message);
    } finally {
      setLoadingCategoria(false);
    }
  };

  return (
    <section className="bg-[#111827] p-6 rounded-lg shadow-md shadow-[#374151] mt-5">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-6">
        <h2 className="text-2xl font-bold text-[#F9FAFB]">
          Hola, administrador
        </h2>
        <p className="text-[#9CA3AF]">
          Aquí podrás ver los pedidos y sus detalles, y crear nuevas categorías.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-end justify-center">
        <div className="flex flex-col min-w-[200px]">
          <label
            htmlFor={inputNuevaCategoriaId}
            className="text-sm text-[#CBD5E1] mb-1"
          >
            Nueva Categoría
          </label>
          <input
            id={inputNuevaCategoriaId}
            type="text"
            value={nuevaCategoria}
            onChange={handleNuevaCategoriaChange}
            placeholder="Ej: Bebidas"
            className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] 
              text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none 
              focus:ring-2 focus:ring-[#3B82F6]"
          />
          {errorCategoria && (
            <span className="text-red-500 text-sm mt-1" role="alert">
              {errorCategoria}
            </span>
          )}
          {exitoCategoria && (
            <span
              className="text-green-500 text-sm mt-1"
              role="status"
              aria-live="polite"
            >
              Categoría creada correctamente
            </span>
          )}
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={handleCrearCategoria}
            disabled={loadingCategoria}
            aria-busy={loadingCategoria}
            className="bg-[#3B82F6] hover:bg-[#60A5FA] text-[#F9FAFB] px-4 py-2 rounded-lg text-sm
          transition-all duration-300 cursor-pointer flex items-center gap-1"
          >
            {loadingCategoria ? "Creando..." : "Crear Categoría"}
          </button>
        </div>
      </div>

      {categorias.length > 0 && (
        <>
          <h2 className="text-center text-[20px] font-bold text-[#F9FAFB]">
            Filtros
          </h2>

          <form className="flex flex-col justify-center sm:flex-row flex-wrap gap-4 mb-6">
            <fieldset className="flex flex-col min-w-[150px]">
              <legend className="sr-only">Filtro por ID de Categoria</legend>
              <label
                htmlFor={inputIdCategoriaId}
                className="text-sm text-[#CBD5E1] mb-1"
              >
                ID Categoria
              </label>
              <input
                id={inputIdCategoriaId}
                type="number"
                value={filtersCategorias.id_categoria}
                placeholder="Ej: 101"
                className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] 
              text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none 
              focus:ring-2 focus:ring-[#3B82F6]"
                onChange={handleIdCategoriaChange}
              />
            </fieldset>

            <fieldset className="flex flex-col min-w-[180px]">
              <legend className="sr-only">
                Filtro por nombre de Categoria
              </legend>
              <label
                htmlFor={inputCategoriaId}
                className="text-sm text-[#CBD5E1] mb-1"
              >
                Categoria
              </label>
              <input
                id={inputCategoriaId}
                type="text"
                value={filtersCategorias.categoria}
                placeholder="Ej: Bebidas"
                className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] 
              text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none 
              focus:ring-2 focus:ring-[#3B82F6]"
                onChange={handleCategoriaChange}
              />
            </fieldset>

            <fieldset className="flex items-end w-full sm:w-auto gap-2">
              <button
                type="button"
                onClick={() => clearFilters()}
                className="bg-[#991B1B] hover:bg-[#B91C1C] text-white px-4 py-2 rounded-lg text-sm 
              transition-all duration-300 cursor-pointer flex items-center gap-1"
              >
                <BasuraIcon /> Limpiar Filtros
              </button>
              <button
                type="button"
                onClick={() => refetch()}
                className="bg-[#3B82F6] hover:bg-[#60A5FA] text-[#F9FAFB] px-4 py-2 rounded-lg text-sm
              transition-all duration-300 cursor-pointer flex items-center gap-1"
              >
                <LoadingIcon /> Actualizar Categorías
              </button>
            </fieldset>
          </form>
        </>
      )}

      <section className="flex flex-col gap-4 justify-center items-center">
        {categorias.length > 0 && (
          <TablaCategorias categorias={filteredCategorias} />
        )}
        {isLoading && (
          <p className="text-[#9CA3AF]">Cargando las categorías...</p>
        )}
        {isError && (
          <p className="text-red-500">
            {error?.message || "Error al cargar las categorías."}
          </p>
        )}
        {!isLoading && !isError && categorias.length === 0 && (
          <p className="text-[#9CA3AF]">No hay categorías disponibles.</p>
        )}
      </section>
    </section>
  );
}
