import { formatPrice } from "../../constantsAndFunctions";
import { useCart } from "../variablesUser";

export function ProductoCardSlug({ product }) {
  const { cart, addToCart } = useCart();
  const productoEnCarrito = cart.find(
    (item) => item.id_producto === product.id_producto
  );
  const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;

  const isOutOfStock = product.stock === 0;
  const isAtMaxStock = cantidadEnCarrito >= product.stock;

  return (
    <article
      className="bg-white border border-[#E5E7EB] rounded-xl shadow-md overflow-hidden max-w-sm flex flex-col items-start"
      aria-labelledby={`product-title-${product.id_producto}`}
    >
      <div className="w-full h-48 bg-gray-200">
        <img
          src={product.url}
          alt={`Imagen de ${product.nombre}`}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="p-5 flex flex-col gap-3">
        <h2
          id={`product-title-${product.id_producto}`}
          className="text-[#111827] text-xl font-semibold text-pretty"
        >
          {product.nombre}
        </h2>

        <p className="text-[#6B7280] text-sm line-clamp-3 text-pretty">
          {product.descripcion}
        </p>

        <p className="text-[#111827] text-lg font-bold">
          ${formatPrice(product.precio)}
        </p>

        <button
          onClick={() => addToCart(product)}
          disabled={isOutOfStock || isAtMaxStock}
          aria-disabled={isOutOfStock || isAtMaxStock}
          aria-label={
            isOutOfStock
              ? `${product.nombre} sin stock`
              : isAtMaxStock
              ? `Cantidad máxima alcanzada`
              : `Agregar ${product.nombre} al carrito`
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
            ? `Máximo (${product.stock})`
            : "Agregar al carrito"}
        </button>
      </div>
    </article>
  );
}
