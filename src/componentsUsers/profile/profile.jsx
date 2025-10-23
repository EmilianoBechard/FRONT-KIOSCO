import { Link } from "react-router-dom";
import { useUserPedidos } from "../variablesUser";
import { CartIcon } from "../../assets/iconos";
import { TablaPedidosUser } from "./tablaPedidosProfile";
import { useState } from "react";

export function ProfileUser() {
  const { pedidosUser, isLoading, isError, error, refetch } = useUserPedidos();

  const user = JSON.parse(localStorage.getItem("user")) || {
    nombre: "",
    apellido: "",
    email: "",
  };
  const [refreshMessage, setRefreshMessage] = useState(false);

  const handleRefetch = async () => {
    await refetch();
    setRefreshMessage(true);
    setTimeout(() => setRefreshMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <div className="mb-6">
        <p className="text-sm text-[#6B7280]">
          <Link to="/" className="text-[#2563EB] hover:text-[#1D4ED8]">
            Inicio
          </Link>{" "}
          {">"} <span className="text-[#111827]">Mi cuenta</span>
        </p>
      </div>

      <h2 className="text-2xl font-bold text-[#111827] mb-6">Mi Cuenta</h2>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#111827]">
              Datos Personales
            </h3>
            <Link
              to="/account/edit"
              className="text-sm text-[#3B82F6] hover:text-[#1D4ED8] font-medium transition-colors"
            >
              Editar
            </Link>
          </div>

          <dl className="flex flex-col gap-1">
            <dt className="sr-only">Nombre completo</dt>
            <dd className="text-[#111827] text-lg font-semibold">
              {user.nombre} {user.apellido}
            </dd>

            <dt className="sr-only">Correo electrónico</dt>
            <dd className="text-[#6B7280]">{user.email}</dd>
          </dl>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex flex-col md:col-span-2">
          {isLoading && (
            <p className="text-[#6B7280]" role="status" aria-live="polite">
              Cargando tus pedidos...
            </p>
          )}
          {isError && (
            <p
              className="text-[#DC2626] font-medium"
              role="alert"
              aria-live="assertive"
            >
              {error?.message || "Error al cargar tus pedidos."}
            </p>
          )}

          {!isLoading && !isError && pedidosUser.length === 0 && (
            <div
              className="flex flex-col items-center gap-3 text-center"
              role="status"
              aria-live="polite"
            >
              <CartIcon className="w-12 h-12 text-[#8B5CF6]" />
              <p className="text-[#6B7280]">¡Hacé tu primera compra!</p>
              <Link
                to="/"
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg shadow-sm transition"
              >
                IR A LA TIENDA
              </Link>
            </div>
          )}

          {pedidosUser.length > 0 && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#111827]">
                  Mis Pedidos
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefetch}
                    disabled={isLoading}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg shadow transition cursor-pointer ${
                      isLoading
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                    }`}
                  >
                    {isLoading ? "Actualizando..." : "Actualizar"}
                  </button>
                  {refreshMessage && (
                    <span
                      className="text-green-500 text-sm font-medium"
                      role="status"
                      aria-live="polite"
                    >
                      Pedidos actualizados ✅
                    </span>
                  )}
                </div>
              </div>

              <TablaPedidosUser pedidos={pedidosUser} />
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
