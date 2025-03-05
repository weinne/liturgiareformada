
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import BibleSuggestions from './BibleSuggestions';
import PrayerSuggestion from './PrayerSuggestion';
import HymnSuggestions from './HymnSuggestions';

interface StandardFieldsProps {
  sectionId: string;
  sectionType: string;
  bibleReading?: string;
  prayer?: string;
  songs?: string;
  onFieldChange: (field: string, value: string) => void;
  onSuggestionSelect: (field: 'bibleReading' | 'prayer' | 'songs', value: string) => void;
}

const StandardFields: React.FC<StandardFieldsProps> = ({
  sectionId,
  sectionType,
  bibleReading = '',
  prayer = '',
  songs = '',
  onFieldChange,
  onSuggestionSelect
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`bible-${sectionId}`}>Leitura Bíblica</Label>
          <BibleSuggestions
            sectionType={sectionType}
            onSuggestionSelect={(value) => onSuggestionSelect('bibleReading', value)}
          />
        </div>
        <Textarea
          id={`bible-${sectionId}`}
          value={bibleReading}
          onChange={(e) => onFieldChange('bibleReading', e.target.value)}
          placeholder="Insira a referência bíblica e/ou o texto..."
          className="resize-none min-h-[100px]"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`prayer-${sectionId}`}>Oração</Label>
          <PrayerSuggestion
            sectionType={sectionType}
            onSuggestionSelect={(value) => onSuggestionSelect('prayer', value)}
          />
        </div>
        <Textarea
          id={`prayer-${sectionId}`}
          value={prayer}
          onChange={(e) => onFieldChange('prayer', e.target.value)}
          placeholder="Insira o texto da oração..."
          className="resize-none min-h-[100px]"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`songs-${sectionId}`}>Cânticos</Label>
          <HymnSuggestions
            sectionType={sectionType}
            onSuggestionSelect={(value) => onSuggestionSelect('songs', value)}
          />
        </div>
        <Textarea
          id={`songs-${sectionId}`}
          value={songs}
          onChange={(e) => onFieldChange('songs', e.target.value)}
          placeholder="Insira os cânticos, salmos e hinos..."
          className="resize-none min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default StandardFields;
