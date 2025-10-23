export function TablaClientes({ clientes }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-[#1E293B] text-[#F9FAFB]">
        <thead className="bg-[#111827]">
          <tr>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              ID Usuario
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Nombre de Cliente
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Telefono
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Email
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Pedidos
            </th>
            <th className="py-2 px-4 border-b border-[#374151] text-left">
              Ultimo Pedido
            </th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr
              key={cliente.id_usuario}
              className="hover:bg-[#172554] transition-colors"
            >
              <td className="py-2 px-4 border-b border-[#374151]">
                {cliente.id_usuario}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {cliente.cliente}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {cliente.telefono}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {cliente.email}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {cliente.pedidos}
              </td>
              <td className="py-2 px-4 border-b border-[#374151]">
                {cliente.ultimo_pedido}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
