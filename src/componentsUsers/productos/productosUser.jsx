import { Link, useSearchParams } from "react-router-dom";
import { useUserProductos, useUserCategorias } from "../variablesUser.jsx";
import { ProductoUserCard } from "./productosUserCard.jsx";
import { useState } from "react";
import { useEffect } from "react";

export function ProductosUser() {
  const {
    categorias,
    isLoading: isLoadingCategorias,
    isError: isErrorCategorias,
    error: errorCategorias,
  } = useUserCategorias();
  const {
    productos,
    isLoading: isLoadingProductos,
    isError: isErrorProductos,
    error: errorProductos,
  } = useUserProductos();
  const [searchParams] = useSearchParams();

  const [categoriaInvalida, setCategoriaInvalida] = useState(false);
  const [filtersProductos, setFiltersProductos] = useState({
    nombreProducto: "",
    categoria: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const nombre = searchParams.get("buscar") || "";
    setFiltersProductos((prev) => ({
      ...prev,
      nombreProducto: nombre,
    }));
  }, [searchParams]);

  useEffect(() => {
    const categoriaURL = searchParams.get("categoria");

    if (!categoriaURL) {
      setFiltersProductos((prev) => ({
        ...prev,
        categoria: "",
      }));
      setCategoriaInvalida(false);
      return;
    }

    if (categorias.length === 0) return;

    const existe = categorias.some(
      (c) => c.categoria.toLowerCase() === categoriaURL.toLowerCase()
    );

    if (existe) {
      setFiltersProductos((prev) => ({
        ...prev,
        categoria: categoriaURL,
      }));
      setCategoriaInvalida(false);
    } else {
      setCategoriaInvalida(true);
      setFiltersProductos((prev) => ({
        ...prev,
        categoria: "",
      }));
    }
  }, [searchParams, categorias]);

  const filterProductos = (productos) => {
    return productos.filter((producto) => {
      return (
        (filtersProductos.nombreProducto === "" ||
          producto.nombre
            .toLowerCase()
            .includes(filtersProductos.nombreProducto.toLowerCase()) ||
          producto.descripcion
            .toLowerCase()
            .includes(filtersProductos.nombreProducto.toLowerCase())) &&
        (filtersProductos.categoria === "" ||
          producto.categoria
            .toLowerCase()
            .includes(filtersProductos.categoria.toLowerCase())) &&
        (filtersProductos.minPrice === "" ||
          producto.precio >= Number(filtersProductos.minPrice)) &&
        (filtersProductos.maxPrice === "" ||
          producto.precio <= Number(filtersProductos.maxPrice))
      );
    });
  };

  function clearFilters() {
    setFiltersProductos({
      nombreProducto: "",
      categoria: "",
      minPrice: "",
      maxPrice: "",
    });
    if (categoriaInvalida) setCategoriaInvalida(false);
  }

  const handleNombreProductoChange = (e) => {
    setFiltersProductos((prev) => ({
      ...prev,
      nombreProducto: e.target.value,
    }));
    if (categoriaInvalida) setCategoriaInvalida(false);
  };

  const handleCategoriaChange = (categoria) => {
    setFiltersProductos((prev) => ({
      ...prev,
      categoria: categoria,
    }));
    if (categoriaInvalida) setCategoriaInvalida(false);
  };

  const handleMinPriceChange = (e) => {
    setFiltersProductos((prev) => ({
      ...prev,
      minPrice: e.target.value,
    }));
    if (categoriaInvalida) setCategoriaInvalida(false);
  };

  const handleMaxPriceChange = (e) => {
    setFiltersProductos((prev) => ({
      ...prev,
      maxPrice: e.target.value,
    }));
    if (categoriaInvalida) setCategoriaInvalida(false);
  };
  const clearCategoria = () => {
    setFiltersProductos((prev) => ({
      ...prev,
      categoria: "",
    }));
    if (categoriaInvalida) setCategoriaInvalida(false);
  };

  const filteredProductos = filterProductos(productos);

  const skeletonCategorias = Array(4).fill(0);
  const skeletonProductos = Array(6).fill(0);
  return (
    <main className="min-h-screen bg-[#F9FAFB] p-6 max-sm:p-1" role="main">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex text-sm text-[#6B7280] gap-1">
          <li>
            <Link
              to="/"
              className="text-[#2563EB] hover:text-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
            >
              Inicio
            </Link>
          </li>
          <li>
            <span className="text-[#111827]">{">"}</span>
          </li>
          <li aria-current="page">
            <span className="text-[#111827]">Productos</span>
          </li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold text-[#111827] mb-6">Productos</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside
          className="col-span-1 bg-[#FFFFFF] p-4 rounded-2xl shadow-sm border border-[#E5E7EB] h-full flex flex-col"
          aria-label="Categorías de productos"
        >
          <div className="flex flex-col max-md:flex-row max-md:justify-between max-md:items-center 2xl:flex-row gap-2 2xl:items-center 2xl:justify-between mb-4 h-8 max-2xl:h-auto">
            <h2 className="text-[#111827] font-semibold ">Categorías</h2>

            {filtersProductos.categoria && (
              <>
                <button
                  onClick={clearCategoria}
                  className=" bg-red-500 text-white rounded-lg px-3 py-1 font-medium hover:bg-red-600 transition-colors cursor-pointer w-60 sm:w-auto"
                >
                  Quitar filtro de categoría
                </button>
              </>
            )}
          </div>

          {isLoadingCategorias && (
            <ul
              className="flex flex-col gap-2"
              role="status"
              aria-live="polite"
            >
              {skeletonCategorias.map((_, idx) => (
                <li
                  key={idx}
                  className="h-6 bg-[#E5E7EB] rounded w-3/4 animate-pulse"
                ></li>
              ))}
            </ul>
          )}

          {isErrorCategorias && (
            <p
              role="alert"
              aria-live="assertive"
              className="text-[#DC2626] font-medium"
            >
              {errorCategorias?.message || "Error al cargar las categorías."}
            </p>
          )}

          {!isLoadingCategorias &&
            !isErrorCategorias &&
            categorias.length === 0 && (
              <p role="status" aria-live="polite" className="text-[#6B7280]">
                No hay categorías disponibles.
              </p>
            )}

          {!isLoadingCategorias &&
            !isErrorCategorias &&
            categorias.length > 0 && (
              <>
                <ul className="flex flex-col gap-2">
                  {categorias.map((categoria) => (
                    <li key={categoria.id_categoria}>
                      <button
                        className={`rounded-lg px-3 py-1 font-medium cursor-pointer ${
                          filtersProductos.categoria === categoria.categoria
                            ? "bg-[#2563EB] text-white"
                            : "bg-[#E5E7EB] text-[#111827]"
                        }`}
                        onClick={() => {
                          if (
                            filtersProductos.categoria === categoria.categoria
                          ) {
                            clearCategoria();
                          } else {
                            handleCategoriaChange(categoria.categoria);
                          }
                        }}
                      >
                        {categoria.categoria}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
        </aside>

        <section className="col-span-1 md:col-span-3 flex flex-col gap-4">
          <div
            className="bg-[#FFFFFF] p-4 rounded-2xl shadow-sm border border-[#E5E7EB] flex flex-col md:flex-row justify-center gap-4 items-center"
            aria-labelledby="filtros-productos"
          >
            <fieldset className="flex flex-col lg:flex-row justify-center gap-2">
              <legend
                id="filtros-productos"
                className="text-[#111827] font-semibold max-sm:text-center"
              >
                Filtros de productos
              </legend>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] h-11"
                aria-label="Buscar producto por nombre"
                onChange={handleNombreProductoChange}
                value={filtersProductos.nombreProducto}
              />
              <input
                type="number"
                placeholder="Precio mínimo"
                className="border border-[#E5E7EB] rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-[#2563EB] h-11"
                aria-label="Precio mínimo"
                onChange={handleMinPriceChange}
                value={filtersProductos.minPrice}
              />
              <input
                type="number"
                placeholder="Precio máximo"
                className="border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] h-11"
                aria-label="Precio máximo"
                onChange={handleMaxPriceChange}
                value={filtersProductos.maxPrice}
              />
              <button
                onClick={clearFilters}
                type="button"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 cursor-pointer"
              >
                Limpiar Filtros
              </button>
            </fieldset>
          </div>

          <section
            className="bg-[#FFFFFF] p-4 max-sm:p-1 rounded-2xl shadow-sm border border-[#E5E7EB] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2"
            aria-label="Lista de productos"
          >
            {/* Skeletons de productos estilo card */}
            {categoriaInvalida && (
              <p
                role="alert"
                aria-live="polite"
                className="text-red-500 font-medium text-center w-full col-span-full"
              >
                La categoría seleccionada no existe.
              </p>
            )}

            {isLoadingProductos &&
              skeletonProductos.map((_, idx) => (
                <div
                  key={idx}
                  className="relative bg-[#FFFFFF] rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col animate-pulse p-4"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-full h-36 bg-[#E5E7EB] rounded-lg mb-4"></div>
                  <div className="h-4 bg-[#E5E7EB] rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-[#E5E7EB] rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-[#E5E7EB] rounded w-1/2"></div>
                </div>
              ))}

            {isErrorProductos && (
              <p
                role="alert"
                aria-live="assertive"
                className="text-[#DC2626] font-medium"
              >
                {errorProductos?.message || "Error al cargar los productos."}
              </p>
            )}

            {!isLoadingProductos &&
              !isErrorProductos &&
              productos.length === 0 && (
                <p role="status" aria-live="polite" className="text-[#6B7280]">
                  No hay productos disponibles.
                </p>
              )}

            {!categoriaInvalida &&
              !isLoadingProductos &&
              !isErrorProductos &&
              productos.length > 0 &&
              filteredProductos.map((producto) => (
                <ProductoUserCard
                  key={producto.id_producto}
                  producto={producto}
                />
              ))}
          </section>
        </section>
      </div>
    </main>
  );
}
