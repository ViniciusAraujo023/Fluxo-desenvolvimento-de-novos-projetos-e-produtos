import { LoginPage } from "./LoginPage";
import { VerifyAccess } from "./VerifyAccess";

function ProtectedRoute({ user, loading, children }) {
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
  
  return children;
}

export { ProtectedRoute };
