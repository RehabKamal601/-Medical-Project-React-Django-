import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // في الحالة الحقيقية، هنا سنقوم بالتحقق من الـ token المخزن
    // وجلب بيانات المستخدم من الخادم
    const checkAuth = async () => {
      try {
        // مؤقتاً: نستخدم بيانات تجريبية
        const mockUser = {
          id: "d1", // معرف الدكتور
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

  const login = async (credentials) => {
    try {
      // في الحالة الحقيقية: اتصال بالـ API للمصادقة
      const mockUser = {
        id: "d1",
        name: "د. أحمد محمد",
        role: "doctor",
        speciality: "أمراض باطنة",
        email: credentials.email
      };
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'فشل تسجيل الدخول' };
    }
  };

  const logout = () => {
    // في الحالة الحقيقية: إزالة الـ token وتنظيف البيانات
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout
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

export default useAuth; 