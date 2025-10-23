import { Navigate } from "react-router-dom";
import { useCheckAdminSession } from "./variablesAdmin";
import "../style.css";

export function ProtectedRouteAdmin({ children }) {
  const { isLogged, loading } = useCheckAdminSession();

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1F2937]">
        <div
          className="p-6 rounded-lg shadow-lg shadow-[#374151] bg-[#1E3A8A] flex flex-col items-center gap-4"
          role="status"
          aria-live="polite"
        >
          <div className="w-16 h-16 border-4 border-t-[#3B82F6] border-b-[#60A5FA] border-l-[#CBD5E1] border-r-[#CBD5E1] rounded-full animate-spin"></div>
          <p className="text-[#F9FAFB] text-lg font-semibold">
            Cargando, por favor espera...
          </p>
          <p className="text-[#CBD5E1] text-sm">
            Estamos verificando tu sesión
          </p>
        </div>
      </div>
    );

  if (!isLogged) return <Navigate to="/admin/login" replace />;

  return children;
}
