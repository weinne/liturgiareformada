import React, { useEffect } from 'react';
import { LiturgyType } from '@/context/LiturgyContext';
import LiturgySection from './LiturgySection';
import { formatDate } from '@/utils/liturgyUtils';
import { useTheme } from 'next-themes';

interface PrintLayoutProps {
  liturgy: LiturgyType;
}

const PrintLayout: React.FC<PrintLayoutProps> = ({ liturgy }) => {
  const enabledSections = liturgy.sections.filter(section => section.enabled);
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    // Salvar o tema atual
    const originalTheme = theme;
    
    // Mudar para o tema claro quando o componente for carregado
    setTheme('light');
    
    // Iniciar o processo de impressão após uma pequena pausa
    const printTimeout = setTimeout(() => {
      window.print();
    }, 300);
    
    // Event listener para detectar quando a impressão terminar
    const handleAfterPrint = () => {
      // Restaurar o tema original
      setTheme(originalTheme || 'system');
    };
    
    window.addEventListener('afterprint', handleAfterPrint);
    
    // Cleanup function
    return () => {
      clearTimeout(printTimeout);
      window.removeEventListener('afterprint', handleAfterPrint);
      // Garantir que o tema é restaurado quando o componente é desmontado
      setTheme(originalTheme || 'system');
    };
  }, [theme, setTheme]);
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 print:px-0 print:py-0 bg-white text-black print:bg-white print:text-black">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2 text-black">Liturgia do Culto</h1>
        <p className="text-lg mb-1 text-black">{formatDate(liturgy.date)}</p>
        <div className="flex justify-center items-center gap-x-2 text-sm text-gray-600">
          <p>Pregador: <span className="font-medium text-black">{liturgy.preacher}</span></p>
          <span>•</span>
          <p>Liturgo: <span className="font-medium text-black">{liturgy.liturgist}</span></p>
        </div>
      </div>
      
      <div className="space-y-6 text-black">
        {enabledSections.map((section) => (
          <LiturgySection key={section.id} section={section} printMode={true} />
        ))}
      </div>
    </div>
  );
};

export default PrintLayout;
