import { useState } from "react";
import { updateUser } from "../services/userService";

function CompleteProfile({ appUser, onDone }) {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nome.trim()) return;

    setLoading(true);

    const updated = await updateUser(appUser.id, {
      nome: nome.trim(),
      primeiro_acesso: false,
    });

    setLoading(false);
    onDone(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2">
          Como podemos te chamar?
        </h1>

        <p className="text-sm text-slate-500 mb-6">
          Só isso, pra deixar seu perfil completo.
        </p>

        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />

        <button
          onClick={handleSave}
          disabled={loading || !nome.trim()}
          className="mt-4 w-full rounded-md bg-sky-800 py-2 text-white"
        >
          {loading ? "Salvando..." : "Continuar"}
        </button>
      </div>
    </div>
  );
}

export { CompleteProfile };
