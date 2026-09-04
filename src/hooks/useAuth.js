import { useEffect, useState } from "react";
import { getUser, logout } from "../services/authService";

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser()
      .then((user) => setUser(user))
      .finally(() => setLoading(false));
  }, []);

  const signOut = async () => {
    await logout();
    setUser(null);
  };

  return { user, loading, signOut };
}

export { useAuth };
