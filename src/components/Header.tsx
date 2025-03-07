import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, FileEdit, Share, BookOpen, Menu, Church, Home, Info, Printer, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import PWAInstallPrompt from './PWAInstallPrompt';
import SyncStatus from './SyncStatus';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onShareClick?: () => void;
  showBackButton?: boolean;
  onPrintClick?: () => void;
  onPreviewClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShareClick, showBackButton = false, onPrintClick, onPreviewClick }) => {
  const location = useLocation();
  const isEditPage = location.pathname.includes('/edit');
  const isViewPage = location.pathname.includes('/view');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <header className="w-full border-b border-border bg-background bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm fixed top-0 z-10 transition-all duration-300 ease-spring">
      <div className="container flex h-16 items-center justify-between">
        {/* Área esquerda - Título e botão voltar */}
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-1" 
              onClick={() => navigate(-1)} 
              title=""
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
            </Button>
          )}
          
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-medium tracking-tight flex items-center">
              <BookOpen className="h-5 w-5 mr-2 inline-block sm:hidden" />
              <span className="hidden sm:inline">
                {isViewPage ? "Visualizar Liturgia" : isEditPage ? "Editor de Liturgia" : "Liturgia Reformada"}
              </span>
              <span className="sm:hidden">
                {isViewPage ? "" : isEditPage ? "" : "Liturgias"}
              </span>
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              {isViewPage ? "Visualize e imprima a liturgia" : isEditPage ? "Crie e edite a sua liturgia" : "Crie liturgias para cultos reformados"}
            </p>
          </div>
        </div>
        
        {/* Área central - Botões da liturgia */}
        <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2">
            {isEditPage && onPreviewClick && (
              <Button onClick={onPreviewClick} variant="outline" size="sm" className="animate-fade-in">
                <Eye className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Visualizar</span>
              </Button>
            )}
            
            {(isEditPage || isViewPage) && onShareClick && (
              <Button onClick={onShareClick} variant="outline" size="sm" className="animate-fade-in">
                <Share className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Compartilhar</span>
              </Button>
            )}
            
            {(isEditPage || isViewPage) && onPrintClick && (
              <Button onClick={onPrintClick} variant="outline" size="sm" className="animate-fade-in">
                <Printer className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Imprimir</span>
              </Button>
            )}
            
            {!isEditPage && !isViewPage && (
              <Button asChild variant="outline" size="sm" className="animate-fade-in">
                <Link to="/edit">
                  <FileEdit className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Novo</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
        
        {/* Área direita - Navegação e tema */}
        <div className="flex items-center gap-4">
          {/* Menu para desktop */}
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Início
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center">
              <Info className="mr-2 h-4 w-4" />
              Sobre
            </Link>
          </div>

          <ThemeToggle />
          
          {/* Menu hambúrguer para mobile */}
          <div className="sm:hidden">
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild onClick={() => setMenuOpen(false)}>
                  <Link to="/" className="flex items-center w-full">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Início</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild onClick={() => setMenuOpen(false)}>
                  <Link to="/about" className="flex items-center w-full">
                    <Info className="mr-2 h-4 w-4" />
                    <span>Sobre</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
