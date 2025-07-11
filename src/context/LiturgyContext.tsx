import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { generateUniqueId } from '../utils/liturgyUtils';
import { saveLiturgyToFirebase, getLiturgyFromFirebase } from '@/services/liturgyService';
import { toast } from '@/components/ui/use-toast';

// Status de sincronização
export type SyncStatus = 'synced' | 'syncing' | 'pending' | 'error';

// Tipos de elementos litúrgicos
export type ElementType = 
  | 'bibleReading'     // Leitura Bíblica
  | 'prayer'           // Oração
  | 'hymn'             // Hino/Cântico
  | 'lordsSupper'      // Ceia do Senhor
  | 'baptism'          // Batismo
  | 'baptismProfession' // Batismo e Profissão de Fé
  | 'profession'       // Profissão de Fé
  | 'preaching'        // Pregação da Palavra
  | 'blessing'         // Bênção
  | 'custom'           // Personalizado
  | 'title';           // Título

export type SectionType = {
  id: string;
  type: ElementType | string; // Keep string for backward compatibility
  title: string;
  enabled: boolean;
  
  // Fields for different element types
  // Bible Reading fields
  bibleReference?: string;
  readingName?: string;
  bibleText?: string;
  
  // Prayer fields
  prayerTitle?: string;
  prayerPerson?: string;
  prayerText?: string;
  
  // Hymn fields
  hymnTitle?: string;
  hymnCredits?: string;
  hymnLyrics?: string;
  
  // Lord's Supper fields
  institutionReading?: string;
  consecrationPrayer?: string;
  
  // Baptism fields
  baptismName?: string;
  
  // Preaching fields
  preachingText?: string;
  preachingTheme?: string;
  
  // Blessing fields
  blessingText?: string;
  
  // Custom fields
  customName?: string;
  
  // Legacy fields for backward compatibility
  bibleReading?: string;
  prayer?: string;
  songs?: string;
  sermon?: {
    text: string;
    theme: string;
    responseHymn?: string;
  };
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
  addSection: (elementType: ElementType) => void;
  removeSection: (sectionId: string) => void;
  resetLiturgy: () => void;
  loadReformedTemplate: () => void;
  generateShareableLink: () => Promise<string>;
  reorderSections: (sourceId: string, targetId: string) => void;
  getSavedLiturgies: () => LiturgyType[];
  saveLiturgy: (showNotification?: boolean) => Promise<boolean>;
  loadLiturgyById: (id: string) => Promise<LiturgyType | null>;
  isLoading: boolean;
  syncStatus: SyncStatus;
  forceSyncToCloud: (showNotification?: boolean) => Promise<boolean>;
}

// Reformed template sections
const reformedTemplateSections: SectionType[] = [
  { id: generateUniqueId(), type: 'bibleReading', title: 'Leitura Bíblica (Chamada à Adoração)', enabled: true, readingName: 'Chamada à Adoração' },
  { id: generateUniqueId(), type: 'prayer', title: 'Oração de Invocação', enabled: true, prayerTitle: 'Oração de Invocação' },
  { id: generateUniqueId(), type: 'hymn', title: 'Hino', enabled: true },
  { id: generateUniqueId(), type: 'bibleReading', title: 'Leitura Bíblica (Leitura da Lei)', enabled: true, readingName: 'Leitura da Lei' },
  { id: generateUniqueId(), type: 'prayer', title: 'Oração de Confissão', enabled: true, prayerTitle: 'Oração de Confissão' },
  { id: generateUniqueId(), type: 'hymn', title: 'Hino', enabled: true },
  { id: generateUniqueId(), type: 'bibleReading', title: 'Leitura Bíblica (Anúncio do Perdão)', enabled: true, readingName: 'Anúncio do Perdão' },
  { id: generateUniqueId(), type: 'prayer', title: 'Oração de Intercessão', enabled: true, prayerTitle: 'Oração de Intercessão' },
  { id: generateUniqueId(), type: 'hymn', title: 'Hino', enabled: true },
  { id: generateUniqueId(), type: 'preaching', title: 'Pregação da Palavra', enabled: true },
  { id: generateUniqueId(), type: 'lordsSupper', title: 'Ceia do Senhor', enabled: true },
  { id: generateUniqueId(), type: 'prayer', title: 'Oração Final', enabled: true, prayerTitle: 'Oração Final' },
  { id: generateUniqueId(), type: 'blessing', title: 'Bênção', enabled: true },
];

// Empty default sections for new liturgy
const defaultSections: SectionType[] = [];

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

  // Helper function to get title for element type
  const getElementTitle = (elementType: ElementType): string => {
    const titles = {
      bibleReading: 'Leitura Bíblica',
      prayer: 'Oração',
      hymn: 'Hino/Cântico', 
      lordsSupper: 'Ceia do Senhor',
      baptism: 'Batismo',
      baptismProfession: 'Batismo e Profissão de Fé',
      profession: 'Profissão de Fé',
      preaching: 'Pregação da Palavra',
      blessing: 'Bênção',
      custom: 'Personalizado',
      title: 'Título'
    };
    return titles[elementType] || 'Elemento Litúrgico';
  };

  const addSection = useCallback((elementType: ElementType) => {
    const newSection: SectionType = {
      id: generateUniqueId(),
      type: elementType,
      title: getElementTitle(elementType),
      enabled: true
    };
    
    setLiturgy(prev => {
      const newLiturgy = { 
        ...prev, 
        sections: [...prev.sections, newSection] 
      };
      localStorage.setItem('currentLiturgy', JSON.stringify(newLiturgy));
      
      // Marca para sincronização
      pendingSyncRef.current = true;
      setSyncStatus('pending');
      
      return newLiturgy;
    });
    
    // Iniciar sincronização com debounce
    debouncedSaveToCloud();
  }, [debouncedSaveToCloud]);

  const removeSection = useCallback((sectionId: string) => {
    setLiturgy(prev => {
      const updatedSections = prev.sections.filter(section => section.id !== sectionId);
      const newLiturgy = { ...prev, sections: updatedSections };
      localStorage.setItem('currentLiturgy', JSON.stringify(newLiturgy));
      
      // Marca para sincronização
      pendingSyncRef.current = true;
      setSyncStatus('pending');
      
      return newLiturgy;
    });
    
    // Iniciar sincronização com debounce
    debouncedSaveToCloud();
  }, [debouncedSaveToCloud]);

  const loadReformedTemplate = useCallback(() => {
    setLiturgy(prev => {
      const newLiturgy = { 
        ...prev, 
        sections: reformedTemplateSections.map(section => ({
          ...section,
          id: generateUniqueId() // Generate new IDs for template sections
        }))
      };
      localStorage.setItem('currentLiturgy', JSON.stringify(newLiturgy));
      
      // Marca para sincronização
      pendingSyncRef.current = true;
      setSyncStatus('pending');
      
      return newLiturgy;
    });
    
    // Iniciar sincronização com debounce
    debouncedSaveToCloud();
    
    toast({
      title: "Modelo carregado",
      description: "O modelo reformado foi aplicado à liturgia."
    });
  }, [debouncedSaveToCloud]);

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
        addSection,
        removeSection,
        resetLiturgy,
        loadReformedTemplate,
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
