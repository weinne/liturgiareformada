
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Music } from 'lucide-react';
import HymnSuggestions from './HymnSuggestions';

interface SermonFieldsProps {
  sectionId: string;
  sermon?: {
    text: string;
    theme: string;
    responseHymn?: string;
  };
  sectionType: string;
  onSermonChange: (field: 'text' | 'theme' | 'responseHymn', value: string) => void;
  onHymnSuggestionSelect: (value: string) => void;
}

const SermonFields: React.FC<SermonFieldsProps> = ({ 
  sectionId, 
  sermon = { text: '', theme: '', responseHymn: '' }, 
  sectionType,
  onSermonChange,
  onHymnSuggestionSelect
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`sermon-theme-${sectionId}`}>Tema do Sermão</Label>
        <Input
          id={`sermon-theme-${sectionId}`}
          value={sermon.theme}
          onChange={(e) => onSermonChange('theme', e.target.value)}
          placeholder="Insira o tema do sermão..."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`sermon-text-${sectionId}`}>Texto do Sermão</Label>
        <Textarea
          id={`sermon-text-${sectionId}`}
          value={sermon.text}
          onChange={(e) => onSermonChange('text', e.target.value)}
          placeholder="Insira o texto do sermão ou anotações..."
          className="resize-none min-h-[150px]"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`sermon-response-${sectionId}`}>Cântico em Resposta ao Sermão</Label>
          <HymnSuggestions
            sectionType={sectionType}
            onSuggestionSelect={onHymnSuggestionSelect}
          />
        </div>
        <Textarea
          id={`sermon-response-${sectionId}`}
          value={sermon.responseHymn || ''}
          onChange={(e) => onSermonChange('responseHymn', e.target.value)}
          placeholder="Insira o cântico em resposta ao sermão..."
          className="resize-none min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default SermonFields;
