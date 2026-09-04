import {
  useEffect,
  useState,
} from "react";

import {
  getUser,
} from "../services/authService";

function useAuth() {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    getUser()
      .then((user) => {
        setUser(user);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    user,
    loading,
  };
}

export {
  useAuth,
};
