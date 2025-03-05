
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import SuggestionPopover from './SuggestionPopover';
import { prayerSuggestions } from '@/utils/liturgyUtils';

interface PrayerSuggestionProps {
  sectionType: string;
  onSuggestionSelect: (value: string) => void;
}

const PrayerSuggestion: React.FC<PrayerSuggestionProps> = ({ sectionType, onSuggestionSelect }) => {
  const suggestion = prayerSuggestions[sectionType as keyof typeof prayerSuggestions];
  
  if (!suggestion) return null;
  
  return (
    <SuggestionPopover 
      icon={<HelpCircle className="h-4 w-4" />} 
      title="Ajuda"
    >
      <Button
        variant="ghost"
        size="sm"
        className="justify-start text-left h-auto py-1.5"
        onClick={() => onSuggestionSelect(suggestion)}
      >
        Usar sugestão
      </Button>
    </SuggestionPopover>
  );
};

export default PrayerSuggestion;
