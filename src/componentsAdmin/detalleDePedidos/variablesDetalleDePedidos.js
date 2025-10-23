import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { url } from "../../constantsAndFunctions";

export function useOrderDetails(filters = {}) {
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
    queryKey: ["orderDetails", queryKeySuffix, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = { page: pageParam, limit: 10 };

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const response = await axios.get(`${url}/pedidos/admin/detalles`, {
        params,
        withCredentials: true,
      });

      const pedidosConDetalles = response.data.detallePedidos;
      const nextCursor =
        pageParam < response.data.totalPages ? pageParam + 1 : undefined;

      return { pedidosConDetalles, nextCursor };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });
  const pedidosConDetallesFlattened =
    data?.pages.flatMap((page) => page.pedidosConDetalles) ?? [];

  const refetchAndResetTimer = () => {
    setQueryKeySuffix((prev) => prev + 1);
    refetch();
  };

  return {
    pedidosConDetalles: pedidosConDetallesFlattened,
    isLoading,
    isError,
    error,
    refetch: refetchAndResetTimer,
    fetchNextPage,
    hasNextPage,
  };
}
