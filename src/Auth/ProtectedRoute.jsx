import { LoginPage } from "./LoginPage";


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

  return children;
}

export { ProtectedRoute };
