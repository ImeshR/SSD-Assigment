import React, { createContext, useState, useEffect } from "react";
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

  useEffect(() => {
    const refreshAccessToken = async () => {
      if (accessToken && refreshToken) {
        try {
          const response = await axios.post(
            "http://localhost:7070/api/auth/refresh",
            {
              refresh_token: refreshToken,
            }
          );

          const { access_token } = response.data;

          setAccessToken(access_token);
          localStorage.setItem("accessToken", access_token);

            // Decode token to get user details
            const decodedToken = jwtDecode(access_token);
            console.log(decodedToken);
            setUser({
              email: decodedToken.email,
              role: decodedToken.role,
            });
        } catch (error) {
          console.error("Token refresh failed:", error);
        }
      }
    };

    // Check and refresh token periodically
    const interval = setInterval(refreshAccessToken, 1 * 60 * 1000); // Refresh every 1 minutes

    return () => clearInterval(interval);
  }, [accessToken]); // Run effect when `accessToken` changes

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:7070/api/auth/login",
        {
          email,
          password,
        }
      );

      const { access_token , refresh_token } = response.data;

      setAccessToken(access_token); 
      setRefreshToken(refresh_token);
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      // Decode token to get user details
      const decodedToken = jwtDecode(access_token);
      console.log(decodedToken);
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
    setUser(null);

    localStorage.removeItem("accessToken");
    // No need to remove refresh token since it's managed by cookies
  };

  return (
    <UserContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
