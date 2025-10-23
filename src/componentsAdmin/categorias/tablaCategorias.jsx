import axios from "axios";
import { url } from "../../constantsAndFunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function TablaCategorias({ categorias }) {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({});

  const deleteMutation = useMutation({
    mutationFn: async (id_categoria) =>
      axios.delete(`${url}/admin/categoria/${id_categoria}`, {
        withCredentials: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["categorias"]);
    },
    onError: (error, id_categoria) => {
      const backendMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error desconocido al borrar";
      setErrors((prev) => ({
        ...prev,
        [id_categoria]: backendMessage,
      }));
    },
  });

  const handleDelete = (id_categoria) => {
    if (window.confirm("¿Seguro que querés borrar esta categoría?")) {
      setLoading((prev) => ({ ...prev, [id_categoria]: true }));
      deleteMutation.mutate(id_categoria, {
        onSettled: () => {
          setLoading((prev) => ({ ...prev, [id_categoria]: false }));
        },
      });
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-[#1E293B] text-[#F9FAFB]">
        <thead className="bg-[#111827]">
          <tr>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              ID Categoría
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Categoría
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Eliminar
            </th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr
              key={categoria.id_categoria}
              className="hover:bg-[#172554] transition-colors"
            >
              <td className="py-2 px-4 border-b border-[#374151]">
                {categoria.id_categoria}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {categoria.categoria}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                <div className="flex flex-col flex-wrap w-auto">
                  <button
                    onClick={() => handleDelete(categoria.id_categoria)}
                    disabled={loading[categoria.id_categoria]}
                    className="bg-red-600 hover:bg-red-700 text-[#F9FAFB] px-2 py-1 rounded text-sm transition-all duration-300 cursor-pointer"
                  >
                    {loading[categoria.id_categoria]
                      ? "Eliminando..."
                      : "Eliminar"}
                  </button>
                  {errors[categoria.id_categoria] && (
                    <span className="text-red-500 ml-2 text-center">
                      {errors[categoria.id_categoria]}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
