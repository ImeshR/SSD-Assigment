// UserContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );
  const [isLoading, setIsLoading] = useState(true);

  const refreshAccessToken = useCallback(async () => {
    if (refreshToken) {
      try {
        const response = await axios.post(
          "http://localhost:7070/api/auth/refresh",
          { refresh_token: refreshToken }
        );

        const { access_token } = response.data;
        setAccessToken(access_token);
        localStorage.setItem("accessToken", access_token);

        const decodedToken = jwtDecode(access_token);
        setUser({
          email: decodedToken.email,
          role: decodedToken.role,
        });
      } catch (error) {
        console.error("Token refresh failed:", error);
        logout();
      }
    }
    setIsLoading(false);
  }, [refreshToken]);

  useEffect(() => {
    refreshAccessToken();
    const interval = setInterval(refreshAccessToken, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshAccessToken]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:7070/api/auth/login",
        { email, password }
      );

      const { access_token, refresh_token } = response.data;

      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      const decodedToken = jwtDecode(access_token);
      setUser({
        email: decodedToken.email,
        role: decodedToken.role,
      });

      return decodedToken.role;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <UserContext.Provider
      value={{ user, accessToken, login, logout, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
