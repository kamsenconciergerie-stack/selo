import { useEffect, useState } from "react";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Simple admin check - in a real app this would be more secure
    const username = sessionStorage.getItem("adminUsername");
    const password = sessionStorage.getItem("adminPassword");
    
    if (username === "admin" && password === "aywadmin2025") {
      setIsAuthenticated(true);
    } else {
      // Redirect to simple login if not authenticated
      window.location.href = "/admin";
    }
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  return <>{children}</>;
}