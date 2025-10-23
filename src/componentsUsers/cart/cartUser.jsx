import { useState } from "react";
import {
  useCart,
  useCheckUserSession,
  useUserProductos,
  useUserSucursales,
} from "../variablesUser";
import toast from "react-hot-toast";
import axios from "axios";
import { url } from "../../constantsAndFunctions";
import { useEffect } from "react";

function CartItem({ producto, erroresProductos }) {
  const { cart, addToCart, decrementQuantity } = useCart();
  const productoEnCarrito = cart.find(
    (item) => item.id_producto === producto.id_producto
  );
  const cantidadEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;

  const isOutOfStock = producto.stock === 0;
  const isAtMaxStock = cantidadEnCarrito >= producto.stock;

  return (
    <div className="bg-[#FFFFFF] p-4 rounded-xl shadow-sm flex justify-between items-center border border-[#E5E7EB]">
      <div className="flex items-center gap-4">
        <img
          src={producto.url}
          alt={producto.nombre}
          className="w-20 h-20 object-cover rounded-lg"
          loading="lazy"
        />
        <div>
          <h2 className="text-[#111827] font-semibold">{producto.nombre}</h2>
          <p className="text-[#6B7280] text-sm">
            Cantidad: ${producto.precio} x {producto.cantidad}/{producto.stock}
          </p>
          {erroresProductos[producto.id_producto] && (
            <p className="text-red-500 text-sm mt-1">
              ❌ {erroresProductos[producto.id_producto]}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="text-[#111827] font-bold">
          ${producto.precio * producto.cantidad}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => decrementQuantity(producto)}
            className="px-3 py-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded transition-colors disabled:opacity-50"
            aria-label={`Disminuir cantidad de ${producto.nombre}`}
          >
            -
          </button>
          <button
            onClick={() => addToCart(producto)}
            disabled={isAtMaxStock || isOutOfStock}
            className={`px-3 py-1 rounded transition-colors text-white ${
              isOutOfStock || isAtMaxStock
                ? "bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed"
                : "bg-[#16A34A] hover:bg-[#15803D]"
            }`}
            aria-label={`Aumentar cantidad de ${producto.nombre}`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export function CartUser() {
  const { isLogged, loading } = useCheckUserSession();
  const { productos, isLoading: isLoadingProductos } = useUserProductos();
  const { cart, clearCart, syncCartStock } = useCart();
  const [isloading, setIsLoading] = useState(false);
  const [idSucursal, setIdSucursal] = useState("");
  const [erroresProductos, setErroresProductos] = useState({});
  const { sucursales } = useUserSucursales();
  useEffect(() => {
    if (productos && productos.length > 0 && cart.length > 0) {
      syncCartStock(productos);
    }
  }, [productos]);
  useEffect(() => {
    if (!productos || productos.length === 0 || cart.length === 0) {
      setErroresProductos({});
      return;
    }

    const nuevosErrores = {};
    cart.forEach((item) => {
      const productoActual = productos.find(
        (p) => p.id_producto === item.id_producto
      );
      if (!productoActual) {
        nuevosErrores[item.id_producto] = "El producto ya no existe";
      } else if (!productoActual.activo) {
        nuevosErrores[item.id_producto] = "El producto no está activo";
      } else if (item.cantidad > productoActual.stock) {
        nuevosErrores[item.id_producto] = `No quedan unidades`;
      }
    });

    setErroresProductos(nuevosErrores);
  }, [cart, productos]);

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío.");
      return;
    }
    if (!idSucursal) {
      toast.error("Debes seleccionar una sucursal");
      return;
    }

    if (loading) {
      toast.error("Verificando sesión, espera un momento...");
      return;
    }

    if (!isLogged) {
      toast.error("Debes iniciar sesión antes de hacer un pedido");
      return;
    }
    setIsLoading(true);
    setErroresProductos({});

    try {
      await axios.post(
        `${url}/pedidos/create/pedido`,
        {
          id_sucursal: Number(idSucursal),
          productos: cart.map((item) => ({
            id_producto: item.id_producto,
            cantidad: item.cantidad,
          })),
          precio_total: totalPrice,
        },
        {
          headers: { "Content-Type": "application/json;charset=utf-8" },
          withCredentials: true,
        }
      );

      toast.success("✅ Pedido creado exitosamente");
      clearCart();
      setIdSucursal("");
    } catch (error) {
      if (error.response && error.response.data) {
        const { error: mensajeError } = error.response.data;
        toast.error(`❌ ${mensajeError}`);
      } else {
        toast.error("❌ Error al enviar el pedido");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 flex justify-center">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-[#111827]">Tu carrito</h1>

        {cart.length === 0 ? (
          <p className="text-[#6B7280]">No hay productos en el carrito.</p>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {cart.map((producto) => (
                <CartItem
                  key={producto.id_producto}
                  producto={producto}
                  erroresProductos={erroresProductos}
                />
              ))}
            </div>

            <div className="bg-[#FFFFFF] p-4 rounded-xl shadow-sm flex justify-between items-center border border-[#E5E7EB]">
              <span className="text-[#111827] font-bold text-lg">Total</span>
              <span className="text-[#111827] font-bold text-lg">
                ${totalPrice}
              </span>
            </div>
            <div className="mb-4">
              <label className="block text-[#F9FAFB] mb-2">Categoría</label>
              <select
                name="sucursal"
                value={idSucursal}
                onChange={(e) => setIdSucursal(e.target.value)}
                className="w-full p-2 rounded bg-[#111827] text-[#F9FAFB] border border-[#374151] transition-colors"
              >
                <option value="">Selecciona una sucursal</option>
                {sucursales.map((sucursal) => (
                  <option
                    key={sucursal.id_sucursal}
                    value={sucursal.id_sucursal}
                  >
                    {sucursal.direccion}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={isloading}
              className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
                isloading
                  ? "bg-[#15803D] cursor-not-allowed"
                  : "bg-[#16A34A] hover:bg-[#15803D] cursor-pointer"
              }`}
            >
              {isloading ? "Enviando pedido..." : "Enviar pedido"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
