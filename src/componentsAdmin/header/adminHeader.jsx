import { ExitIcon, HamburgerIcon, LogoutIcon } from "../../assets/iconos";
import { AdminLoginContext } from "../context/adminLogin";
import { useContext } from "react";
import { url } from "../../constantsAndFunctions";
import axios from "axios";

export function AdminHeader({ setExitAside, exitAside }) {
  const { setIsAdminLoggedIn } = useContext(AdminLoginContext);

  function exitAsideChange() {
    setExitAside(!exitAside);
  }

  async function logoutAdmin() {
    try {
      await axios.post(
        `${url}/admin/logout`,
        {},
        {
          headers: { "Content-Type": "application/json;charset=utf-8" },
          withCredentials: true,
        }
      );
      localStorage.removeItem("userAdmin");
      setIsAdminLoggedIn(false);
    } catch (error) {
      alert("No se pudo cerrar sesión. Inténtalo nuevamente.");
    }
  }

  return (
    <header className="w-full h-16 max-sm:h-auto max-sm:p-4 bg-[#1B336E] flex max-sm:flex-col max-sm:gap-3 items-center px-4 shadow-md shadow-[#374151] flex-wrap">
      <button
        onClick={exitAsideChange}
        className="p-2 mr-4 max-sm:mr-0 2xl:hidden rounded hover:bg-[#374151] transition-colors"
        aria-label={exitAside ? "Abrir menú lateral" : "Cerrar menú lateral"}
        aria-pressed={!exitAside}
      >
        {exitAside ? (
          <HamburgerIcon className="text-[#F9FAFB] cursor-pointer" />
        ) : (
          <ExitIcon className="text-[#F9FAFB] cursor-pointer" />
        )}
      </button>

      <h2 className="text-[#F9FAFB] text-xl font-bold">
        Panel de Administración
      </h2>

      <div className="flex-grow flex justify-end ">
        <button
          onClick={logoutAdmin}
          className="bg-[#3B82F6] text-[#F9FAFB] px-4 py-2 rounded hover:bg-[#2563EB] transition-all duration-300 cursor-pointer flex items-center gap-1"
        >
          <LogoutIcon />
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
