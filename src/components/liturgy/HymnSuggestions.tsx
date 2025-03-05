
import React from 'react';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import SuggestionPopover from './SuggestionPopover';
import { hymnSuggestions } from '@/utils/hymnSuggestions';

interface HymnSuggestionsProps {
  sectionType: string;
  onSuggestionSelect: (value: string) => void;
}

const HymnSuggestions: React.FC<HymnSuggestionsProps> = ({ sectionType, onSuggestionSelect }) => {
  const suggestions = hymnSuggestions[sectionType as keyof typeof hymnSuggestions] || [];
  
  const handleHymnSelect = (hymn: string) => {
    onSuggestionSelect(hymn);
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
