
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/40">
      <div className="text-center max-w-md px-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          A página que você está procurando não foi encontrada.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          O caminho <code className="bg-muted p-1 rounded">{location.pathname}</code> não existe.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
