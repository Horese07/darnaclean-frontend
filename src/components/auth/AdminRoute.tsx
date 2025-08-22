import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Lock, Shield, User } from 'lucide-react';

interface AdminRouteProps {
  children: ReactNode;
  fallbackMessage?: string;
  redirectTo?: string;
  showBackButton?: boolean;
}

export function AdminRoute({ 
  children, 
  fallbackMessage = "Accès administrateur requis. Vous devez être connecté en tant qu'administrateur.",
  redirectTo = "/auth",
  showBackButton = true
}: AdminRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Lock className="w-16 h-16 text-amber-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Connexion requise
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Vous devez vous connecter pour accéder à cette page.
        </p>
        <div className="space-y-3">
          <Link to={redirectTo}>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              <User className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
          </Link>
          {showBackButton && (
            <div>
              <Link to="/" className="text-amber-600 hover:text-amber-700 text-sm">
                ← Retour à l'accueil
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Accès refusé
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {fallbackMessage}
        </p>
        <div className="space-y-3">
          <Link to="/">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              <Shield className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          {showBackButton && (
            <div>
              <Link to="/" className="text-red-600 hover:text-red-700 text-sm">
                ← Retour à l'accueil
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
