import { formatPrice, parseFecha } from "../../constantsAndFunctions";
import { Link } from "react-router-dom";

export function TablaHistorialPedidos({ pedidos }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-[#1E293B] text-[#F9FAFB]">
        <thead className="bg-[#111827]">
          <tr>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              ID Historial
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              ID Pedido
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Fecha de Pedido
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
              Total
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Productos
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Fecha de Modificación
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Estado
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Usuario Modificador
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Perfil
            </th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr
              key={pedido.id_historial}
              className="hover:bg-[#172554] transition-colors"
            >
              <td className="py-2 px-4 border-b border-[#374151]">
                {pedido.id_historial}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {pedido.id_pedido}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {(() => {
                  const fecha = parseFecha(pedido.fecha_pedido);
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
                {pedido.cliente}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {pedido.telefono}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {pedido.sucursal}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                ${formatPrice(pedido.precio_total)}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                <ul className="list-disc list-inside">
                  {pedido.productos.map((prod) => (
                    <li key={prod.id_producto}>
                      <Link to={`/admin/home/producto/${prod.slug}`}>
                        {prod.nombre}
                      </Link>{" "}
                      x {prod.cantidad}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {(() => {
                  const fecha = parseFecha(pedido.fecha_modificacion);
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
                {pedido.detalle_estado}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {pedido.usuario_modificador}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {pedido.perfil}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
