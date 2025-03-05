
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ChevronDown, HelpCircle, BookOpen } from 'lucide-react';
import { SectionType, useLiturgy } from '@/context/LiturgyContext';
import { bibleReferenceSuggestions, prayerSuggestions } from '@/utils/liturgyUtils';

interface LiturgySectionEditProps {
  section: SectionType;
}

const LiturgySectionEdit: React.FC<LiturgySectionEditProps> = ({ section }) => {
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

  const handleSuggestion = (field: 'bibleReading' | 'prayer', value: string) => {
    updateSection(section.id, { [field]: value });
  };

  const renderBibleSuggestions = () => {
    const suggestions = bibleReferenceSuggestions[section.type as keyof typeof bibleReferenceSuggestions] || [];
    
    return (
      <div className="grid grid-cols-1 gap-1">
        {suggestions.map((suggestion, index) => (
          <Button 
            key={index} 
            variant="ghost" 
            size="sm" 
            className="justify-start text-left h-auto py-1.5"
            onClick={() => handleSuggestion('bibleReading', suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    );
  };

  const renderPrayerSuggestion = () => {
    const suggestion = prayerSuggestions[section.type as keyof typeof prayerSuggestions];
    if (!suggestion) return null;
    
    return (
      <Button
        variant="ghost"
        size="sm"
        className="justify-start text-left h-auto py-1.5"
        onClick={() => handleSuggestion('prayer', suggestion)}
      >
        Usar sugestão
      </Button>
    );
  };

  const renderSectionFields = () => {
    // Special case for the sermon section
    if (section.type === 'wordPreaching') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`sermon-theme-${section.id}`}>Tema do Sermão</Label>
            <Input
              id={`sermon-theme-${section.id}`}
              value={section.sermon?.theme || ''}
              onChange={(e) => handleSermonChange('theme', e.target.value)}
              placeholder="Insira o tema do sermão..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`sermon-text-${section.id}`}>Texto do Sermão</Label>
            <Textarea
              id={`sermon-text-${section.id}`}
              value={section.sermon?.text || ''}
              onChange={(e) => handleSermonChange('text', e.target.value)}
              placeholder="Insira o texto do sermão ou anotações..."
              className="resize-none min-h-[150px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`sermon-response-${section.id}`}>Cântico em Resposta ao Sermão</Label>
            <Textarea
              id={`sermon-response-${section.id}`}
              value={section.sermon?.responseHymn || ''}
              onChange={(e) => handleSermonChange('responseHymn', e.target.value)}
              placeholder="Insira o cântico em resposta ao sermão..."
              className="resize-none min-h-[100px]"
            />
          </div>
        </div>
      );
    }
    
    // Default fields for other sections
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`bible-${section.id}`}>Leitura Bíblica</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Sugestões</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-60">
                {renderBibleSuggestions()}
              </PopoverContent>
            </Popover>
          </div>
          <Textarea
            id={`bible-${section.id}`}
            value={section.bibleReading || ''}
            onChange={(e) => handleChange('bibleReading', e.target.value)}
            placeholder="Insira a referência bíblica e/ou o texto..."
            className="resize-none min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`prayer-${section.id}`}>Oração</Label>
            {prayerSuggestions[section.type as keyof typeof prayerSuggestions] && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <HelpCircle className="h-4 w-4" />
                    <span>Ajuda</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-60">
                  {renderPrayerSuggestion()}
                </PopoverContent>
              </Popover>
            )}
          </div>
          <Textarea
            id={`prayer-${section.id}`}
            value={section.prayer || ''}
            onChange={(e) => handleChange('prayer', e.target.value)}
            placeholder="Insira o texto da oração..."
            className="resize-none min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`songs-${section.id}`}>Cânticos</Label>
          <Textarea
            id={`songs-${section.id}`}
            value={section.songs || ''}
            onChange={(e) => handleChange('songs', e.target.value)}
            placeholder="Insira os cânticos, salmos e hinos..."
            className="resize-none min-h-[100px]"
          />
        </div>
      </div>
    );
  };

  return (
    <Card className={`mb-6 transition-all duration-300 ${section.enabled ? 'opacity-100' : 'opacity-60'}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">{section.title}</CardTitle>
        <div className="flex items-center gap-2">
          <Label htmlFor={`enable-${section.id}`} className="text-sm font-normal">
            {section.enabled ? 'Habilitado' : 'Desabilitado'}
          </Label>
          <Switch
            id={`enable-${section.id}`}
            checked={section.enabled}
            onCheckedChange={() => toggleSection(section.id)}
          />
        </div>
      </CardHeader>
      
      {section.enabled && (
        <CardContent className="animate-fade-in">
          {renderSectionFields()}
        </CardContent>
      )}
    </Card>
  );
};

export default LiturgySectionEdit;
