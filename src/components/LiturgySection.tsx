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
    ? 'mb-6 page-break-inside-avoid print:border-none print:shadow-none text-black' 
    : 'mb-6 transition-all duration-300 hover:shadow-md animate-scale-in';

  // Helper function to format Bible references nicely
  const formatBibleReference = (text: string | undefined) => {
    if (!text) return null;
    
    // Extract just the reference from the full text if it includes a dash separator
    const referenceMatch = text.match(/^(.*?)\s*-\s*/);
    if (referenceMatch) {
      const reference = referenceMatch[1];
      const content = text.substring(referenceMatch[0].length);
      
      return (
        <>
          <div className={`font-medium ${printMode ? 'text-black' : ''}`}>{reference}</div>
          <div className={`mt-1 whitespace-pre-line ${printMode ? 'text-black' : ''}`}>{content}</div>
        </>
      );
    }
    
    return <div className={`whitespace-pre-line ${printMode ? 'text-black' : ''}`}>{text}</div>;
  };

  // Helper function to format hymn/psalm references nicely
  const formatHymnReference = (text: string | undefined) => {
    if (!text) return null;
    
    // Split by newlines to handle multiple hymns
    const hymns = text.split('\n\n').filter(Boolean);
    
    return (
      <>
        {hymns.map((hymn, index) => {
          // Check if it contains a dash (like "Novo Cântico 14 - Louvor")
          const hymnMatch = hymn.match(/^(.*?)\s*-\s*(.*)/);
          
          if (hymnMatch) {
            const [_, reference, title] = hymnMatch;
            return (
              <div key={index} className="mb-2">
                <div className={`font-medium ${printMode ? 'text-black' : ''}`}>{reference}</div>
                <div className={printMode ? 'text-black' : ''}>{title}</div>
              </div>
            );
          }
          
          return <div key={index} className={`mb-2 ${printMode ? 'text-black' : ''}`}>{hymn}</div>;
        })}
      </>
    );
  };

  // Função para preservar quebras de linha
  const formatTextWithLineBreaks = (text: string) => {
    if (!text) return '';
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const renderSectionContent = () => {
    if (section.type === 'wordPreaching' && section.sermon) {
      return (
        <>
          <div className="mb-4">
            <Badge variant="outline" className={`mb-2 ${printMode ? 'text-black border-black' : ''}`}>Sermão</Badge>
            <div className={`font-medium mt-1 mb-2 ${printMode ? 'text-black' : ''}`}>Tema: {section.sermon.theme}</div>
            <div className={`text-sm whitespace-pre-line ${printMode ? 'text-black' : ''}`}>{section.sermon.text}</div>
          </div>
          
          {section.sermon.responseHymn && (
            <div className="mb-4">
              <Badge variant="outline" className={`mb-2 ${printMode ? 'text-black border-black' : ''}`}>Cântico em Resposta</Badge>
              <div className={`text-sm ${printMode ? 'text-black' : ''}`}>
                {formatHymnReference(section.sermon.responseHymn)}
              </div>
            </div>
          )}
        </>
      );
    }
    
    return (
      <>
        {section.bibleReading && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Leitura Bíblica:</h4>
            <div className="text-sm whitespace-pre-line">{formatTextWithLineBreaks(section.bibleReading)}</div>
          </div>
        )}
        
        {section.prayer && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Oração:</h4>
            <div className="text-sm whitespace-pre-line">{formatTextWithLineBreaks(section.prayer)}</div>
          </div>
        )}
        
        {section.songs && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Cânticos:</h4>
            <div className="text-sm whitespace-pre-line">{formatTextWithLineBreaks(section.songs)}</div>
          </div>
        )}
      </>
    );
  };

  return (
    <Card className={classes}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-lg font-medium ${printMode ? 'text-black' : ''}`}>{section.title}</CardTitle>
      </CardHeader>
      <CardContent className={printMode ? 'text-black' : ''}>
        {renderSectionContent()}
      </CardContent>
    </Card>
  );
};

export default LiturgySection;
