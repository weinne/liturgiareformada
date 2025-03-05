
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Music, Loader2 } from 'lucide-react';
import SuggestionPopover from './SuggestionPopover';
import { hymnSuggestions } from '@/utils/liturgyUtils';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';

interface HymnSuggestionsProps {
  sectionType: string;
  onSuggestionSelect: (value: string) => void;
}

const fetchHymnLyrics = async (hymnNumber: string): Promise<string> => {
  try {
    const response = await fetch(`https://novocantico.com.br/hino/${hymnNumber}`);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar letra do hino');
    }
    
    const html = await response.text();
    
    // Extract the lyrics using basic text parsing
    // This is a simplified approach and might need adjustment based on website structure
    const lyricsMatch = html.match(/<div class="entry-content">([\s\S]*?)<\/div>/i);
    
    if (lyricsMatch && lyricsMatch[1]) {
      // Clean up the HTML to extract just the text content
      let lyrics = lyricsMatch[1]
        .replace(/<br\s*\/?>/gi, '\n')  // Replace <br> with newlines
        .replace(/<\/p><p>/gi, '\n\n')  // Replace paragraph breaks with double newlines
        .replace(/<[^>]*>/g, '')        // Remove remaining HTML tags
        .replace(/&nbsp;/g, ' ')        // Replace non-breaking spaces
        .trim();
      
      return lyrics;
    }
    
    throw new Error('Formato da página de hino desconhecido');
  } catch (error) {
    console.error("Error fetching hymn lyrics:", error);
    return "Não foi possível obter a letra do hino.";
  }
};

const HymnSuggestions: React.FC<HymnSuggestionsProps> = ({ sectionType, onSuggestionSelect }) => {
  const [selectedHymn, setSelectedHymn] = useState<string | null>(null);
  const [hymnLyrics, setHymnLyrics] = useState<string | null>(null);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);
  
  const suggestions = hymnSuggestions[sectionType as keyof typeof hymnSuggestions] || [];
  
  const handleHymnSelect = async (hymn: string) => {
    setSelectedHymn(hymn);
    setIsLoadingLyrics(true);
    
    try {
      // Parse hymn number from the format like "NC 14 - Santo! Santo! Santo!"
      const hymnMatch = hymn.match(/NC (\d+)(-[A-Z])?/i);
      if (hymnMatch && hymnMatch[1]) {
        const hymnNumber = hymnMatch[1] + (hymnMatch[2] || "");
        
        // Try to fetch the hymn lyrics from the website
        const lyrics = await fetchHymnLyrics(hymnNumber);
        
        // Format the complete hymn with title and lyrics
        const fullHymn = `${hymn}\n\n${lyrics}`;
        setHymnLyrics(fullHymn);
        onSuggestionSelect(fullHymn);
      } else {
        // If it's not a Novo Cântico hymn (e.g., a Psalm)
        setHymnLyrics(hymn);
        onSuggestionSelect(hymn);
      }
    } catch (error) {
      console.error("Error processing hymn:", error);
      const errorMessage = `${hymn}\n\n[Erro ao buscar letra do hino. Por favor, consulte manualmente: https://novocantico.com.br/indice/numerica/]`;
      setHymnLyrics(errorMessage);
      onSuggestionSelect(errorMessage);
      
      toast({
        title: "Erro ao buscar letra",
        description: "Não foi possível recuperar a letra do hino. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingLyrics(false);
    }
  };
  
  return (
    <SuggestionPopover 
      icon={<Music className="h-4 w-4" />} 
      title="Sugestões"
    >
      <div className="grid grid-cols-1 gap-1 max-h-80 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <Button 
            key={index} 
            variant="ghost" 
            size="sm" 
            className="justify-start text-left h-auto py-1.5"
            onClick={() => handleHymnSelect(suggestion)}
            disabled={isLoadingLyrics}
          >
            {isLoadingLyrics && selectedHymn === suggestion ? (
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
            ) : null}
            {suggestion}
          </Button>
        ))}
      </div>
    </SuggestionPopover>
  );
};

export default HymnSuggestions;
