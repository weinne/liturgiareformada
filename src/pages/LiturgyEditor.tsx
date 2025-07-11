import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import LiturgyForm from '@/components/LiturgyForm';
import LiturgicalElement from '@/components/LiturgicalElement';
import AddElementButton from '@/components/AddElementButton';
import ShareModal from '@/components/ShareModal';
import SyncStatus from '@/components/SyncStatus';
import { Button } from '@/components/ui/button';
import { useLiturgy } from '@/context/LiturgyContext';
import { useNavigate } from 'react-router-dom';
import { Printer, BookOpenCheck } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { formatDate } from '@/utils/liturgyUtils';

const LiturgyEditor: React.FC = () => {
  const { liturgy, updateLiturgy, loadReformedTemplate } = useLiturgy();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printFrameRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();

  const handlePreview = () => {
    navigate(`/view/${liturgy.id}`);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      if (printFrameRef.current?.contentWindow) {
        printFrameRef.current.contentWindow.print();
      }
    }, 500);
  };
  
  const handleAfterPrint = () => {
    setIsPrinting(false);
  };

  React.useEffect(() => {
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  // Handle drag and drop for sections
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('sectionId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('sectionId');
    
    if (sourceId === targetId) return;
    
    const sections = [...liturgy.sections];
    const sourceIndex = sections.findIndex(section => section.id === sourceId);
    const targetIndex = sections.findIndex(section => section.id === targetId);
    
    if (sourceIndex > -1 && targetIndex > -1) {
      const [movedSection] = sections.splice(sourceIndex, 1);
      sections.splice(targetIndex, 0, movedSection);
      
      // Update the section titles to reflect their new order
      const updatedSections = sections.map((section, index) => ({
        ...section,
        title: section.title.replace(/^\d+\./, `${index + 1}.`)
      }));
      
      updateLiturgy({ sections: updatedSections });
      
      toast({
        title: "Seção movida",
        description: "A ordem das seções foi atualizada.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary/40 dark:bg-secondary/20 flex flex-col">
      <Header 
        showBackButton 
        onShareClick={() => setShareModalOpen(true)} 
        onPrintClick={handlePrint}
        onPreviewClick={handlePreview}
      />
      
      <main className="flex-1 container max-w-3xl py-24 px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Informações do Culto</h2>
          <div className="flex items-center gap-2">
            <SyncStatus />
          </div>
        </div>
        
        <LiturgyForm />
        
        <div className="mb-8 mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Elementos Litúrgicos
              {liturgy.sections.length > 0 && (
                <span className="text-sm font-normal ml-2 text-muted-foreground">(arraste para reorganizar)</span>
              )}
            </h2>
            {liturgy.sections.length === 0 && (
              <Button onClick={loadReformedTemplate} variant="outline">
                <BookOpenCheck className="w-4 h-4 mr-2" />
                Usar Modelo Reformado
              </Button>
            )}
          </div>
          
          {liturgy.sections.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-muted-foreground">Liturgia Vazia</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Comece adicionando elementos litúrgicos ou use o modelo reformado para uma liturgia pré-estruturada.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <AddElementButton />
                  <Button onClick={loadReformedTemplate} variant="outline">
                    <BookOpenCheck className="w-4 h-4 mr-2" />
                    Usar Modelo Reformado
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {liturgy.sections.map(section => (
                <LiturgicalElement 
                  key={section.id} 
                  section={section} 
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              ))}
              <div className="pt-4">
                <AddElementButton />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <ShareModal 
        open={shareModalOpen} 
        onOpenChange={setShareModalOpen} 
        liturgy={liturgy}
      />

      {isPrinting && (
        <iframe
          ref={printFrameRef}
          style={{
            position: 'absolute',
            top: '-9999px',
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          title="print-frame"
          srcDoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Liturgia - ${liturgy.date || 'Sem data'}</title>
                <meta charset="utf-8" />
                <style>
                  @media print {
                    body {
                      font-family: system-ui, -apple-system, sans-serif;
                      line-height: 1.5;
                      color: black;
                      background: white;
                    }
                    h1 { font-size: 24pt; margin-bottom: 12pt; }
                    h2 { font-size: 16pt; margin-bottom: 8pt; }
                    .section { margin-bottom: 16pt; page-break-inside: avoid; }
                    .section-title { font-weight: bold; margin-bottom: 6pt; }
                    .label { font-weight: bold; margin-top: 8pt; margin-bottom: 4pt; }
                    .content { margin-bottom: 8pt; white-space: pre-line; }
                  }
                </style>
              </head>
              <body>
                <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
                  <div style="text-align: center; margin-bottom: 40px;">
                    <h1>Liturgia do Culto</h1>
                    <p>${formatDate(liturgy.date)}</p>
                    <div style="display: flex; justify-content: center; gap: 40px; margin-top: 16px;">
                      <div>Pregador: <strong>${liturgy.preacher}</strong></div>
                      <div>Liturgo: <strong>${liturgy.liturgist}</strong></div>
                    </div>
                  </div>
                  
                  ${liturgy.sections
                    .filter(section => section.enabled)
                    .map(section => `
                      <div class="section">
                        <h2 class="section-title">${section.title}</h2>
                        
                        ${section.bibleReading ? `
                          <div class="label">Leitura Bíblica</div>
                          <div class="content">${section.bibleReading}</div>
                        ` : ''}
                        
                        ${section.prayer ? `
                          <div class="label">Oração</div>
                          <div class="content">${section.prayer}</div>
                        ` : ''}
                        
                        ${section.songs ? `
                          <div class="label">Cânticos</div>
                          <div class="content">${section.songs}</div>
                        ` : ''}
                        
                        ${section.sermon ? `
                          <div class="label">Sermão</div>
                          <div class="content"><strong>Tema:</strong> ${section.sermon.theme}</div>
                          <div class="content">${section.sermon.text}</div>
                          ${section.sermon.responseHymn ? `
                            <div class="label">Cântico em Resposta</div>
                            <div class="content">${section.sermon.responseHymn}</div>
                          ` : ''}
                        ` : ''}
                      </div>
                    `).join('')}
                </div>
              </body>
            </html>
          `}
        />
      )}
    </div>
  );
};

export default LiturgyEditor;
