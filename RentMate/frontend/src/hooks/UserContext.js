import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { auth, provider, signInWithPopup } from "../firebase";

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
          id: decodedToken.id,
          email: decodedToken.email,
          name: decodedToken.name,
          role: decodedToken.type,
          profileImage: decodedToken.profilePicture,
        });
      } catch (error) {
        console.error("Token refresh failed:", error);
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
    setIsLoading(false);
  }, [refreshToken]);

  useEffect(() => {
    refreshAccessToken();
    const interval = setInterval(refreshAccessToken, 1 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshAccessToken]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:7070/api/auth/login",
        { email, password }
      );

      const { access_token, refresh_token, user } = response.data;

      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      setUser({
        id: user.id,
        email: user.email,
        name: user.username,
        role: user.type,
        profileImage: user.profilePicture,
      });

      return user.type;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await axios.post(
        "http://localhost:7070/api/auth/google-login",
        { idToken }
      );

      const { access_token, refresh_token, user: userData } = response.data;

      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.username,
        role: userData.type,
        profileImage: userData.profilePicture,
      });

      return userData.type;
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await axios.post("http://localhost:7070/api/auth/logout", {
          refresh_token: refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        accessToken,
        login,
        loginWithGoogle,
        logout,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
