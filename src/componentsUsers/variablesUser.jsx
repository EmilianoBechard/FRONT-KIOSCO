import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { url } from "../constantsAndFunctions.jsx";
import { useNavigate } from "react-router-dom";
import { UserLoginContext } from "./contextUser/userLogin.jsx";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { CartContext } from "./contextUser/userCart.jsx";

export function useUserProductos() {
  const {
    data: productos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProductos"],
    queryFn: async () => {
      const response = await axios.get(`${url}/usuario/productos`);
      const productos = response.data.productos.filter((p) => p.activo === 1);
      return productos;
    },
  });
  return {
    productos,
    isLoading,
    isError,
    error,
    refetch,
  };
}

export function useUserPedidos() {
  const {
    data: pedidosUser = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userPedidos"],
    queryFn: async () => {
      const response = await axios.get(`${url}/pedidos/usuario`, {
        withCredentials: true,
      });
      return response.data.pedidosUser;
    },
  });
  return {
    pedidosUser,
    isLoading,
    isError,
    refetch,
  };
}

export function useUserCategorias() {
  const {
    data: categorias = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userCategorias"],
    queryFn: async () => {
      const response = await axios.get(`${url}/usuario/productos/categorias`);
      return response.data.categorias;
    },
  });
  return {
    categorias,
    isLoading,
    isError,
    refetch,
  };
}
export function useUserSucursales() {
  const {
    data: sucursales = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["userSucursales"],
    queryFn: async () => {
      const response = await axios.get(`${url}/usuario/sucursales`);
      return response.data.sucursales;
    },
  });
  return {
    sucursales,
    isLoading,
    isError,
    refetch,
  };
}

export function useCheckUserSession() {
  const { isUserLoggedIn, setIsUserLoggedIn } = useContext(UserLoginContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await axios.get(`${url}/usuario/auth/check`, {
          withCredentials: true,
        });

        if (response.data.loggedIn) {
          setIsUserLoggedIn(true);
        } else {
          localStorage.removeItem("user");
          setIsUserLoggedIn(false);
        }
      } catch (err) {
        localStorage.removeItem("user");
        setIsUserLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [setIsUserLoggedIn, navigate]);

  return { isLogged: isUserLoggedIn, loading };
}

export const useCart = () => {
  const cart = useContext(CartContext);

  return cart;
};
