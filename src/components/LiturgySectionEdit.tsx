
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SectionType, useLiturgy } from '@/context/LiturgyContext';
import SectionHeader from './liturgy/SectionHeader';
import StandardFields from './liturgy/StandardFields';
import SermonFields from './liturgy/SermonFields';

interface LiturgySectionEditProps {
  section: SectionType;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
}

const LiturgySectionEdit: React.FC<LiturgySectionEditProps> = ({ 
  section, 
  onDragStart, 
  onDragOver, 
  onDrop 
}) => {
  const { updateSection, toggleSection } = useLiturgy();

  const handleChange = (field: keyof SectionType, value: string) => {
    updateSection(section.id, { [field]: value });
  };

  const handleSermonChange = (field: 'text' | 'theme' | 'responseHymn', value: string) => {
    updateSection(section.id, { 
      sermon: { 
        ...(section.sermon || { text: '', theme: '', responseHymn: '' }), 
        [field]: value 
      } 
    });
  };

  const handleSuggestion = (field: 'bibleReading' | 'prayer' | 'songs', value: string) => {
    // If songs field already has content, append with a line break
    if (field === 'songs' && section.songs) {
      updateSection(section.id, { [field]: section.songs + '\n\n' + value });
    } else {
      updateSection(section.id, { [field]: value });
    }
  };

  const handleSermonHymnSuggestion = (value: string) => {
    // For the sermon response hymn
    handleSermonChange('responseHymn', value);
  };

  return (
    <Card 
      className={`mb-6 transition-all duration-300 ${section.enabled ? 'opacity-100' : 'opacity-60'}`}
      draggable={true}
      onDragStart={(e) => onDragStart && onDragStart(e, section.id)}
      onDragOver={(e) => onDragOver && onDragOver(e)}
      onDrop={(e) => onDrop && onDrop(e, section.id)}
    >
      <SectionHeader 
        id={section.id}
        title={section.title}
        enabled={section.enabled}
        onToggle={() => toggleSection(section.id)}
      />
      
      {section.enabled && (
        <CardContent className="animate-fade-in">
          {section.type === 'wordPreaching' ? (
            <SermonFields 
              sectionId={section.id}
              sermon={section.sermon}
              sectionType={section.type}
              onSermonChange={handleSermonChange}
              onHymnSuggestionSelect={handleSermonHymnSuggestion}
            />
          ) : (
            <StandardFields 
              sectionId={section.id}
              sectionType={section.type}
              bibleReading={section.bibleReading}
              prayer={section.prayer}
              songs={section.songs}
              onFieldChange={handleChange}
              onSuggestionSelect={handleSuggestion}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default LiturgySectionEdit;
