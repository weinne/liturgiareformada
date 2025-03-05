
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import SuggestionPopover from './SuggestionPopover';
import { bibleReferenceSuggestions } from '@/utils/liturgyUtils';

interface BibleSuggestionsProps {
  sectionType: string;
  onSuggestionSelect: (value: string) => void;
}

const BibleSuggestions: React.FC<BibleSuggestionsProps> = ({ sectionType, onSuggestionSelect }) => {
  const suggestions = bibleReferenceSuggestions[sectionType as keyof typeof bibleReferenceSuggestions] || [];
  
  return (
    <SuggestionPopover 
      icon={<BookOpen className="h-4 w-4" />} 
      title="Sugestões"
      width="w-72"
    >
      <div className="grid grid-cols-1 gap-1 max-h-80 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <Button 
            key={index} 
            variant="ghost" 
            size="sm" 
            className="justify-start text-left h-auto py-1.5 whitespace-normal"
            onClick={() => onSuggestionSelect(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </SuggestionPopover>
  );
};

export default BibleSuggestions;
