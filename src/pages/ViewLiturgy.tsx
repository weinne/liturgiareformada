import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { LiturgyType, useLiturgy } from '@/context/LiturgyContext';
import LiturgySection from '@/components/LiturgySection';
import ShareModal from '@/components/ShareModal';
import PrintLayout from '@/components/PrintLayout';
import { formatDate } from '@/utils/liturgyUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';

const ViewLiturgy: React.FC = () => {
  const { liturgyId } = useParams<{ liturgyId: string }>();
  const { loadLiturgyById, isLoading } = useLiturgy();
  const [currentLiturgy, setCurrentLiturgy] = useState<LiturgyType | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const navigate = useNavigate();
  const printFrameRef = useRef<HTMLIFrameElement>(null);
  const loadedLiturgies = useRef<{[id: string]: boolean}>({});
  
  useEffect(() => {
    if (!liturgyId) return;
    
    // Verifique se já carregamos essa liturgia específica
    if (loadedLiturgies.current[liturgyId]) return;
    
    const fetchLiturgy = async () => {
      loadedLiturgies.current[liturgyId] = true; // Marque como carregada
      
      try {
        const liturgy = await loadLiturgyById(liturgyId);
        if (liturgy) {
          setCurrentLiturgy(liturgy);
        } else {
          toast({
            title: "Liturgia não encontrada",
            description: "A liturgia que você está tentando acessar não existe ou foi removida.",
            variant: "destructive"
          });
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error("Erro ao carregar liturgia:", error);
        setTimeout(() => navigate('/'), 3000);
      }
    };

    fetchLiturgy();
  }, [liturgyId, navigate, loadLiturgyById]);

  // Limpar loadedLiturgies quando o ID muda
  useEffect(() => {
    loadedLiturgies.current = {};
  }, [liturgyId]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      if (printFrameRef.current?.contentWindow) {
        printFrameRef.current.contentWindow.print();
      }
    }, 500);
  };
  
  // Ocultar o iframe de impressão quando a impressão terminar
  const handleAfterPrint = () => {
    setIsPrinting(false);
    setIsShareModalOpen(false);
  };

  useEffect(() => {
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary/40">
        <Header showBackButton onShareClick={() => setIsShareModalOpen(true)} />
        
        <main className="container max-w-4xl py-24 px-4">
          <div className="text-center mb-8 animate-pulse">
            <Skeleton className="h-10 w-64 mx-auto mb-2" />
            <Skeleton className="h-6 w-40 mx-auto" />
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!currentLiturgy) {
    return (
      <div className="min-h-screen bg-secondary/40">
        <Header showBackButton />
        
        <main className="container max-w-4xl py-24 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Liturgia não encontrada</h1>
            <p className="text-muted-foreground mb-8">
              A liturgia que você está tentando acessar não está disponível ou foi removida.
              Você será redirecionado em alguns segundos.
            </p>
            <Button onClick={() => navigate('/')}>Voltar para a página inicial</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-secondary/40">
        <Header showBackButton onShareClick={() => setIsShareModalOpen(true)} />
        
        <main className="container max-w-4xl py-24 px-4">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Liturgia do Culto</h1>
            <p className="text-lg text-muted-foreground">{formatDate(currentLiturgy.date)}</p>
            
            <div className="flex justify-center items-center space-x-6 mt-4 text-sm">
              <div>
                <span className="text-muted-foreground">Pregador:</span>{' '}
                <span className="font-medium">{currentLiturgy.preacher}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Liturgo:</span>{' '}
                <span className="font-medium">{currentLiturgy.liturgist}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 animate-fade-in delay-100">
            {currentLiturgy.sections
              .filter(section => section.enabled)
              .map(section => (
                <LiturgySection key={section.id} section={section} />
              ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <Button 
              variant="outline" 
              className="animate-fade-in delay-200"
              onClick={() => setIsShareModalOpen(true)}
            >
              Compartilhar ou imprimir
            </Button>
          </div>
        </main>
      </div>
      
      <ShareModal
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        onPrint={handlePrint}
        liturgy={currentLiturgy} // Passa a liturgia atual como prop
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
                <title>Liturgia - ${currentLiturgy.date || 'Sem data'}</title>
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
                    .content { margin-bottom: 8pt; }
                  }
                </style>
              </head>
              <body>
                <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
                  <div style="text-align: center; margin-bottom: 40px;">
                    <h1>Liturgia do Culto</h1>
                    <p>${formatDate(currentLiturgy.date)}</p>
                    <div style="display: flex; justify-content: center; gap: 40px; margin-top: 16px;">
                      <div>Pregador: <strong>${currentLiturgy.preacher}</strong></div>
                      <div>Liturgo: <strong>${currentLiturgy.liturgist}</strong></div>
                    </div>
                  </div>
                  
                  ${currentLiturgy.sections
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
    </>
  );
};

export default ViewLiturgy;
