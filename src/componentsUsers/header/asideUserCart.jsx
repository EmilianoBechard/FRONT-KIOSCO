import { Link, useNavigate } from "react-router-dom";
import {
  ExitIcon,
  CartIcon,
  ClearCartIcon,
  CheckCartIcon,
} from "../../assets/iconos";
import "../../style.css";
import { useCart } from "../variablesUser";

function CartItem({ producto }) {
  const { cart, addToCart, decrementQuantity } = useCart();
  const productoEnCarrito = cart.find(
    (item) => item.id_producto === producto.id_producto
  );
  const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;

  const isOutOfStock = producto.stock === 0;
  const isAtMaxStock = cantidadEnCarrito >= producto.stock;
  return (
    <li
      key={producto.id_producto}
      className="border-b border-[#E5E7EB] bg-[#FFFFFF] m-2 rounded shadow-sm"
    >
      <article className="flex flex-col">
        <img
          src={producto.url}
          alt={producto.nombre}
          className="aspect-video object-cover w-full rounded-t"
          loading="lazy"
        />
        <div className="p-3">
          <strong className="font-semibold text-[#111827]">
            {producto.nombre}
          </strong>
        </div>
        <footer className="flex gap-2 justify-between items-center p-3 border-t border-[#E5E7EB]">
          <p className="text-[#6B7280] text-sm">
            Cantidad: {producto.cantidad} x ${producto.precio}
          </p>
          <p className="font-bold text-[#111827]">
            ${producto.precio * producto.cantidad}
          </p>
          <button
            onClick={() => decrementQuantity(producto)}
            className="px-2 py-1 bg-[#16A34A] hover:bg-[#15803D] text-white rounded transition-colors"
            aria-label={`Disminuir cantidad de ${producto.nombre}`}
          >
            -
          </button>
          <button
            onClick={() => addToCart(producto)}
            disabled={isOutOfStock || isAtMaxStock}
            className={`px-2 py-1 rounded transition-colors text-white ${
              isOutOfStock || isAtMaxStock
                ? "bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed"
                : "bg-[#16A34A] hover:bg-[#15803D]"
            }`}
            aria-label={`Aumentar cantidad de ${producto.nombre}`}
          >
            +
          </button>
        </footer>
      </article>
    </li>
  );
}

export function AsideUserCart({ cartVisible, setCartVisible }) {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  // Total calculado
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <aside
      role="region"
      aria-label="Carrito de compras"
      className={`${
        cartVisible
          ? "translate-x-0 translate-y-0 opacity-100 overflow-y-auto visible"
          : "translate-x-full translate-y-0 opacity-0 invisible"
      } fixed z-[998] top-0 bottom-0 right-0 max-w-sm transition-all duration-300 ease-in-out bg-white shadow-lg flex flex-col border-l border-gray-600`}
    >
      <div className="flex justify-end p-1 py-2">
        <button
          onClick={() => setCartVisible(!cartVisible)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-blue-600 cursor-pointer"
        >
          <ExitIcon className="w-6 h-6" />
        </button>
      </div>

      <h2 className="px-4 py-2 font-bold text-gray-900 border-b border-gray-300 flex items-center gap-2">
        <CartIcon />
        Tu carrito
      </h2>

      <ul className="flex-1 overflow-y-auto m-0 p-0 list-none bg-[#F9FAFB]">
        {cart.map((producto) => (
          <CartItem key={producto.id_producto} producto={producto} />
        ))}
      </ul>

      <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
        <p className="font-bold text-[#111827] mb-4">Total: ${totalPrice}</p>
        <button
          onClick={() => {
            setCartVisible(false);
            navigate("/cart");
          }}
          className="w-full text-center flex items-center justify-center gap-2 bg-[#2563EB] text-white py-2 px-2 rounded hover:bg-[#1D4ED8] transition-colors cursor-pointer"
        >
          <CheckCartIcon />
          Ir al carrito
        </button>
      </div>
      <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
        <button
          onClick={clearCart}
          className="w-full text-center flex items-center justify-center gap-2 bg-[#2563EB] text-white py-2 px-2 rounded hover:bg-[#1D4ED8] transition-colors cursor-pointer"
        >
          <ClearCartIcon />
          Vaciar el carrito
        </button>
      </div>
    </aside>
  );
}
