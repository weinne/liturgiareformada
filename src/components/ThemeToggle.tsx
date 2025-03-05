
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { toast } from '@/components/ui/use-toast';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  const handleToggle = () => {
    toggleTheme();
    toast({
      title: theme === 'light' ? "Modo escuro ativado" : "Modo claro ativado",
      description: theme === 'light' 
        ? "Sua interface agora está no tema escuro." 
        : "Sua interface agora está no tema claro.",
      duration: 2000,
    });
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleToggle}
      className="rounded-full w-9 h-9"
      aria-label={theme === 'light' ? 'Alternar para modo escuro' : 'Alternar para modo claro'}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-foreground" />
      )}
    </Button>
  );
};

export default ThemeToggle;
