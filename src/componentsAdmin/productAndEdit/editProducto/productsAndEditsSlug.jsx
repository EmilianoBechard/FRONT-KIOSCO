import { useParams } from "react-router-dom";
import { useProductos } from "../variablesProductsAndEdit.js";
import { useState, useEffect } from "react";
import { CardSlugEditCard } from "./productAndEditCardSlug.jsx";

export function ProductAndEditSlug() {
  const { slug } = useParams();
  const { productos, isLoading, isError, error, refetch } = useProductos();
  const [slugProduct, setSlugProduct] = useState(null);

  useEffect(() => {
    if (productos.length > 0) {
      const found = productos.find((p) => p.slug === slug);
      setSlugProduct(found || null);
    }
  }, [productos, slug]);

  useEffect(() => {
    if (!isLoading && !isError && !slugProduct && productos.length === 0) {
      refetch();
    }
  }, [isLoading, isError, slugProduct, productos.length, refetch]);

  return (
    <section className="bg-[#111827] p-6 rounded-lg shadow-md shadow-[#374151] mt-5">
      <div className="flex flex-row flex-wrap items-center justify-center gap-5 mb-5">
        <h2 className="text-2xl font-bold text-[#F9FAFB] mb-2">
          Hola, administrador
        </h2>
        <p className="text-[#CBD5E1]">
          Aqui podras editar o eliminar el producto.
        </p>
      </div>
      <section className="flex flex-col gap-4 justify-center items-center">
        {isLoading && !isError && (
          <p className="text-[#9CA3AF]">Cargando detalles del producto...</p>
        )}
        {isError && !isLoading && (
          <p className="text-red-500">
            {error?.message || "Error al cargar los detalles del producto."}
          </p>
        )}
        {!isLoading && !isError && !slugProduct && (
          <p className="text-[#9CA3AF]">No hay detalles del producto.</p>
        )}
      </section>
      {!isLoading && !isError && slugProduct && (
        <CardSlugEditCard producto={slugProduct} />
      )}
    </section>
  );
}
