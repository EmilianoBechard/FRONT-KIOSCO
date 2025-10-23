import { createContext, useState } from "react";

export const AdminLoginContext = createContext();

export const AdminLoginProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <AdminLoginContext.Provider value={{ isAdminLoggedIn, setIsAdminLoggedIn }}>
      {children}
    </AdminLoginContext.Provider>
  );
};
