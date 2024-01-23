import React, { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

   const [auth, setAuth] = useState(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      return { user, token, isLoggedin: !!user };
   });

   const contextValue = { auth, setAuth };

   return (
      <AuthContext.Provider value={contextValue}>
         {children}
      </AuthContext.Provider>
    );
    
};

export default AuthContext;
