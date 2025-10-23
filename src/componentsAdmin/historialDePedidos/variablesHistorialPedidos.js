import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { url } from "../../constantsAndFunctions";

export function useHistorialPedidos(filters = {}) {
  const [queryKeySuffix, setQueryKeySuffix] = useState(0);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["historialPedidos", queryKeySuffix, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = { page: pageParam, limit: 10 };

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const response = await axios.get(`${url}/admin/historial-pedidos`, {
        params,
        withCredentials: true,
      });

      const historialPedidos = response.data.historialPedidos;
      const nextCursor =
        pageParam < response.data.totalPages ? pageParam + 1 : undefined;

      return { historialPedidos, nextCursor };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });

  const historialPedidosFlattened =
    data?.pages.flatMap((page) => page.historialPedidos) ?? [];

  const refetchAndResetTimer = () => {
    setQueryKeySuffix((prev) => prev + 1);
    refetch();
  };

  return {
    historialPedidos: historialPedidosFlattened,
    isLoading,
    isError,
    error,
    refetch: refetchAndResetTimer,
    fetchNextPage,
    hasNextPage,
  };
}
