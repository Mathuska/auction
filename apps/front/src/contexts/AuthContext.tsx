import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

enum UserRole {
  ADMIN = "admin",
  CLIENT = "client",
  EMPLOYEE = "employee",
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  role: UserRole;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    await axiosInstance
      .post("/auth/login", {
        email,
        password,
      })
      .then((res) => {
        console.log(res);
        
        setUser(res.data.user);
        localStorage.setItem("authToken", res.data.tokens.accessToken);
        // navigate("/dashboard");
      });
  };

  const register = async (data: RegisterData) => {
    const response = await axiosInstance.post("/auth/register", data);
    setUser(response.data.user);
    localStorage.setItem("authToken", response.data.tokens.accessToken);
    navigate("/dashboard");
  };

  return (
    <AuthContext.Provider value={{ user, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { UserRole };
