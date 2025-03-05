import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, FileEdit, Share, BookOpen, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { useLiturgy } from '@/context/LiturgyContext';

interface HeaderProps {
  onShareClick?: () => void;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onShareClick, showBackButton = false }) => {
  const location = useLocation();
  const isEditPage = location.pathname.includes('/edit');
  const isViewPage = location.pathname.includes('/view');
  const { getEditedLiturgies } = useLiturgy();
  const editedLiturgies = getEditedLiturgies();
  
  return (
    <header className="w-full border-b border-border bg-background bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm fixed top-0 z-10 transition-all duration-300 ease-spring">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link to="/">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar
              </Link>
            </Button>
          )}
          
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-medium tracking-tight flex items-center">
              <BookOpen className="h-5 w-5 mr-2 inline-block sm:hidden" />
              <span className="hidden sm:inline">
                {isViewPage ? "Visualizar Liturgia" : isEditPage ? "Editor de Liturgia" : "Editor de Liturgias Reformadas"}
              </span>
              <span className="sm:hidden">
                {isViewPage ? "Visualizar" : isEditPage ? "Editor" : "Liturgias"}
              </span>
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              {isViewPage ? "Visualize e imprima a liturgia" : isEditPage ? "Crie e edite a sua liturgia" : "Crie liturgias para cultos reformados"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {(isEditPage || isViewPage) && onShareClick && (
            <Button onClick={onShareClick} variant="outline" size="sm" className="animate-fade-in">
              <Share className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
          )}
          
          {!isEditPage && !isViewPage && (
            <Button asChild variant="default" size="sm" className="animate-fade-in">
              <Link to="/edit">
                <FileEdit className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Novo</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
      {editedLiturgies.length > 0 && (
        <div className="container mt-4">
          <h2 className="text-lg font-bold tracking-tight mb-2">Histórico de Liturgias Editadas</h2>
          <div className="space-y-2">
            {editedLiturgies.map((editedLiturgy) => (
              <div key={editedLiturgy.id} className="transition-all duration-300 hover:shadow-md animate-slide-up opacity-90 hover:opacity-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{editedLiturgy.date}</p>
                    <p className="font-medium">{editedLiturgy.preacher || "Não especificado"}</p>
                  </div>
                  <Button 
                    asChild 
                    className="gap-1"
                  >
                    <Link to={`/view/${editedLiturgy.id}`}>
                      Ver liturgia
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
