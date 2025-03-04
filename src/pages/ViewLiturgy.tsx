
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import LiturgySection from '@/components/LiturgySection';
import ShareModal from '@/components/ShareModal';
import PrintLayout from '@/components/PrintLayout';
import { Button } from '@/components/ui/button';
import { Printer, Edit } from 'lucide-react';
import { useLiturgy } from '@/context/LiturgyContext';
import { getLiturgyById, formatDate } from '@/utils/liturgyUtils';
import { LiturgyType } from '@/context/LiturgyContext';

const ViewLiturgy: React.FC = () => {
  const { liturgyId } = useParams<{ liturgyId: string }>();
  const { liturgy: currentLiturgy, updateLiturgy } = useLiturgy();
  const [liturgy, setLiturgy] = useState<LiturgyType | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (liturgyId) {
      const loadedLiturgy = liturgyId === currentLiturgy.id 
        ? currentLiturgy 
        : getLiturgyById(liturgyId);
      
      if (loadedLiturgy) {
        setLiturgy(loadedLiturgy);
      } else {
        navigate('/not-found');
      }
    }
  }, [liturgyId, currentLiturgy, navigate]);

  const handleEdit = () => {
    if (liturgy && liturgy.id !== currentLiturgy.id) {
      // Load this liturgy into the current editing context
      updateLiturgy(liturgy);
    }
    navigate('/edit');
  };

  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  if (!liturgy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  const enabledSections = liturgy.sections.filter(section => section.enabled);

  if (isPrintMode) {
    return <PrintLayout liturgy={liturgy} />;
  }

  return (
    <div className="min-h-screen bg-secondary/40 flex flex-col">
      <Header showBackButton onShareClick={() => setShareModalOpen(true)} />
      
      <main className="flex-1 container max-w-3xl py-24 px-4">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Liturgia do Culto</h2>
            <p className="text-muted-foreground">{formatDate(liturgy.date)}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" />
              Imprimir
            </Button>
          </div>
        </div>
        
        <div className="glass-panel rounded-lg p-6 mb-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Pregador</p>
              <p className="font-medium">{liturgy.preacher || "Não especificado"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Liturgo</p>
              <p className="font-medium">{liturgy.liturgist || "Não especificado"}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {enabledSections.map((section) => (
            <LiturgySection key={section.id} section={section} />
          ))}
        </div>
      </main>
      
      <ShareModal 
        open={shareModalOpen} 
        onOpenChange={setShareModalOpen}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default ViewLiturgy;
