import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { GripVertical, Trash2 } from 'lucide-react';
import { SectionType, useLiturgy, ElementType } from '@/context/LiturgyContext';
import ExpandableTextarea from './ExpandableTextarea';

interface LiturgicalElementProps {
  section: SectionType;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
}

const LiturgicalElement: React.FC<LiturgicalElementProps> = ({
  section,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const { updateSection, toggleSection, removeSection } = useLiturgy();

  const handleFieldChange = (field: keyof SectionType, value: string) => {
    updateSection(section.id, { [field]: value });
  };

  const renderElementFields = () => {
    switch (section.type as ElementType) {
      case 'bibleReading':
        return (
          <div className="space-y-4">
            <ExpandableTextarea
              label="Nome da Leitura (ex: Chamada à Adoração, Leitura da Lei)"
              value={section.readingName || ''}
              onChange={(value) => handleFieldChange('readingName', value)}
              placeholder="Nome da leitura..."
            />
            <ExpandableTextarea
              label="Referência Bíblica"
              value={section.bibleReference || ''}
              onChange={(value) => handleFieldChange('bibleReference', value)}
              placeholder="Ex: Salmo 95:1-7"
            />
            <ExpandableTextarea
              label="Texto Bíblico"
              value={section.bibleText || ''}
              onChange={(value) => handleFieldChange('bibleText', value)}
              placeholder="Texto completo da passagem..."
            />
          </div>
        );

      case 'prayer':
        return (
          <div className="space-y-4">
            <ExpandableTextarea
              label="Título da Oração"
              value={section.prayerTitle || ''}
              onChange={(value) => handleFieldChange('prayerTitle', value)}
              placeholder="Ex: Oração de Invocação, Oração de Confissão..."
            />
            <ExpandableTextarea
              label="Nome de Quem Irá Orar"
              value={section.prayerPerson || ''}
              onChange={(value) => handleFieldChange('prayerPerson', value)}
              placeholder="Nome da pessoa..."
            />
            <ExpandableTextarea
              label="Oração Escrita"
              value={section.prayerText || ''}
              onChange={(value) => handleFieldChange('prayerText', value)}
              placeholder="Texto da oração..."
            />
          </div>
        );

      case 'hymn':
        return (
          <div className="space-y-4">
            <ExpandableTextarea
              label="Título do Hino/Cântico"
              value={section.hymnTitle || ''}
              onChange={(value) => handleFieldChange('hymnTitle', value)}
              placeholder="Título do hino..."
            />
            <ExpandableTextarea
              label="Créditos"
              value={section.hymnCredits || ''}
              onChange={(value) => handleFieldChange('hymnCredits', value)}
              placeholder="Autor, compositor, fonte..."
            />
            <ExpandableTextarea
              label="Letra"
              value={section.hymnLyrics || ''}
              onChange={(value) => handleFieldChange('hymnLyrics', value)}
              placeholder="Letra completa do hino..."
            />
          </div>
        );

      case 'lordsSupper':
        return (
          <div className="space-y-4">
            <ExpandableTextarea
              label="Leitura da Palavra de Instituição"
              value={section.institutionReading || ''}
              onChange={(value) => handleFieldChange('institutionReading', value)}
              placeholder="Leitura bíblica da instituição da Ceia..."
            />
            <ExpandableTextarea
              label="Oração de Consagração"
              value={section.consecrationPrayer || ''}
              onChange={(value) => handleFieldChange('consecrationPrayer', value)}
              placeholder="Oração de consagração dos elementos..."
            />
          </div>
        );

      case 'baptism':
        return (
          <div className="space-y-4">
            <ExpandableTextarea
              label="Nome de Quem Será Batizado"
              value={section.baptismName || ''}
              onChange={(value) => handleFieldChange('baptismName', value)}
              placeholder="Nome da pessoa..."
            />
          </div>
        );

      case 'baptismProfession':
        return (
          <div className="space-y-4">
            <ExpandableTextarea
              label="Nome de Quem Será Batizado/Professará a Fé"
              value={section.baptismName || ''}
              onChange={(value) => handleFieldChange('baptismName', value)}
              placeholder="Nome da pessoa..."
            />
          </div>
        );

      case 'profession':
        return (
          <div className="space-y-4">
            <ExpandableTextarea
              label="Nome de Quem Professará a Fé"
              value={section.baptismName || ''}
              onChange={(value) => handleFieldChange('baptismName', value)}
              placeholder="Nome da pessoa..."
            />
          </div>
        );

      case 'preaching':
        return (
          <div className="space-y-4">
            <ExpandableTextarea
              label="Tema"
              value={section.preachingTheme || ''}
              onChange={(value) => handleFieldChange('preachingTheme', value)}
              placeholder="Tema da pregação..."
            />
            <ExpandableTextarea
              label="Texto"
              value={section.preachingText || ''}
              onChange={(value) => handleFieldChange('preachingText', value)}
              placeholder="Texto bíblico, esboço ou anotações..."
            />
          </div>
        );

      case 'blessing':
        return (
          <div className="space-y-4">
            <ExpandableTextarea
              label="Conteúdo da Bênção"
              value={section.blessingText || ''}
              onChange={(value) => handleFieldChange('blessingText', value)}
              placeholder="Texto da bênção..."
            />
          </div>
        );

      case 'custom':
        return (
          <div className="space-y-4">
            <ExpandableTextarea
              label="Nome do Elemento"
              value={section.customName || ''}
              onChange={(value) => handleFieldChange('customName', value)}
              placeholder="Nome personalizado..."
            />
          </div>
        );

      case 'title':
        return (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Este elemento é apenas um título/divisor. Você pode editar o título acima.
            </div>
          </div>
        );

      default:
        // Backward compatibility for legacy sections
        return (
          <div className="space-y-4">
            <ExpandableTextarea
              label="Leitura Bíblica"
              value={section.bibleReading || ''}
              onChange={(value) => handleFieldChange('bibleReading', value)}
              placeholder="Insira a referência bíblica e/ou o texto..."
            />
            <ExpandableTextarea
              label="Oração"
              value={section.prayer || ''}
              onChange={(value) => handleFieldChange('prayer', value)}
              placeholder="Insira o texto da oração..."
            />
            <ExpandableTextarea
              label="Cânticos"
              value={section.songs || ''}
              onChange={(value) => handleFieldChange('songs', value)}
              placeholder="Insira os cânticos, salmos e hinos..."
            />
          </div>
        );
    }
  };

  return (
    <Card 
      className={`mb-6 transition-all duration-300 ${section.enabled ? 'opacity-100' : 'opacity-60'}`}
      draggable={true}
      onDragStart={(e) => onDragStart && onDragStart(e, section.id)}
      onDragOver={(e) => onDragOver && onDragOver(e)}
      onDrop={(e) => onDrop && onDrop(e, section.id)}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="cursor-move">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <Input
              value={section.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="border-0 px-0 font-medium text-lg focus-visible:ring-0 bg-transparent"
              placeholder="Título do elemento..."
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor={`enable-${section.id}`} className="text-sm font-normal">
            {section.enabled ? 'Habilitado' : 'Desabilitado'}
          </Label>
          <Switch
            id={`enable-${section.id}`}
            checked={section.enabled}
            onCheckedChange={() => toggleSection(section.id)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeSection(section.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {section.enabled && (
        <CardContent className="animate-fade-in">
          {renderElementFields()}
        </CardContent>
      )}
    </Card>
  );
};

export default LiturgicalElement;