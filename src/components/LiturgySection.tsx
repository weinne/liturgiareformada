
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionType } from '@/context/LiturgyContext';

interface LiturgySectionProps {
  section: SectionType;
  printMode?: boolean;
}

const LiturgySection: React.FC<LiturgySectionProps> = ({ section, printMode = false }) => {
  if (!section.enabled) return null;

  const classes = printMode 
    ? 'mb-6 page-break-inside-avoid print:border-none print:shadow-none' 
    : 'mb-6 transition-all duration-300 hover:shadow-md animate-scale-in';

  const renderSectionContent = () => {
    if (section.type === 'wordPreaching' && section.sermon) {
      return (
        <>
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">Sermão</Badge>
            <div className="font-medium mt-1 mb-2">Tema: {section.sermon.theme}</div>
            <div className="text-sm whitespace-pre-line">{section.sermon.text}</div>
          </div>
          
          {section.sermon.responseHymn && (
            <div className="mb-4">
              <Badge variant="outline" className="mb-2">Cântico em Resposta</Badge>
              <div className="text-sm whitespace-pre-line">{section.sermon.responseHymn}</div>
            </div>
          )}
        </>
      );
    }
    
    return (
      <>
        {section.bibleReading && (
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">Leitura Bíblica</Badge>
            <div className="text-sm whitespace-pre-line">{section.bibleReading}</div>
          </div>
        )}
        
        {section.prayer && (
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">Oração</Badge>
            <div className="text-sm whitespace-pre-line">{section.prayer}</div>
          </div>
        )}
        
        {section.songs && (
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">Cânticos</Badge>
            <div className="text-sm whitespace-pre-line">{section.songs}</div>
          </div>
        )}
      </>
    );
  };

  return (
    <Card className={classes}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{section.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderSectionContent()}
      </CardContent>
    </Card>
  );
};

export default LiturgySection;
