import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart, useUserProductos } from "../variablesUser.jsx";
import { ProductoCardSlug } from "./productoSlugCard.jsx";

export function ProductoSlugUser() {
  const { addToCart } = useCart();
  const { slug } = useParams();
  const { productos, isLoading, isError, error, refetch } = useUserProductos();

  const [slugProduct, setSlugProduct] = useState(null);
  useEffect(() => {
    if (productos.length > 0) {
      const found = productos.find(
        (p) => p.slug.toLowerCase() === slug.toLowerCase()
      );
      setSlugProduct(found || null);
    }
  }, [productos, slug]);

  useEffect(() => {
    if (!isLoading && !isError && !slugProduct && productos.length === 0) {
      refetch();
    }
  }, [isLoading, isError, slugProduct, productos.length, refetch]);

  return (
    <main
      role="main"
      className="bg-[#F9FAFB] min-h-screen p-6"
      aria-busy={isLoading}
    >
      <section className="max-w-3xl mx-auto flex justify-center gap-6">
        {isLoading && !isError && (
          <div
            className="bg-white border border-[#E5E7EB] rounded-xl shadow-md p-6 flex flex-col items-center gap-4 animate-fadeIn"
            role="status"
            aria-live="polite"
          >
            <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#6B7280] text-lg font-medium">
              Cargando detalles del producto...
            </p>
          </div>
        )}

        {isError && !isLoading && (
          <div
            className="bg-white border border-[#E5E7EB] rounded-xl shadow-md p-6 flex flex-col items-center gap-4 animate-fadeIn"
            role="alert"
            aria-live="assertive"
          >
            <div className="w-10 h-10 rounded-full bg-[#DC2626] flex items-center justify-center">
              <span className="text-white font-bold text-xl">!</span>
            </div>
            <p className="text-[#DC2626] text-lg font-semibold text-center">
              {error?.message || "Error al cargar los detalles del producto."}
            </p>
            <button
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:ring-offset-2 cursor-pointer"
              onClick={() => window.location.reload()}
              aria-label="Reintentar carga del producto"
            >
              Reintentar
            </button>
          </div>
        )}

        {!isLoading && !isError && !slugProduct && (
          <div
            className="bg-white border border-[#E5E7EB] rounded-xl shadow-md p-6 flex flex-col items-center gap-4 animate-fadeIn"
            role="status"
            aria-live="polite"
          >
            <div className="w-10 h-10 rounded-full bg-[#DC2626] flex items-center justify-center">
              <span className="text-white font-bold text-xl">✗</span>
            </div>
            <p className="text-[#6B7280] text-lg font-medium text-center">
              No hay detalles del producto.
            </p>
            <Link
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
              to="/"
              aria-label="Volver a la lista de productos"
            >
              Volver a productos
            </Link>
          </div>
        )}

        {!isLoading && !isError && slugProduct && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-md p-6 animate-fadeIn">
            <ProductoCardSlug product={slugProduct} AddToCart={addToCart} />
          </div>
        )}
      </section>
    </main>
  );
}
