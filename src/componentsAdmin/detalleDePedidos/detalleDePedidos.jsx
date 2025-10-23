import axios from "axios";
import { formatPrice, parseFecha, url } from "../../constantsAndFunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

export function TablaDetalleDePedidos({ pedidos }) {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState({});
  const [loadingPedidos, setLoadingPedidos] = useState({});
  const [success, setSuccess] = useState({});

  const mutation = useMutation({
    mutationFn: ({ idPedido, idEstado }) =>
      axios.patch(
        `${url}/admin/update/pedido/${idPedido}`,
        JSON.stringify({ id_estado: idEstado }),
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      ),
    onMutate: ({ idPedido }) => {
      setLoadingPedidos((prev) => ({ ...prev, [idPedido]: true }));
      setErrors((prev) => ({ ...prev, [idPedido]: null }));
      setSuccess((prev) => ({ ...prev, [idPedido]: false }));
    },
    onSuccess: (_, variables) => {
      const { idPedido } = variables;
      setLoadingPedidos((prev) => ({ ...prev, [idPedido]: false }));
      setSuccess((prev) => ({ ...prev, [idPedido]: true }));
      queryClient.invalidateQueries(["orderDetails"]);

      setTimeout(() => {
        setSuccess((prev) => ({ ...prev, [idPedido]: false }));
      }, 3000);
    },
    onError: (error, variables) => {
      const { idPedido } = variables;
      setLoadingPedidos((prev) => ({ ...prev, [idPedido]: false }));
      setErrors((prev) => ({ ...prev, [idPedido]: error.message }));
      setSuccess((prev) => ({ ...prev, [idPedido]: false }));
    },
  });

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-[#1E293B] text-[#F9FAFB]">
        <thead className="bg-[#111827]">
          <tr>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              ID Pedido
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Cliente
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Telefono
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Sucursal
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Fecha
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Total
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Productos
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Estado
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr
              key={pedido.id_pedido}
              className="hover:bg-[#172554] transition-colors"
            >
              <td className="py-2 px-4 border-b border-[#374151]">
                {pedido.id_pedido}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {pedido.cliente}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {pedido.telefono}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {pedido.sucursal}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {(() => {
                  const fecha = parseFecha(pedido.fecha);
                  return fecha
                    ? fecha.toLocaleString("es-AR", {
                        hour12: true,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Invalid Date";
                })()}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                ${formatPrice(pedido.precio_total)}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                <ul className="list-disc list-inside">
                  {pedido.productos.map((prod) => (
                    <li key={prod.id_producto}>
                      <Link to={`/admin/home/producto/${prod.slug}`}>
                        {prod.nombre}{" "}
                      </Link>
                      x {prod.cantidad}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {pedido.detalle_estado}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutation.mutate({
                      idPedido: pedido.id_pedido,
                      idEstado: Number(e.target.estado.value),
                    });
                  }}
                  className="flex flex-col gap-2"
                >
                  <select
                    name="estado"
                    defaultValue={pedido.estado_id}
                    className="bg-[#1E3A8A] text-[#F9FAFB] border border-[#374151] rounded p-2 transition-colors"
                    disabled={loadingPedidos[pedido.id_pedido]}
                  >
                    <option value="2">En proceso</option>
                    <option value="3">Listo</option>
                    <option value="4">Entregado</option>
                  </select>

                  <button
                    type="submit"
                    disabled={loadingPedidos[pedido.id_pedido]}
                    className="bg-[#3B82F6] hover:bg-[#60A5FA] text-[#F9FAFB] px-2 py-1 rounded text-sm transition-all duration-300 cursor-pointer"
                  >
                    {loadingPedidos[pedido.id_pedido]
                      ? "Actualizando..."
                      : "Actualizar"}
                  </button>

                  {errors[pedido.id_pedido] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[pedido.id_pedido]}
                    </p>
                  )}
                  {success[pedido.id_pedido] && (
                    <p className="text-green-500 text-sm mt-1">
                      Actualizado correctamente ✅
                    </p>
                  )}
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
