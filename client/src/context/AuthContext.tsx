import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  AuthState,
  User,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie"; // Import the js-cookie library
import { jwtDecode } from "jwt-decode";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  googleCallback: () => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Define an interface for the decoded token
interface DecodedToken {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  exp: number;
  iat: number;
}

type AuthAction =
  | { type: "SET_USER"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    googleCallback();
    githubCallback();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Decode the token to extract initial user information
        const decodedToken: any = jwtDecode(token); // Adjust the type as necessary
        const userFromToken = decodedToken.user; // Ensure this matches your token structure

        // Make a request to validate the token and get the latest user info
        const response = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Use the server's user data to update state
        const user = response.data.user || userFromToken;

        dispatch({ type: "SET_USER", payload: user });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      const { token } = response.data;
      localStorage.setItem("token", token);

      // Decode the token to extract user information
      const decodedToken: any = jwtDecode(token); // Adjust the type as necessary
      const user = decodedToken.user; // Make sure your token has a 'user' property

      dispatch({ type: "SET_USER", payload: user });
      toast.success("Successfuly Logged in!", {
        style: {
          borderRadius: "5px",
          background: "#00ff0010",
          color: "#000",
          border: "1px solid #00ff0050",
        },
        iconTheme: {
          primary: "#00ff00",
          secondary: "#FFFAEE",
        },
      });
    } catch (error) {
      toast.error(error.message ? error.message : "Invalid credentials", {
        style: {
          borderRadius: "5px",
          background: "#ff000010",
          color: "#000",
          border: "1px solid #ff000050",
        },
        iconTheme: {
          primary: "#ff0000",
          secondary: "#FFFAEE",
        },
      });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await axios.post("/api/auth/register", credentials);
      const { token } = response.data;
      localStorage.setItem("token", token);

      // Decode the token to extract user information
      const decodedToken: any = jwtDecode(token); // Adjust the type as necessary
      const user = decodedToken.user; // Make sure your token has a 'user' property

      dispatch({ type: "SET_USER", payload: user });
      toast.success("Successfully registered!", {
        style: {
          borderRadius: "5px",
          background: "#00ff0010",
          color: "#000",
          border: "1px solid #00ff0050",
        },
        iconTheme: {
          primary: "#00ff00",
          secondary: "#FFFAEE",
        },
      });
    } catch (error) {
      toast.error("Registration failed");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    dispatch({ type: "LOGOUT" });
    toast.success("Successfuly Logged out", {
      style: {
        borderRadius: "5px",
        background: "#00ff0010",
        color: "#000",
        border: "1px solid #00ff0050",
      },
      iconTheme: {
        primary: "#00ff00",
        secondary: "#FFFAEE",
      },
    });
  };

  const loginWithGoogle = async () => {
    window.location.href = "/api/auth/google";
    // Add your own logic to handle the OAuth response and update the user state accordingly.
  };

  // Import the js-cookie library
  // Assuming you are using redux

  const googleCallback = async () => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("No token found in cookies.");
      }

      localStorage.setItem("token", token);

      const decodedToken: DecodedToken = jwtDecode(token); // Adjust the type as necessary
      const user = decodedToken.user; // Ensure 'user' is inside the token

      dispatch({ type: "SET_USER", payload: user });

      // toast.success("Successfully logged in with Google!", {
      //   style: {
      //     borderRadius: "5px",
      //     background: "#00ff0010",
      //     color: "#000",
      //     border: "1px solid #00ff0050",
      //   },
      //   iconTheme: {
      //     primary: "#00ff00",
      //     secondary: "#FFFAEE",
      //   },
      // });
    } catch (error) {
      // Show error toast notification
      console.error(error);
    }
  };

  const githubCallback = async () => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("No token found in cookies.");
      }

      localStorage.setItem("token", token);

      const decodedToken: DecodedToken = jwtDecode(token); // Adjust the type as necessary
      const user = decodedToken.user; // Ensure 'user' is inside the token

      dispatch({ type: "SET_USER", payload: user });

      // toast.success("Successfully logged in with GitHub!", {
      //   style: {
      //     borderRadius: "5px",
      //     background: "#00ff0010",
      //     color: "#000",
      //     border: "1px solid #00ff0050",
      //   },
      //   iconTheme: {
      //     primary: "#00ff00",
      //     secondary: "#FFFAEE",
      //   },
      // });
    } catch (error) {
      // Show error toast notification
      console.error(error);
    }
  };

  const loginWithGithub = async () => {
    window.location.href = "/api/auth/github";
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        googleCallback,
        loginWithGoogle,
        loginWithGithub,
      }}
    >
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
