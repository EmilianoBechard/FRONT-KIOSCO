import { useState, useEffect, useRef } from "react";
import { useUserProductos } from "../variablesUser.jsx";
import { ProductoDestacadoCard } from "./productoDestacadoCard.jsx";

export function Home() {
  const { productos, isLoading, isError, error } = useUserProductos();
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const trackRef = useRef(null);
  const interactionTimeout = useRef(null);

  useEffect(() => {
    if (productos.length > 0) {
      const filteredImages = productos
        .filter((p) => p.carousel === 1)
        .map((p) => p.url);
      setImages(filteredImages);
    }
  }, [productos]);

  useEffect(() => {
    if (images.length === 0) return;
    if (!isInteracting) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isInteracting, images]);

  useEffect(() => {
    if (!trackRef.current) return;
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += trackRef.current.children[i].clientWidth;
    }
    trackRef.current.style.transform = `translateX(-${offset}px)`;
  }, [index, images]);

  const handleInteraction = (newIndex) => {
    setIndex(newIndex);
    setIsInteracting(true);
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    interactionTimeout.current = setTimeout(
      () => setIsInteracting(false),
      4000
    );
  };

  const nextImage = () => handleInteraction((index + 1) % images.length);
  const prevImage = () =>
    handleInteraction((index - 1 + images.length) % images.length);

  useEffect(() => {
    const handleResize = () => {
      if (!trackRef.current) return;
      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += trackRef.current.children[i].clientWidth;
      }
      trackRef.current.style.transform = `translateX(-${offset}px)`;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [index]);

  return (
    <>
      <section
        className="relative w-full max-w-[1500px] h-[400px] mx-auto overflow-hidden rounded-2xl shadow-lg shadow-gray-400 bg-[#F9FAFB] transition-all duration-300 ease-in-out"
        aria-label="Carousel de productos"
      >
        {isLoading && (
          <div
            role="status"
            className="flex items-center justify-center h-full"
          >
            <p className="text-gray-500 text-lg animate-pulse">
              Cargando productos...
            </p>
          </div>
        )}
        {isError && (
          <div role="alert" className="flex items-center justify-center h-full">
            <p className="text-red-500 text-lg">
              Error al cargar productos: {error?.message}
            </p>
          </div>
        )}
        {!isLoading && !isError && images.length > 0 && (
          <>
            <div
              ref={trackRef}
              className="flex transition-transform duration-700 ease-in-out h-full"
            >
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Imagen ${i + 1}`}
                  className="w-full flex-shrink-0 h-full object-contain rounded-xl shadow-md shadow-[#3B82F6]/30"
                  loading="lazy"
                />
              ))}
            </div>
            <div aria-live="polite" className="sr-only">
              Imagen actual: {index + 1} de {images.length}
            </div>

            <button
              onClick={prevImage}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-[#3B82F6]/80 hover:bg-[#60A5FA] text-white px-4 py-2 rounded-full shadow-md transition-colors cursor-pointer"
              aria-label="Imagen anterior"
            >
              ❮
            </button>

            <button
              onClick={nextImage}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-[#3B82F6]/80 hover:bg-[#60A5FA] text-white px-4 py-2 rounded-full shadow-md transition-colors cursor-pointer"
              aria-label="Siguiente imagen"
            >
              ❯
            </button>

            <nav
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3"
              role="tablist"
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleInteraction(i)}
                  className={`w-4 h-4 rounded-full transition-colors ${
                    i === index ? "bg-[#3B82F6]" : "bg-[#CBD5E1]"
                  }`}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Ir a la imagen ${i + 1}`}
                />
              ))}
            </nav>
          </>
        )}{" "}
        {!isLoading && !isError && images.length === 0 && (
          <p className="text-[#111827] text-center mt-10">
            No hay productos en el carrusel.
          </p>
        )}
      </section>
      <section className="max-w-[1500px] mx-auto mt-10 mb-10 px-4">
        <h2 className="text-[#111827] text-2xl font-semibold mb-6 text-center">
          Productos Destacados
        </h2>

        {isLoading ? (
          <p className="text-gray-500 text-center animate-pulse">
            Cargando productos...
          </p>
        ) : isError ? (
          <p className="text-red-500 text-center">
            Error al cargar productos: {error?.message}
          </p>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos
              .filter((p) => p.destacado === 1)
              .map((p) => (
                <ProductoDestacadoCard key={p.id_producto} producto={p} />
              ))}
          </div>
        ) : (
          <p className="text-[#111827] text-center">
            No hay productos destacados.
          </p>
        )}
      </section>
    </>
  );
}
