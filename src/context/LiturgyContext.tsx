import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { generateUniqueId } from '../utils/liturgyUtils';
import { saveLiturgyToFirebase, getLiturgyFromFirebase } from '@/services/liturgyService';
import { toast } from '@/components/ui/use-toast';

// Status de sincronização
export type SyncStatus = 'synced' | 'syncing' | 'pending' | 'error';

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
  saveLiturgy: (showNotification?: boolean) => Promise<boolean>;
  loadLiturgyById: (id: string) => Promise<LiturgyType | null>;
  isLoading: boolean;
  syncStatus: SyncStatus;
  forceSyncToCloud: (showNotification?: boolean) => Promise<boolean>;
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
    const savedLiturgy = localStorage.getItem('currentLiturgy');
    return savedLiturgy ? JSON.parse(savedLiturgy) : defaultLiturgy;
  });
  const [isLoading, setIsLoading] = useState(false);
  // Começamos com 'pending' se houver uma liturgia salva
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => {
    const savedLiturgy = localStorage.getItem('currentLiturgy');
    return savedLiturgy ? 'pending' : 'synced';
  });
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSyncRef = useRef<boolean>(false);

  // Função para verificar a conexão com a internet
  const isOnline = () => {
    return navigator.onLine;
  };

  // Força sincronização imediata
  const forceSyncToCloud = useCallback(async (showNotification = true): Promise<boolean> => {
    // Se não há dados para salvar, retorna sucesso
    if (!liturgy.preacher && !liturgy.liturgist && !liturgy.sections.some(s => 
      s.bibleReading || s.prayer || s.songs || 
      (s.sermon && (s.sermon.text || s.sermon.theme))
    )) {
      setSyncStatus('synced');
      return true;
    }

    if (!isOnline()) {
      setSyncStatus('error');
      if (showNotification) {
        toast({
          title: "Sem conexão",
          description: "Você está offline. A sincronização ocorrerá automaticamente quando houver conexão.",
          variant: "destructive"
        });
      }
      return false;
    }

    try {
      setSyncStatus('syncing');
      await saveLiturgyToFirebase(liturgy);
      setSyncStatus('synced');
      pendingSyncRef.current = false;
      
      if (showNotification) {
        toast({
          title: "Sincronizado",
          description: "Liturgia salva com sucesso na nuvem."
        });
      }
      return true;
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      setSyncStatus('error');
      
      if (showNotification) {
        toast({
          title: "Erro na sincronização",
          description: "Não foi possível salvar na nuvem. Tentaremos novamente mais tarde.",
          variant: "destructive"
        });
      }
      return false;
    }
  }, [liturgy]);

  // Função para salvar na nuvem com debounce
  const debouncedSaveToCloud = useCallback(() => {
    // Limpa o timeout anterior se houver
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Marca que há uma sincronização pendente
    pendingSyncRef.current = true;
    setSyncStatus('pending');
    
    // Configura um novo timeout
    syncTimeoutRef.current = setTimeout(() => {
      forceSyncToCloud(false);
    }, 2000); // 2 segundos de debounce
  }, [forceSyncToCloud]);

  // Monitorar mudanças de conexão e status
  useEffect(() => {
    const handleOnline = () => {
      if (pendingSyncRef.current || syncStatus === 'error') {
        debouncedSaveToCloud();
      }
    };

    const handleOffline = () => {
      if (syncStatus === 'syncing' || syncStatus === 'pending') {
        setSyncStatus('error');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Tentar sincronizar ao montar se houver dados pendentes
    if (pendingSyncRef.current || syncStatus === 'pending') {
      debouncedSaveToCloud();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [debouncedSaveToCloud, syncStatus]);

  const updateLiturgy = (updatedLiturgy: Partial<LiturgyType>) => {
    setLiturgy(prev => {
      const newLiturgy = { ...prev, ...updatedLiturgy };
      localStorage.setItem('currentLiturgy', JSON.stringify(newLiturgy));
      
      // Marca para sincronização
      pendingSyncRef.current = true;
      setSyncStatus('pending');
      
      return newLiturgy;
    });
    
    // Iniciar sincronização com debounce
    debouncedSaveToCloud();
  };

  const updateSection = (sectionId: string, updatedSection: Partial<SectionType>) => {
    setLiturgy(prev => {
      const updatedSections = prev.sections.map(section => 
        section.id === sectionId ? { ...section, ...updatedSection } : section
      );
      
      const newLiturgy = { ...prev, sections: updatedSections };
      localStorage.setItem('currentLiturgy', JSON.stringify(newLiturgy));
      
      // Marca para sincronização
      pendingSyncRef.current = true;
      setSyncStatus('pending');
      
      return newLiturgy;
    });
    
    // Iniciar sincronização com debounce
    debouncedSaveToCloud();
  };

  const toggleSection = (sectionId: string) => {
    setLiturgy(prev => {
      const updatedSections = prev.sections.map(section => 
        section.id === sectionId ? { ...section, enabled: !section.enabled } : section
      );
      
      const newLiturgy = { ...prev, sections: updatedSections };
      localStorage.setItem('currentLiturgy', JSON.stringify(newLiturgy));
      
      // Marca para sincronização
      pendingSyncRef.current = true;
      setSyncStatus('pending');
      
      return newLiturgy;
    });
    
    // Iniciar sincronização com debounce
    debouncedSaveToCloud();
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
      
      // Marca para sincronização
      pendingSyncRef.current = true;
      setSyncStatus('pending');
      
      return newLiturgy;
    });
    
    // Iniciar sincronização com debounce
    debouncedSaveToCloud();
  };

  const resetLiturgy = () => {
    const newLiturgy = {
      ...defaultLiturgy,
      id: generateUniqueId(),
      date: new Date().toISOString().split('T')[0],
    };
    setLiturgy(newLiturgy);
    localStorage.setItem('currentLiturgy', JSON.stringify(newLiturgy));
    
    // Reiniciar o estado de sincronização
    setSyncStatus('synced');
    pendingSyncRef.current = false;
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
  };

  const generateShareableLink = async () => {
    setIsLoading(true);
    try {
      // Primeiro forçar a sincronização com Firebase, sem mostrar notificação duplicada
      await forceSyncToCloud(false);
      
      // Se chegarmos aqui, é porque a sincronização foi bem-sucedida
      return `${window.location.origin}/#/view/${liturgy.id}`;
    } catch (error) {
      console.error("Error generating shareable link:", error);
      toast({
        title: "Erro ao compartilhar",
        description: "Ocorreu um erro ao salvar a liturgia para compartilhamento.",
        variant: "destructive"
      });
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  const getSavedLiturgies = useCallback(() => {
    const savedLiturgies = JSON.parse(localStorage.getItem('savedLiturgies') || '{}');
    return Object.values(savedLiturgies) as LiturgyType[];
  }, []);

  const saveLiturgy = useCallback(async (showNotification = false): Promise<boolean> => {
    if (!liturgy.preacher && !liturgy.liturgist) return false; // Não salvar liturgias vazias
    
    // Salvar localmente
    const savedLiturgies = JSON.parse(localStorage.getItem('savedLiturgies') || '{}');
    savedLiturgies[liturgy.id] = liturgy;
    localStorage.setItem('savedLiturgies', JSON.stringify(savedLiturgies));
    
    // Tentar salvar na nuvem
    return await forceSyncToCloud(showNotification);
  }, [liturgy, forceSyncToCloud]);

const loadLiturgyById = useCallback(async (id: string): Promise<LiturgyType | null> => {
  // Aqui usamos um getter de estado atual ao invés da closure
  // Isso evita dependência de liturgy.id
  const currentLiturgy = liturgy;
  
  // Primeiro verificamos se é a liturgia atual que estamos editando
  if (currentLiturgy.id === id) {
    return currentLiturgy; // Retorna a liturgia atual imediatamente
  }
  
  // Depois verifica as liturgias salvas localmente
  const savedLiturgies = JSON.parse(localStorage.getItem('savedLiturgies') || '{}');
  if (savedLiturgies[id]) {
    const loadedLiturgy = savedLiturgies[id] as LiturgyType;
    // Atualiza o estado da liturgia atual
    setLiturgy(loadedLiturgy);
    localStorage.setItem('currentLiturgy', JSON.stringify(loadedLiturgy));
    setSyncStatus('synced'); // A liturgia está sincronizada porque foi carregada
    return loadedLiturgy;
  }
  
  // Por fim, busca do Firebase
  setIsLoading(true);
  try {
    const loadedLiturgy = await getLiturgyFromFirebase(id);
    if (loadedLiturgy) {
      // Atualiza o estado da liturgia atual
      setLiturgy(loadedLiturgy);
      localStorage.setItem('currentLiturgy', JSON.stringify(loadedLiturgy));
      setSyncStatus('synced'); // A liturgia está sincronizada porque foi carregada do servidor
      
      // Também salva nas liturgias locais
      const allSavedLiturgies = JSON.parse(localStorage.getItem('savedLiturgies') || '{}');
      allSavedLiturgies[loadedLiturgy.id] = loadedLiturgy;
      localStorage.setItem('savedLiturgies', JSON.stringify(allSavedLiturgies));
      
      return loadedLiturgy;
    }
    return null;
  } catch (error) {
    console.error("Error loading liturgy:", error);
    return null;
  } finally {
    setIsLoading(false);
  }
}, [liturgy]);

  return (
    <LiturgyContext.Provider
      value={{
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
        isLoading,
        syncStatus,
        forceSyncToCloud,
      }}
    >
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
