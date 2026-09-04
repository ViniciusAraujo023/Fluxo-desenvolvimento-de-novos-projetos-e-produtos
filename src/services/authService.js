import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

async function login(email) {
  const normalizedEmail = email
    .trim()
    .toLowerCase();

  if (
    !normalizedEmail.endsWith(
      "@soprano.com.br"
    )
  ) {
    throw new Error(
      "Utilize um e-mail corporativo da Soprano."
    );
  }

  return supabase.auth.signInWithOtp({
    email: normalizedEmail,
  });
}

async function logout() {
  return supabase.auth.signOut();
}

async function getUser() {
  const {
    data,
  } = await supabase.auth.getUser();

  return data.user;
}

export {
  login,
  logout,
  getUser,
};
