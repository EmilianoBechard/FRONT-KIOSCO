import { Navigate } from "react-router-dom";
import { useCheckUserSession } from "./variablesUser.jsx";
import toast from "react-hot-toast";
import { useEffect } from "react";

export function ProtectedRouteUser({ children }) {
  const { isLogged, loading } = useCheckUserSession();

  useEffect(() => {
    if (!loading && !isLogged) {
      toast.error("Tu sesión expiró. Por favor inicia sesión.");
    }
  }, [isLogged, loading]);

  if (loading) return <p>Cargando...</p>;

  if (!isLogged) return <Navigate to="/" replace />;

  return children;
}
