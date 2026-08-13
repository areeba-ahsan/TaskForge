import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // app load hote waqt check karega login hai ya nahi

  // App load hote waqt check karo — kya localStorage mein token hai?
  // Agar hai, verify karo backend se ke wo abhi bhi valid hai
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('taskforge_token');
      if (token) {
        try {
          const response = await getCurrentUser();
          setUser(response.data.data);
        } catch (error) {
          // Token invalid/expired — clean up karo
          localStorage.removeItem('taskforge_token');
          localStorage.removeItem('taskforge_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    const { user: userData, token } = response.data.data;

    localStorage.setItem('taskforge_token', token);
    localStorage.setItem('taskforge_user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  // Register function
  const register = async (name, email, password, role) => {
    const response = await registerUser({ name, email, password, role });
    const { user: userData, token } = response.data.data;

    localStorage.setItem('taskforge_token', token);
    localStorage.setItem('taskforge_user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('taskforge_token');
    localStorage.removeItem('taskforge_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};