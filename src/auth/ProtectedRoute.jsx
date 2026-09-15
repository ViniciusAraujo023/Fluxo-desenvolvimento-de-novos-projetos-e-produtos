import { LoginPage } from "./LoginPage";
import { VerifyAccess } from "./VerifyAccess";
import { CompleteProfile } from "./CompleteProfile";

function ProtectedRoute({ user, appUser, loading, onProfileComplete, children, }) 
{
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (appUser && !appUser.aprovado) {
    return <VerifyAccess />;
  }

  if (appUser && appUser.ativo === false) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-xl font-semibold mb-2">Acesso desativado</h1>
          <p className="text-slate-500">
            Seu acesso foi desativado por um administrador. Entre em contato caso isso seja um engano.
          </p>
        </div>
      </div>
    );
  }

  if (appUser && appUser.primeiro_acesso) {
    return (
      <CompleteProfile
        appUser={appUser}
        onDone={onProfileComplete}
      />
    );
  }

  return children;
}

export { ProtectedRoute };
