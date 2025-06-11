// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser({
              ...parsedUser,
              access: token,
              refresh: localStorage.getItem('refresh_token'),
            });
          } catch (e) {
            console.error('Failed to parse user data:', e);
            // If user data is invalid, clear storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_data');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginUser = async (credentials) => {
    try {
      const { email, password } = credentials;
      const response = await fetch('http://localhost:8000/api/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        let errorMsg = data.detail || JSON.stringify(data) || 'فشل تسجيل الدخول';
        if (data.email && Array.isArray(data.email)) {
          errorMsg = data.email[0];
        }
        if (data.password && Array.isArray(data.password)) {
          errorMsg = data.password[0];
        }
        console.error('Login error details:', data);
        return { success: false, message: errorMsg };
      }

      // After successful login, fetch user details
      const userResponse = await fetch('http://localhost:8000/api/accounts/user/', {
        headers: {
          'Authorization': `Bearer ${data.access}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        // Store tokens and user data
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        setUser({
          ...userData,
          access: data.access,
          refresh: data.refresh,
        });
        return { success: true, role: userData.role };
      } else {
        return { success: false, message: 'Failed to fetch user details' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'فشل تسجيل الدخول' };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const registerUser = async (userData) => {
    try {
      console.log("Sending registration data:", userData);
      const response = await fetch('http://localhost:8000/api/accounts/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        return { success: false, message: "Invalid server response" };
      }

      const data = await response.json();
      if (!response.ok) {
        let errorMsg = data.detail || JSON.stringify(data) || "Registration failed.";
        if (data.username && Array.isArray(data.username)) {
          errorMsg = data.username[0];
        }
        if (data.password && Array.isArray(data.password)) {
          errorMsg = data.password[0];
        }
        if (data.email && Array.isArray(data.email)) {
          errorMsg = data.email[0];
        }
        console.error("Registration error details:", data);
        return { success: false, message: errorMsg };
      }
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "An error occurred during registration." };
    }
  };

  const value = {
    user,
    loading,
    loginUser,
    logout,
    registerUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
