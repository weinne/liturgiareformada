
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Music, BookOpen } from 'lucide-react';
import SuggestionPopover from './SuggestionPopover';
import { hymnSuggestions } from '@/utils/liturgyUtils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface HymnSuggestionsProps {
  sectionType: string;
  onSuggestionSelect: (value: string) => void;
}

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
      const hymnMatch = hymn.match(/NC (\d+)/);
      if (hymnMatch && hymnMatch[1]) {
        const hymnNumber = hymnMatch[1];
        const fullHymn = `${hymn}\n\n[Letra não disponível automaticamente - Consulte https://novocantico.com.br/hino/${hymnNumber}]`;
        setHymnLyrics(fullHymn);
      } else {
        setHymnLyrics(hymn);
      }
    } catch (error) {
      console.error("Error fetching hymn lyrics:", error);
      setHymnLyrics(`${hymn}\n\n[Erro ao buscar letra do hino]`);
    } finally {
      setIsLoadingLyrics(false);
      onSuggestionSelect(selectedHymn || hymn);
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
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </SuggestionPopover>
  );
};

export default HymnSuggestions;
