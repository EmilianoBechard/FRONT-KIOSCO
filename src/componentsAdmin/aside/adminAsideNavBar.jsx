import { Link } from "react-router-dom";
import { useContext } from "react";
import { AdminAsideNavBarContext } from "../context/adminAsideNavBar.jsx";
import { inFocus, outFocus } from "./variables.jsx";
import {
  BookIcon,
  Categories,
  ExitIcon,
  HamburgerIcon,
  Historial,
  ProductsIcon,
  Users,
} from "../../assets/iconos.jsx";

export function AsideNavBar({ setExitAside, exitAside }) {
  const { AdminAsideNavBar, setAdminAsideNavBar } = useContext(
    AdminAsideNavBarContext
  );
  const admin = JSON.parse(localStorage.getItem("userAdmin")) || {
    nombre: "",
    apellido: "",
  };

  function inDetallesPedidos() {
    setAdminAsideNavBar({
      inDetallesPedidos: true,
      inProductos: false,
      inClientes: false,
      inCategorias: false,
      inHistorialPedidos: false,
    });
  }
  function inProductos() {
    setAdminAsideNavBar({
      inDetallesPedidos: false,
      inProductos: true,
      inClientes: false,
      inCategorias: false,
      inHistorialPedidos: false,
    });
  }
  function inClientes() {
    setAdminAsideNavBar({
      inDetallesPedidos: false,
      inProductos: false,
      inClientes: true,
      inCategorias: false,
      inHistorialPedidos: false,
    });
  }
  function inCategorias() {
    setAdminAsideNavBar({
      inDetallesPedidos: false,
      inProductos: false,
      inClientes: false,
      inCategorias: true,
      inHistorialPedidos: false,
    });
  }
  function inHistorialPedidos() {
    setAdminAsideNavBar({
      inDetallesPedidos: false,
      inProductos: false,
      inClientes: false,
      inCategorias: false,
      inHistorialPedidos: true,
    });
  }
  return (
    <aside className="w-64 max-2xl:h-[100dvh]">
      <div className="flex flex-col">
        <div className="w-auto h-auto flex justify-end 2xl:hidden max-2xl:pr-1 max-2xl:pt-1">
          <button
            onClick={() => setExitAside(!exitAside)}
            className="p-2 rounded hover:bg-[#374151] transition-colors"
          >
            {exitAside ? (
              <HamburgerIcon className="text-[#F9FAFB] cursor-pointer" />
            ) : (
              <ExitIcon className="text-[#F9FAFB] cursor-pointer" />
            )}
          </button>
        </div>
        <h2 className="text-[#F9FAFB] font-bold text-lg text-balance px-7 py-2.5">
          {admin.nombre && admin.apellido
            ? `¡Hola ${admin.nombre} ${admin.apellido}, bienvenido al modo administrador de "Kiosco"!`
            : '¡Hola, Bienvenido al modo administrador de "Kiosco"'}
        </h2>
      </div>
      <br />
      <nav className="flex flex-col space-y-2">
        <Link
          onClick={inDetallesPedidos}
          to="/admin/home/detalles-pedidos"
          className={AdminAsideNavBar.inDetallesPedidos ? inFocus : outFocus}
        >
          <BookIcon />
          Detalles de Pedidos
        </Link>
        <Link
          onClick={inProductos}
          to="/admin/home/productos"
          className={AdminAsideNavBar.inProductos ? inFocus : outFocus}
        >
          <ProductsIcon />
          Productos
        </Link>
        <Link
          onClick={inClientes}
          to="/admin/home/clientes"
          className={AdminAsideNavBar.inClientes ? inFocus : outFocus}
        >
          <Users />
          Clientes
        </Link>
        <Link
          onClick={inCategorias}
          to="/admin/home/categorias"
          className={AdminAsideNavBar.inCategorias ? inFocus : outFocus}
        >
          <Categories />
          Categorias
        </Link>
        <Link
          onClick={inHistorialPedidos}
          to="/admin/home/historial-pedidos"
          className={AdminAsideNavBar.inHistorialPedidos ? inFocus : outFocus}
        >
          <Historial />
          Historial de Pedidos
        </Link>
      </nav>
    </aside>
  );
}
