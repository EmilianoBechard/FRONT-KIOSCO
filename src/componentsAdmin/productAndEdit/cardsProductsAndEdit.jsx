import { EyesIcon } from "../../assets/iconos.jsx";
import { Link } from "react-router-dom";
import { formatPrice } from "../../constantsAndFunctions.jsx";

export function CardProducto({ producto }) {
  return (
    <article
      key={producto.id_producto}
      className="bg-[#1B2A5C] text-[#F9FAFB] rounded-2xl shadow-lg overflow-hidden transition-shadow flex flex-col"
    >
      <figure className="w-full">
        <img
          src={producto.url}
          alt={producto.nombre}
          className="w-full min-h-52 max-h-52 object-contain"
          loading="lazy"
        />
        <figcaption className="sr-only">
          {producto.nombre} - {producto.descripcion}
        </figcaption>
      </figure>

      <div className="p-4 flex flex-col flex-grow">
        <header>
          <h2 className="text-lg font-bold mb-2">{producto.nombre}</h2>
        </header>

        <p className="text-sm text-[#CBD5E1] mb-3 break-words whitespace-normal">
          {producto.descripcion}
        </p>

        <footer className="mt-auto flex justify-between items-center gap-3 flex-wrap">
          <dl className="flex flex-col">
            <dt className="sr-only">Precio</dt>
            <dd className="text-xl font-semibold text-[#10B981]">
              ${formatPrice(producto.precio)}
            </dd>

            <dt className="sr-only">Stock</dt>
            <dd className="text-sm text-[#FBBF24]">Stock: {producto.stock}</dd>
          </dl>

          <Link
            to={`/admin/home/producto/${producto.slug}`}
            type="button"
            className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white py-2 px-4 rounded-lg transition-colors w-28 text-sm cursor-pointer flex items-center gap-1"
            aria-label={`Ver más sobre ${producto.nombre}`}
          >
            <EyesIcon />
            Ver más
          </Link>
        </footer>
      </div>
    </article>
  );
}
