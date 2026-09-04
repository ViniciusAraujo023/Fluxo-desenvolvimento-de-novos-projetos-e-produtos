import { useState } from "react";
import { login } from "../../services/authService";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);

      await login(email);

      setMessage(
        "Verifique seu e-mail corporativo para continuar."
      );
    } catch (err) {
      setMessage(
        err.message || "Erro ao enviar acesso."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">

        <h1 className="text-2xl font-semibold mb-2">
          Entrar
        </h1>

        <p className="text-sm text-slate-500 mb-6">
          Utilize seu e-mail corporativo da Soprano.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nome@soprano.com.br"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-4 w-full rounded-md bg-sky-800 py-2 text-white"
        >
          {loading ? "Enviando..." : "Entrar"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-slate-600">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export {
  LoginPage,
};

