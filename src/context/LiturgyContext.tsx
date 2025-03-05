import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { generateUniqueId } from '../utils/liturgyUtils';
import { saveLiturgyToFirebase, getLiturgyFromFirebase } from '@/services/liturgyService';
import { toast } from '@/components/ui/use-toast';

export type SectionType = {
  id: string;
  type: string;
  title: string;
  bibleReading?: string;
  prayer?: string;
  songs?: string;
  sermon?: {
    text: string;
    theme: string;
    responseHymn?: string;
  };
  enabled: boolean;
};

export type LiturgyType = {
  id: string;
  preacher: string;
  liturgist: string;
  date: string;
  sections: SectionType[];
  shared?: boolean;
};

interface LiturgyContextType {
  liturgy: LiturgyType;
  updateLiturgy: (updatedLiturgy: Partial<LiturgyType>) => void;
  updateSection: (sectionId: string, updatedSection: Partial<SectionType>) => void;
  toggleSection: (sectionId: string) => void;
  resetLiturgy: () => void;
  generateShareableLink: () => Promise<string>;
  reorderSections: (sourceId: string, targetId: string) => void;
  getSavedLiturgies: () => LiturgyType[];
  saveLiturgy: () => void;
  loadLiturgyById: (id: string) => Promise<LiturgyType | null>;
  isLoading: boolean;
}

const defaultSections: SectionType[] = [
  { id: '1', type: 'worshipCall', title: '1. Chamada a Adoração', enabled: true },
  { id: '2', type: 'lawReading', title: '2. Leitura da Lei', enabled: true },
  { id: '3', type: 'forgiveness', title: '3. Anúncio do Perdão', enabled: true },
  { id: '4', type: 'intercession', title: '4. Intercessão e Ações de Graça', enabled: true },
  { id: '5', type: 'illumination', title: '5. Iluminação', enabled: true },
  { id: '6', type: 'wordPreaching', title: '6. Pregação da Palavra', enabled: true },
  { id: '7', type: 'lordsSupper', title: '7. Ceia do Senhor', enabled: false },
  { id: '8', type: 'consecration', title: '8. Consagração', enabled: true },
  { id: '9', type: 'sending', title: '9. Envio', enabled: true },
  { id: '10', type: 'blessing', title: '10. Benção', enabled: true },
];

const defaultLiturgy: LiturgyType = {
  id: generateUniqueId(),
  preacher: '',
  liturgist: '',
  date: new Date().toISOString().split('T')[0],
  sections: defaultSections,
};

const LiturgyContext = createContext<LiturgyContextType | undefined>(undefined);

export const LiturgyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [liturgy, setLiturgy] = useState<LiturgyType>(() => {
    // Try to load from localStorage
    const savedLiturgy = localStorage.getItem('currentLiturgy');
    return savedLiturgy ? JSON.parse(savedLiturgy) : defaultLiturgy;
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateLiturgy = (updatedLiturgy: Partial<LiturgyType>) => {
    setLiturgy(prev => {
      const newLiturgy = { ...prev, ...updatedLiturgy };
      localStorage.setItem('currentLiturgy', JSON.stringify(newLiturgy));
      return newLiturgy;
    });
  };

  const updateSection = (sectionId: string, updatedSection: Partial<SectionType>) => {
    setLiturgy(prev => {
      const updatedSections = prev.sections.map(section => 
        section.id === sectionId ? { ...section, ...updatedSection } : section
      );
      
      const newLiturgy = { ...prev, sections: updatedSections };
      localStorage.setItem('currentLiturgy', JSON.stringify(newLiturgy));
      return newLiturgy;
    });
  };

  const toggleSection = (sectionId: string) => {
    setLiturgy(prev => {
      const updatedSections = prev.sections.map(section => 
        section.id === sectionId ? { ...section, enabled: !section.enabled } : section
      );
      
      const newLiturgy = { ...prev, sections: updatedSections };
      localStorage.setItem('currentLiturgy', JSON.stringify(newLiturgy));
      return newLiturgy;
    });
  };

  const reorderSections = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    
    setLiturgy(prev => {
      const sections = [...prev.sections];
      const sourceIndex = sections.findIndex(section => section.id === sourceId);
      const targetIndex = sections.findIndex(section => section.id === targetId);
      
      if (sourceIndex === -1 || targetIndex === -1) return prev;
      
      const [movedSection] = sections.splice(sourceIndex, 1);
      sections.splice(targetIndex, 0, movedSection);
      
      // Update the titles to reflect the new order
      const updatedSections = sections.map((section, index) => ({
        ...section,
        title: section.title.replace(/^\d+\./, `${index + 1}.`)
      }));
      
      const newLiturgy = { ...prev, sections: updatedSections };
      localStorage.setItem('currentLiturgy', JSON.stringify(newLiturgy));
      return newLiturgy;
    });
  };

  const resetLiturgy = () => {
    const newLiturgy = {
      ...defaultLiturgy,
      id: generateUniqueId(),
      date: new Date().toISOString().split('T')[0],
    };
    setLiturgy(newLiturgy);
    localStorage.setItem('currentLiturgy', JSON.stringify(newLiturgy));
  };

  const generateShareableLink = async () => {
    setIsLoading(true);
    try {
      // Marcar a liturgia como compartilhada
      const sharedLiturgy = { ...liturgy, shared: true };
      setLiturgy(sharedLiturgy);
      
      // Salvar no Firebase
      const success = await saveLiturgyToFirebase(sharedLiturgy);
      
      if (success) {
        toast({
          title: "Liturgia compartilhada",
          description: "A liturgia foi salva na nuvem e está pronta para ser compartilhada.",
        });
      }
      
      return `${window.location.origin}/#/view/${liturgy.id}`;
    } catch (error) {
      console.error("Error generating shareable link:", error);
      toast({
        title: "Erro ao compartilhar",
        description: "Ocorreu um erro ao salvar a liturgia para compartilhamento.",
        variant: "destructive"
      });
      return `${window.location.origin}/#/view/${liturgy.id}`;
    } finally {
      setIsLoading(false);
    }
  };

  const getSavedLiturgies = useCallback(() => {
    const savedLiturgies = JSON.parse(localStorage.getItem('savedLiturgies') || '{}');
    return Object.values(savedLiturgies) as LiturgyType[];
  }, []);

  const saveLiturgy = useCallback(() => {
    if (!liturgy.preacher && !liturgy.liturgist) return; // Não salvar liturgias vazias
    
    const savedLiturgies = JSON.parse(localStorage.getItem('savedLiturgies') || '{}');
    savedLiturgies[liturgy.id] = liturgy;
    localStorage.setItem('savedLiturgies', JSON.stringify(savedLiturgies));
  }, [liturgy]);

  const loadLiturgyById = async (id: string): Promise<LiturgyType | null> => {
    setIsLoading(true);
    try {
      const loadedLiturgy = await getLiturgyFromFirebase(id);
      if (loadedLiturgy) {
        return loadedLiturgy;
      }
      return null;
    } catch (error) {
      console.error("Error loading liturgy:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LiturgyContext.Provider value={{ 
      liturgy, 
      updateLiturgy, 
      updateSection, 
      toggleSection, 
      resetLiturgy,
      generateShareableLink,
      reorderSections,
      getSavedLiturgies,
      saveLiturgy,
      loadLiturgyById,
      isLoading
    }}>
      {children}
    </LiturgyContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLiturgy = () => {
  const context = useContext(LiturgyContext);
  if (context === undefined) {
    throw new Error('useLiturgy must be used within a LiturgyProvider');
  }
  return context;
};
