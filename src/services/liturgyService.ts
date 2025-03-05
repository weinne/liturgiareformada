import { db } from '@/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { LiturgyType } from '@/context/LiturgyContext';
import { toast } from '@/components/ui/use-toast';

export const saveLiturgyToFirebase = async (liturgy: LiturgyType): Promise<boolean> => {
  try {
    // Limitar o tamanho da liturgia para evitar problemas com o Firestore
    const liturgyToSave = {
      ...liturgy,
      sections: liturgy.sections.map(section => ({
        ...section,
        // Limitar o tamanho dos textos
        bibleReading: section.bibleReading?.slice(0, 10000) || null,
        prayer: section.prayer?.slice(0, 10000) || null,
        songs: section.songs?.slice(0, 5000) || null,
        sermon: section.sermon ? {
          text: section.sermon.text?.slice(0, 10000) || '',
          theme: section.sermon.theme?.slice(0, 500) || '',
          responseHymn: section.sermon.responseHymn?.slice(0, 1000) || ''
        } : null
      }))
    };

    // Salvar no Firestore usando o id da liturgia como documento ID
    await setDoc(doc(db, "liturgies", liturgy.id), liturgyToSave);
    
    // Salvar também localmente para acesso offline
    const savedLiturgies = JSON.parse(localStorage.getItem('savedLiturgies') || '{}');
    savedLiturgies[liturgy.id] = liturgy;
    localStorage.setItem('savedLiturgies', JSON.stringify(savedLiturgies));
    
    return true;
  } catch (error) {
    console.error("Error saving liturgy to Firebase:", error);
    toast({
      title: "Erro ao salvar liturgia",
      description: "A liturgia foi salva localmente, mas houve um erro ao salvá-la na nuvem.",
      variant: "destructive"
    });
    return false;
  }
};

export const getLiturgyFromFirebase = async (id: string): Promise<LiturgyType | null> => {
  try {
    // Primeiro verifica localmente
    const savedLiturgies = JSON.parse(localStorage.getItem('savedLiturgies') || '{}');
    if (savedLiturgies[id]) {
      return savedLiturgies[id] as LiturgyType;
    }
    
    // Se não encontrar localmente, buscar do Firebase
    const liturgyDoc = await getDoc(doc(db, "liturgies", id));
    
    if (liturgyDoc.exists()) {
      const liturgyData = liturgyDoc.data() as LiturgyType;
      
      // Salvar localmente para acesso futuro offline
      savedLiturgies[id] = liturgyData;
      localStorage.setItem('savedLiturgies', JSON.stringify(savedLiturgies));
      
      return liturgyData;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching liturgy from Firebase:", error);
    toast({
      title: "Erro ao carregar liturgia",
      description: "Não foi possível carregar a liturgia do servidor. Verifique sua conexão.",
      variant: "destructive"
    });
    return null;
  }
};
