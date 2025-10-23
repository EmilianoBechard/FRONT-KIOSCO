import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { url } from "../../constantsAndFunctions.jsx";

export function useProductos() {
  const {
    data: productos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminProductos"],
    queryFn: async () => {
      const response = await axios.get(`${url}/admin/productos`, {
        withCredentials: true,
      });
      return response.data.productos;
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
