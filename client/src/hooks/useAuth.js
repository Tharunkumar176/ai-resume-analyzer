import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser } from '../services/authService';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return { user, loading, isAuthenticated: isAuthenticated() };
};

export default useAuth;
