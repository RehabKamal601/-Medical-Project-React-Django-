// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const mockUser = {
          id: "d1",
          name: "د. أحمد محمد",
          role: "doctor",
          speciality: "أمراض باطنة",
          email: "ahmed.mohamed@example.com"
        };
        setUser(mockUser);
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
      // أرسل email و password بدلاً من username
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
        // إذا كان هناك خطأ في حقل معين مثل email أو password، أظهر أول رسالة واضحة
        let errorMsg = data.detail || JSON.stringify(data) || 'فشل تسجيل الدخول';
        if (data.email && Array.isArray(data.email)) {
          errorMsg = data.email[0];
        }
        if (data.password && Array.isArray(data.password)) {
          errorMsg = data.password[0];
        }
        console.error('Login error details:', data);
        return { success: false, error: errorMsg };
      }
      if (response.ok) {
        setUser({
          email: email,
          access: data.access,
          refresh: data.refresh,
        });
        return { success: true, ...data };
      } else {
        return { success: false, error: data.detail || JSON.stringify(data) || 'فشل تسجيل الدخول' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'فشل تسجيل الدخول' };
    }
  };
  const registerUser = async (userData) => {
  try {
    const { name, ...userDataToSend } = userData;
    console.log("Sending registration data:", userDataToSend);
    const response = await fetch('http://localhost:8000/api/accounts/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDataToSend),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      return { success: false, message: "Invalid server response" };
    }

    const data = await response.json();
    if (!response.ok) {
      // إذا كان هناك خطأ في حقل معين مثل username أو password، أظهر أول رسالة واضحة
      let errorMsg = data.detail || JSON.stringify(data) || "Registration failed.";
      if (data.username && Array.isArray(data.username)) {
        errorMsg = data.username[0];
      }
      if (data.password && Array.isArray(data.password)) {
        errorMsg = data.password[0];
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

  const logout = () => {
    setUser(null);
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
