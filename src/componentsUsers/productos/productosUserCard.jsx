import { Link } from "react-router-dom";
import { useCart } from "../variablesUser";
import { formatPrice } from "../../constantsAndFunctions";

export function ProductoUserCard({ producto }) {
  const { cart, addToCart } = useCart();
  const productoEnCarrito = cart.find(
    (item) => item.id_producto === producto.id_producto
  );
  const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;

  const isOutOfStock = producto.stock === 0;
  const isAtMaxStock = cantidadEnCarrito >= producto.stock;

  return (
    <article
      className="relative bg-[#FFFFFF] rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden flex flex-col"
      aria-labelledby={`producto-${producto.id_producto}`}
    >
      {isOutOfStock && (
        <span className="absolute top-2 left-2 bg-[#DC2626] text-white px-2 py-1 text-xs font-semibold rounded">
          Sin stock
        </span>
      )}

      <div className="w-full h-48 bg-gray-200">
        <Link to={`/productos/${producto.slug}`}>
          <img
            src={producto.url}
            alt={`Imagen de ${producto.nombre}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="p-4 flex flex-col justify-between flex-1 gap-6 w-full">
        <h2
          id={`producto-${producto.id_producto}`}
          className="text-[#111827] font-semibold text-lg text-pretty"
        >
          {producto.nombre}
        </h2>

        <p className="text-[#111827] font-bold text-lg">
          ${formatPrice(producto.precio)}
        </p>

        {cantidadEnCarrito > 0 && !isOutOfStock && (
          <p className="text-sm text-gray-600 mt-1">
            En carrito: {cantidadEnCarrito}/{producto.stock}
          </p>
        )}
        <button
          type="button"
          onClick={() => addToCart(producto)}
          disabled={isOutOfStock || isAtMaxStock}
          className={`mt-2 font-medium px-4 py-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isOutOfStock || isAtMaxStock
              ? "bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed"
              : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white focus:ring-[#2563EB] cursor-pointer"
          }`}
        >
          {isOutOfStock
            ? "Sin stock"
            : isAtMaxStock
            ? `Máximo (${producto.stock})`
            : "Añadir al carrito"}
        </button>
      </div>
    </article>
  );
}
