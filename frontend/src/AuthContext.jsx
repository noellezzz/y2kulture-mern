import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [user, setUser] = useState({})

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get('http://localhost:8000/auth');
        setIsAuthenticated(true);
        setUser(res.data.user)
        console.log(res.data.user)
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false); 
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(()=> {
    console.log(user)
  }, [user])

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user }}>
      {loading ? <div></div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
