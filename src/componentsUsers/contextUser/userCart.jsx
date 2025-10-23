import { useEffect, useReducer, createContext } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext();

const initialState = [];
const reducer = (state, action) => {
  const { type: actionType, payload: actionPayload } = action;

  if (actionType === "ADD_TO_CART") {
    const productoInCartIndex = state.findIndex(
      (item) => item.id_producto === actionPayload.id_producto
    );

    if (productoInCartIndex >= 0) {
      const productoEnCarrito = state[productoInCartIndex];

      if (productoEnCarrito.cantidad >= actionPayload.stock) {
        return state;
      }
      const newState = structuredClone(state);
      newState[productoInCartIndex].cantidad += 1;

      return newState;
    }

    return [...state, { ...actionPayload, cantidad: 1 }];
  }

  if (actionType === "DECREMENT_QUANTITY") {
    const productoInCartIndex = state.findIndex(
      (item) => item.id_producto === actionPayload.id_producto
    );

    if (productoInCartIndex < 0) return state;

    const producto = state[productoInCartIndex];

    if (producto.cantidad === 1) {
      return state.filter((item) => item.id_producto !== producto.id_producto);
    }

    const newState = structuredClone(state);
    newState[productoInCartIndex].cantidad -= 1;

    return newState;
  }

  if (actionType === "REMOVE_FROM_CART") {
    return state.filter(
      (item) => item.id_producto !== actionPayload.id_producto
    );
  }

  if (actionType === "CLEAR_CART") {
    return initialState;
  }

  if (actionType === "SET_CART") return actionPayload;
};

export function CartProvider({ children }) {
  const storedCart = JSON.parse(localStorage.getItem("cart")) || initialState;

  const [state, dispatch] = useReducer(reducer, storedCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addToCart = (producto) => {
    dispatch({ type: "ADD_TO_CART", payload: producto });

    const inCart = state.find((p) => p.id_producto === producto.id_producto);

    if (inCart) {
      if (inCart.cantidad >= producto.stock) {
        toast.error(
          `❌ No puedes añadir más unidades de ${producto.nombre}. Stock: ${producto.stock}`
        );
      } else {
        toast.success(`➕ Se agregó otra unidad de ${producto.nombre}`);
      }
    } else {
      toast.success(`✅ ${producto.nombre} agregado al carrito`);
    }
  };

  const decrementQuantity = (producto) => {
    dispatch({ type: "DECREMENT_QUANTITY", payload: producto });

    const inCart = state.find((p) => p.id_producto === producto.id_producto);
    if (!inCart || inCart.cantidad === 1) {
      toast(`🗑️ ${producto.nombre} eliminado del carrito`, { icon: "❌" });
    } else {
      toast(`➖ Se quitó una unidad de ${producto.nombre}`);
    }
  };

  const removeFromCart = (producto) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: producto });
    toast.error(`❌ ${producto.nombre} eliminado del carrito`);
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.error("🛒 Carrito vacío");
  };
  const syncCartStock = (productosBackend) => {
    const newCart = state.map((item) => {
      const productoActual = productosBackend.find(
        (p) => p.id_producto === item.id_producto
      );
      if (!productoActual) return item; // si no existe, no tocamos
      return { ...item, stock: productoActual.stock };
    });

    dispatch({ type: "SET_CART", payload: newCart });
  };

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addToCart,
        decrementQuantity,
        removeFromCart,
        clearCart,
        syncCartStock,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
