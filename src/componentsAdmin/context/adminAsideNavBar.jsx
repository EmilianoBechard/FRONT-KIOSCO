import { createContext, useState } from "react";

export const AdminAsideNavBarContext = createContext();

export const AdminAsideNavBarProvider = ({ children }) => {
  const [AdminAsideNavBar, setAdminAsideNavBar] = useState({
    inDetallesPedidos: true,
    inProductos: false,
    inClientes: false,
    inCategorias: false,
    inHistorialPedidos: false,
  });

  return (
    <AdminAsideNavBarContext.Provider
      value={{ AdminAsideNavBar, setAdminAsideNavBar }}
    >
      {children}
    </AdminAsideNavBarContext.Provider>
  );
};
