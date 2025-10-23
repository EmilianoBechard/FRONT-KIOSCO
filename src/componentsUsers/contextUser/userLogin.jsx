import { createContext, useState } from "react";

export const UserLoginContext = createContext();

export const UserLoginProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  return (
    <UserLoginContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn }}>
      {children}
    </UserLoginContext.Provider>
  );
};
