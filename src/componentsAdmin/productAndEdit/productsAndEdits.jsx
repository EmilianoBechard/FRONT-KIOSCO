import { AddIcon, BasuraIcon, LoadingIcon } from "../../assets/iconos.jsx";
import { CardProducto } from "./cardsProductsAndEdit.jsx";
import { useState, useId } from "react";
import { useProductos } from "./variablesProductsAndEdit.js";
import { Link } from "react-router-dom";
import { useCategorias } from "../categorias/variablesCategorias.js";
import { useEffect } from "react";
export function Productos() {
  const [filters, setFilters] = useState({
    inputText: "",
    minPrice: 0,
    maxPrice: 0,
    categoria: "",
  });
  const inputMinPriceId = useId();
  const inputMaxPriceId = useId();
  const [updateMessage, setUpdateMessage] = useState("");
  const {
    productos,
    isLoading: isLoadingProductos,
    isError: isErrorProductos,
    error: errorProductos,
    refetch: refetchProductos,
  } = useProductos();
  const {
    categorias,
    isLoading: isLoadingCategorias,
    isError: isErrorCategorias,
    error: errorCategorias,
    refetch: refetchCategorias,
  } = useCategorias();
  const handleUpdateClick = async () => {
    try {
      refetchProductos();
      refetchCategorias();
      setUpdateMessage("Se actualizaron los productos y categorías");
      setTimeout(() => setUpdateMessage(""), 2000);
    } catch (err) {
      setUpdateMessage("Ocurrió un error al actualizar. Inténtalo nuevamente.");
      setTimeout(() => setUpdateMessage(""), 2000);
    }
  };
  const filteredForPrice = productos.filter((product) => {
    const matchesText =
      filters.inputText === "" ||
      product.nombre.toLowerCase().includes(filters.inputText.toLowerCase()) ||
      product.descripcion
        .toLowerCase()
        .includes(filters.inputText.toLowerCase());
    const matchesCategory =
      filters.categoria === "" || product.categoria === filters.categoria;
    return matchesText && matchesCategory;
  });
  const maxPrecio =
    filteredForPrice.length > 0
      ? Math.max(...filteredForPrice.map((p) => p.precio))
      : 0;
  const minPrecio =
    filteredForPrice.length > 0
      ? Math.min(...filteredForPrice.map((p) => p.precio))
      : 0;
  const filteredProducts = filteredForPrice.filter(
    (product) =>
      product.precio >= filters.minPrice &&
      (filters.maxPrice === 0 || product.precio <= filters.maxPrice)
  );
  const handleInputTextChange = (e) => {
    setFilters((prev) => ({ ...prev, inputText: e.target.value }));
  };
  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    setFilters((prev) => ({
      ...prev,
      minPrice: Math.min(value, prev.maxPrice),
    }));
  };
  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    setFilters((prev) => ({
      ...prev,
      maxPrice: Math.max(value, prev.minPrice),
    }));
  };
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: minPrecio,
      maxPrice: maxPrecio,
    }));
  }, [minPrecio, maxPrecio]);
  function clearFilters() {
    setFilters({
      inputText: "",
      minPrice: minPrecio,
      maxPrice: maxPrecio,
      categoria: "",
    });
  }
  return (
    <section className="bg-[#111827] p-6 rounded-lg shadow-md shadow-[#374151] mt-5">
      {/* Header */}
      <header className="flex flex-col flex-wrap items-center justify-center gap-5 mb-5">
        <div className="flex items-end gap-2 text-center max-sm:flex-col max-sm:items-center sm:text-left">
          <h1 className="text-2xl font-bold text-[#F9FAFB]">
            Hola, administrador
          </h1>
          <p className="text-[#CBD5E1]">
            Aquí podrás ver, crear, actualizar y eliminar productos.
          </p>
        </div>
        {updateMessage && (
          <p
            className={`${
              updateMessage.includes("error")
                ? "text-red-500"
                : "text-green-500"
            } text-base mt-2 sm:mt-0`}
            role="status"
            aria-live="polite"
          >
            {updateMessage}
          </p>
        )}
        {!isLoadingProductos && !isErrorProductos && productos.length === 0 && (
          <Link
            to={"/admin/home/crear-producto"}
            className="bg-[#3B82F6] hover:bg-[#60A5FA] text-[#F9FAFB] px-4 py-2 rounded-lg text-sm transition-all duration-300 cursor-pointer flex items-center gap-1 whitespace-nowrap"
            aria-label="Crear producto"
          >
            <AddIcon /> Crear Producto
          </Link>
        )}
      </header>
      {/* Filtros y acciones */}
      {productos.length > 0 && (
        <section className="grid gap-4 mb-6">
          {/* Fila 1: input de texto + select */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label htmlFor="searchProduct" className="sr-only">
                Buscar producto
              </label>
              <input
                id="searchProduct"
                type="text"
                value={filters.inputText}
                placeholder="Buscar producto..."
                className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] text-[#F9FAFB] placeholder-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                onChange={handleInputTextChange}
              />
            </div>
            <div>
              <label htmlFor="categoriaSelect" className="sr-only">
                Seleccionar categoría
              </label>
              <select
                id="categoriaSelect"
                value={filters.categoria}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, categoria: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-[#374151] text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              >
                <option value="">Todas las categorías</option>
                {!isLoadingCategorias &&
                  categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.categoria}>
                      {cat.categoria}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          {/* Fila 2: filtros de precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-3 w-full">
              <label
                htmlFor={inputMinPriceId}
                className="text-sm text-[#CBD5E1] whitespace-nowrap"
              >
                Desde:
              </label>
              <input
                type="range"
                id={inputMinPriceId}
                min="0"
                max={maxPrecio}
                value={filters.minPrice}
                onChange={handleMinPriceChange}
                className="w-full accent-[#3B82F6]"
                aria-valuemin={minPrecio}
                aria-valuemax={maxPrecio}
                aria-valuenow={filters.minPrice}
                aria-label="Precio mínimo"
              />
              <span className="text-[#F9FAFB]">${filters.minPrice}</span>
            </div>
            <div className="flex items-center gap-3 w-full">
              <label
                htmlFor={inputMaxPriceId}
                className="text-sm text-[#CBD5E1] whitespace-nowrap"
              >
                Hasta:
              </label>
              <input
                type="range"
                id={inputMaxPriceId}
                min="0"
                max={maxPrecio}
                value={filters.maxPrice}
                onChange={handleMaxPriceChange}
                className="w-full accent-[#3B82F6]"
                aria-valuemin={minPrecio}
                aria-valuemax={maxPrecio}
                aria-valuenow={filters.maxPrice}
                aria-label="Precio máximo"
              />
              <span className="text-[#F9FAFB]">${filters.maxPrice}</span>
            </div>
          </div>
          {/* Fila 3: botones */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
            <button
              onClick={clearFilters}
              className="bg-[#991B1B] hover:bg-[#B91C1C] text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 cursor-pointer flex items-center gap-1"
              aria-label="Limpiar filtros"
            >
              <BasuraIcon /> Limpiar Filtros
            </button>
            <button
              onClick={handleUpdateClick}
              className="bg-[#3B82F6] hover:bg-[#60A5FA] text-[#F9FAFB] px-4 py-2 rounded-lg text-sm transition-all duration-300 cursor-pointer flex items-center gap-1"
              aria-label="Actualizar productos"
            >
              <LoadingIcon /> Actualizar
            </button>
            <Link
              to={"/admin/home/crear-producto"}
              className="bg-[#3B82F6] hover:bg-[#60A5FA] text-[#F9FAFB] px-4 py-2 rounded-lg text-sm transition-all duration-300 cursor-pointer flex items-center gap-1"
              aria-label="Crear producto"
            >
              <AddIcon /> Crear Producto
            </Link>
          </div>
        </section>
      )}
      <div className="flex justify-center">
        {isLoadingProductos && (
          <p className="text-[#9CA3AF]">Cargando los productos...</p>
        )}
        {isErrorProductos && (
          <p className="text-red-500">
            {errorProductos?.message || "Error al cargar los productos."}{" "}
          </p>
        )}
        {!isLoadingProductos && !isErrorProductos && productos.length === 0 && (
          <p className="text-[#9CA3AF] text-center">
            No hay productos disponibles.
          </p>
        )}
      </div>
      {/* Productos */}
      <section className="grid max-sm:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredProducts.map((producto) => (
          <CardProducto key={producto.id_producto} producto={producto} />
        ))}
      </section>
    </section>
  );
}
