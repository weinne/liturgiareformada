
import React from 'react';
import { LiturgyType } from '@/context/LiturgyContext';
import LiturgySection from './LiturgySection';
import { formatDate } from '@/utils/liturgyUtils';

interface PrintLayoutProps {
  liturgy: LiturgyType;
}

const PrintLayout: React.FC<PrintLayoutProps> = ({ liturgy }) => {
  const enabledSections = liturgy.sections.filter(section => section.enabled);
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 print:px-0 print:py-0">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Liturgia do Culto</h1>
        <p className="text-lg mb-1">{formatDate(liturgy.date)}</p>
        <div className="flex justify-center items-center gap-x-2 text-sm text-muted-foreground">
          <p>Pregador: <span className="font-medium text-foreground">{liturgy.preacher}</span></p>
          <span>•</span>
          <p>Liturgo: <span className="font-medium text-foreground">{liturgy.liturgist}</span></p>
        </div>
      </div>
      
      <div className="space-y-6">
        {enabledSections.map((section) => (
          <LiturgySection key={section.id} section={section} printMode={true} />
        ))}
      </div>
    </div>
  );
};

export default PrintLayout;
