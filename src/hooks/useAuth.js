import { useEffect, useState, } from "react";
import { getUser, logout, } from "../services/authService";
import { getUserByEmail, createUser, } from "../services/userService";

function useAuth() {
  const [user, setUser] = useState(null);

  const [appUser, setAppUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const authUser =
          await getUser();

        setUser(authUser);

        if (!authUser?.email) {
          return;
        }

        let dbUser =
          await getUserByEmail(
            authUser.email
          );

        if (!dbUser) {
          dbUser =
            await createUser({
              email: authUser.email,
              nome:
                authUser.email,
            });
        }

        setAppUser(dbUser);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const signOut = async () => {
    await logout();

    setUser(null);
    setAppUser(null);
  };

  return { user, appUser, loading, signOut, setAppUser, };
}

export { useAuth, };
