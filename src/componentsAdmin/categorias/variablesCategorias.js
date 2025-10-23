import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { url } from "../../constantsAndFunctions";

export function useCategorias() {
  const [queryKeySuffix, setQueryKeySuffix] = useState(0);
  const {
    data: categorias = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categorias", queryKeySuffix],
    queryFn: async () => {
      const response = await axios.get(`${url}/admin/categorias`, {
        withCredentials: true,
      });
      return response.data.categorias;
    },

    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });
  const refetchAndResetTimer = () => {
    setQueryKeySuffix((prev) => prev + 1);
    refetch();
  };

  return {
    categorias,
    isLoading,
    isError,
    error,
    refetch: refetchAndResetTimer,
  };
}
