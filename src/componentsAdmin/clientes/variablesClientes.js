import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { url } from "../../constantsAndFunctions";

export function useClientes() {
  const [queryKeySuffix, setQueryKeySuffix] = useState(0);
  const {
    data: clientes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clientes", queryKeySuffix],
    queryFn: async () => {
      const response = await axios.get(`${url}/admin/clientes`, {
        withCredentials: true,
      });
      return response.data.clientes;
    },

    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });
  const refetchAndResetTimer = () => {
    setQueryKeySuffix((prev) => prev + 1);
    refetch();
  };

  return {
    clientes,
    isLoading,
    isError,
    error,
    refetch: refetchAndResetTimer,
  };
}
