// useCheckAdminSession.jsx
import { useState, useContext, useEffect } from "react";
import { url } from "../constantsAndFunctions";
import { AdminLoginContext } from "./context/adminLogin";
import axios from "axios";
import toast from "react-hot-toast";

export function useCheckAdminSession() {
  const { isAdminLoggedIn, setIsAdminLoggedIn } = useContext(AdminLoginContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await axios.get(`${url}/admin/auth/check`, {
          withCredentials: true,
        });

        if (response.data.loggedIn) {
          setIsAdminLoggedIn(true);
        } else {
          localStorage.removeItem("userAdmin");
          setIsAdminLoggedIn(false);
          toast.error("Tu sesión expiró. Por favor inicia sesión de nuevo.");
        }
      } catch (err) {
        localStorage.removeItem("userAdmin");
        setIsAdminLoggedIn(false);
        toast.error("Tu sesión expiró. Por favor inicia sesión de nuevo.");
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, [setIsAdminLoggedIn]);

  return { isLogged: isAdminLoggedIn, loading };
}
