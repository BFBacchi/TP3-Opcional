import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../config/firebase'; // Ajusta la ruta si es necesario
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const value = {
    currentUser,
    loadingAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {!loadingAuth && children} { /* Render children only when auth state is determined */ }
    </AuthContext.Provider>
  );
}; 