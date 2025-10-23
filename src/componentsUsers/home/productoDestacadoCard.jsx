import { Link } from "react-router-dom";
import { useCart } from "../variablesUser";

export function ProductoDestacadoCard({ producto }) {
  const { cart, addToCart } = useCart();
  const productoEnCarrito = cart.find(
    (item) => item.id_producto === producto.id_producto
  );
  const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;

  const isOutOfStock = producto.stock === 0;
  const isAtMaxStock = cantidadEnCarrito >= producto.stock;

  return (
    <article
      className="bg-white rounded-xl shadow-sm border p-4 flex flex-col hover:shadow-md transition-shadow relative"
      aria-labelledby={`producto-${producto.id_producto}`}
    >
      {isOutOfStock && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm">
          Sin stock
        </div>
      )}
      <Link to={`/productos/${producto.slug}`}>
        <img
          src={producto.url}
          alt={producto.nombre}
          className="w-full h-48 object-contain rounded-lg mb-4"
          loading="lazy"
        />
      </Link>

      <h3
        id={`producto-${producto.id_producto}`}
        className="text-[#111827] font-semibold text-center text-lg mb-1 text-pretty"
      >
        {producto.nombre}
      </h3>

      <div className="flex flex-col items-center justify-between mt-auto">
        <span className="text-[#111827] font-bold">${producto.precio}</span>

        <button
          onClick={() => addToCart(producto)}
          disabled={isOutOfStock || isAtMaxStock}
          aria-disabled={isOutOfStock || isAtMaxStock}
          aria-label={
            isOutOfStock
              ? `${producto.nombre} sin stock`
              : isAtMaxStock
              ? `Cantidad máxima alcanzada`
              : `Agregar ${producto.nombre} al carrito`
          }
          className={`px-4 py-2 rounded-lg text-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
            isOutOfStock || isAtMaxStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#2563EB] hover:bg-[#1D4ED8] focus:ring-[#2563EB]"
          }`}
        >
          {isOutOfStock
            ? "Sin stock"
            : isAtMaxStock
            ? `Máximo (${producto.stock})`
            : "Agregar al carrito"}
        </button>
      </div>
    </article>
  );
}
