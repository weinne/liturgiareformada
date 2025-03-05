
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
          <div className="font-medium">{reference}</div>
          <div className="mt-1 whitespace-pre-line">{content}</div>
        </>
      );
    }
    
    return <div className="whitespace-pre-line">{text}</div>;
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
                <div className="font-medium">{reference}</div>
                <div>{title}</div>
              </div>
            );
          }
          
          return <div key={index} className="mb-2">{hymn}</div>;
        })}
      </>
    );
  };

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
              <div className="text-sm">
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
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">Leitura Bíblica</Badge>
            <div className="text-sm">
              {formatBibleReference(section.bibleReading)}
            </div>
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
            <div className="text-sm">
              {formatHymnReference(section.songs)}
            </div>
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
