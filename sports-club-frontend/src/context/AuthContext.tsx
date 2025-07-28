import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:5000/api";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "member";
  membershipStatus: "active" | "inactive" | "pending";
  profilePicture?: string;
  phone?: string;
  dateJoined: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing token and validate user session
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(`${API_URL}/auth/profile`);
          const userData = response.data.data;

          // Assuming backend returns firstName and lastName
          setUser({
            id: userData.id,
            email: userData.email,
            firstName: userData.name.split(" ")[0], // Assuming 'name' can be split to get firstName
            lastName: userData.name.split(" ").slice(1).join(" ") || "", // Assuming 'name' can be split to get lastName
            role: userData.role,
            membershipStatus: userData.membershipStatus || "inactive",
            dateJoined:
              userData.createdAt || new Date().toISOString().split("T")[0], // Use createdAt if available
          });
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token, user: userData } = response.data.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser({
        id: userData.id,
        email: userData.email,
        firstName: userData.name.split(" ")[0],
        lastName: userData.name.split(" ").slice(1).join(" ") || "",
        role: userData.role,
        membershipStatus: userData.membershipStatus || "inactive",
        dateJoined:
          userData.createdAt || new Date().toISOString().split("T")[0],
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: `${userData.firstName} ${userData.lastName}`, // Combine firstName and lastName for 'name' field
        email: userData.email,
        password: userData.password,
        role: "member", // Default to member role
      });

      // After successful registration, automatically log in the user
      // or redirect to login. For simplicity, we'll try to log in immediately.
      await login(userData.email, userData.password); // Reuse login function

      // Alternatively, you could just show a success message and not auto-login:
      // setUser(null); // No user directly set on register unless auto-logged in
      // localStorage.removeItem('token');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"]; // Clear token from axios headers
    setUser(null);
    setError(null);
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found for profile update.");
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.put(`${API_URL}/auth/profile`, userData);
      const updatedUser = response.data.data;

      setUser({
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.name.split(" ")[0],
        lastName: updatedUser.name.split(" ").slice(1).join(" ") || "",
        role: updatedUser.role,
        membershipStatus: updatedUser.membershipStatus || "inactive",
        profilePicture: updatedUser.profilePicture,
        phone: updatedUser.phone,
        dateJoined:
          updatedUser.createdAt || new Date().toISOString().split("T")[0],
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message ||
        "Profile update failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
