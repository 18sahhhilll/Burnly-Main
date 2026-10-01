import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('burnly_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Attempt refresh token exchange if access token is invalid/expired
  const tryRefreshToken = async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('burnly_token', data.token);
        setToken(data.token);
        return data.token;
      }
    } catch (err) {
      console.error('Refresh token exchange failed:', err);
    }
    return null;
  };

  useEffect(() => {
    const bootstrapUser = async () => {
      let currentToken = token;

      if (!currentToken) {
        currentToken = await tryRefreshToken();
      }

      if (!currentToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
          credentials: 'include',
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else if (res.status === 401) {
          // Access token expired, attempt refresh
          const refreshedToken = await tryRefreshToken();
          if (refreshedToken) {
            const retryRes = await fetch('/api/auth/me', {
              headers: { Authorization: `Bearer ${refreshedToken}` },
              credentials: 'include',
            });
            if (retryRes.ok) {
              const userData = await retryRes.json();
              setUser(userData);
            }
          } else {
            localStorage.removeItem('burnly_token');
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Failed to authenticate token:', err);
      } finally {
        setLoading(false);
      }
    };

    bootstrapUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('burnly_token', data.token);
    setToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const register = async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    localStorage.setItem('burnly_token', data.token);
    setToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Error during logout:', err);
    }
    localStorage.removeItem('burnly_token');
    setToken(null);
    setUser(null);
  };

  const deleteAccount = async () => {
    if (!token) return;
    const res = await fetch('/api/auth/me', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to delete account');
    }
    localStorage.removeItem('burnly_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
