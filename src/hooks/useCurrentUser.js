import { useState, useEffect } from "react";

import {
  USERS,
} from "../data/users";

import {
  loadCurrentUserId,
  saveCurrentUserId,
} from "../services/supabase";


///
export function useCurrentUser() {
  const [currentUserId, setCurrentUserId] =
    useState(null);

  useEffect(() => {
    loadCurrentUserId().then((id) =>
      setCurrentUserId(id)
    );
  }, []);

  const currentUser =
    USERS.find(
      (u) => u.id === currentUserId
    ) || USERS[0];

  const changeUser = (id) => {
    setCurrentUserId(id);
    saveCurrentUserId(id);
  };

  return {
    currentUserId,
    currentUser,
    changeUser,
  };
}

