import { useEffect, useState } from "react";
import React from "react";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Simple admin check - in a real app this would be more secure
    const username = sessionStorage.getItem("adminUsername");
    const password = sessionStorage.getItem("adminPassword");
    
    if (username === "admin" && password === "kamsenadmin2025") {
      setIsAuthenticated(true);
    } else {
      // Show login form inline
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show login form
  return (
    <div className="min-h-screen bg-kamsen-blue-light flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-kamsen-blue mb-2">Administration Kamsen</h1>
          <p className="text-kamsen-gray">Connectez-vous pour accéder au tableau de bord</p>
        </div>
        
        <AdminLoginForm onSuccess={() => setIsAuthenticated(true)} />
      </div>
    </div>
  );
}

function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "admin" && password === "kamsenadmin2025") {
      sessionStorage.setItem("adminUsername", username);
      sessionStorage.setItem("adminPassword", password);
      setError("");
      onSuccess();
    } else {
      setError("Nom d'utilisateur ou mot de passe incorrect");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-kamsen-blue mb-2">
          Nom d'utilisateur
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-kamsen rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-kamsen-blue mb-2">
          Mot de passe
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-kamsen rounded-md focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
          required
        />
      </div>
      
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      
      <button
        type="submit"
        className="w-full bg-kamsen-blue hover:bg-kamsen-blue/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Se connecter
      </button>
    </form>
  );
}