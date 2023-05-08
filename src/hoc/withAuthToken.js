import React, { useEffect, useRef, useState } from "react";

import Loader from "../components/Loader";
import { localStorageKeys } from "../utils/constants";
import { useAuthContext } from "../context/auth";
import { useAuthService } from "../services/auth.service";
import withLoader from "./withLoader";

const withAuthToken = (WrappedComponent) => {
  return function WithAuthTokenComponent() {
    const authContext = useAuthContext();
    const authService = useAuthService();
    const [loading, setLoading] = useState(false);
    const interval = useRef();

    const WrappedComponentWithLoading = withLoader(WrappedComponent, Loader);

    useEffect(() => {
      const token = getToken();
      if (token) {
        authContext.setToken(token);
      } else {
        fetchToken();
      }
    }, [localStorage.getItem(localStorageKeys.TOKEN)]);

    useEffect(() => {
      refreshToken();

      return () => {
        if (interval.current) {
          clearInterval(interval);
        }
      };
    }, []);

    const refreshToken = () => {
      interval.current = setInterval(async () => {
        const itemStr = localStorage.getItem(localStorageKeys.TOKEN);

        const now = new Date();
        if (itemStr && now.getTime() < JSON.parse(itemStr).expiry) return;

        fetchToken();
      }, [1000]);
    };

    const fetchToken = async () => {
      try {
        setLoading(true);
        const res = await authService.getToken();
        authContext.setToken(res.access_token);
        const item = {
          token: res.access_token,
          expiry: new Date().getTime() + res.expires_in * 1000,
        };
        localStorage.setItem(localStorageKeys.TOKEN, JSON.stringify(item));
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const getToken = () => {
      const itemStr = localStorage.getItem(localStorageKeys.TOKEN);
      // if the item doesn't exist, return null
      if (!itemStr) {
        return "";
      }

      const item = JSON.parse(itemStr);
      const now = new Date();

      if (now.getTime() > item.expiry) {
        return "";
      }
      return item.token;
    };

    return <WrappedComponentWithLoading loading={loading || !authContext.token} />;
  };
};

export default withAuthToken;
