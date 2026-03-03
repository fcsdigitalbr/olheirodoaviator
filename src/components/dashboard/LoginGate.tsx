import { useState } from "react";
import { Lock, Zap } from "lucide-react";

const PASS = "FcsAutomation2626#";

interface LoginGateProps {
  children: React.ReactNode;
}

export function LoginGate({ children }: LoginGateProps) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("dash_auth") === "1"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASS) {
      sessionStorage.setItem("dash_auth", "1");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-border bg-card p-6 sm:p-8 animate-slide-up"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-widest uppercase mb-1 text-center">
            <span className="text-primary">OLHEIRO</span>
            <span className="text-muted-foreground mx-1 sm:mx-1.5 font-light">DO</span>
            <span className="text-foreground">AVIATOR</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground text-center">Digite a senha para acessar</p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          placeholder="Senha"
          className="w-full h-10 sm:h-11 px-3 rounded-md border border-border bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
          autoFocus
        />

        {error && (
          <p className="text-xs text-destructive mb-3">Senha incorreta. Tente novamente.</p>
        )}

        <button
          type="submit"
          className="w-full h-10 sm:h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
