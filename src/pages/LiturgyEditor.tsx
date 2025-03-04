
import React, { useState } from 'react';
import Header from '@/components/Header';
import LiturgyForm from '@/components/LiturgyForm';
import LiturgySectionEdit from '@/components/LiturgySectionEdit';
import ShareModal from '@/components/ShareModal';
import { Button } from '@/components/ui/button';
import { useLiturgy } from '@/context/LiturgyContext';
import { useNavigate } from 'react-router-dom';
import { Eye, ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const LiturgyEditor: React.FC = () => {
  const { liturgy } = useLiturgy();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    // Already saved automatically via context
    toast({
      title: "Liturgia salva",
      description: "Sua liturgia foi salva com sucesso.",
    });
  };

  const handlePreview = () => {
    navigate(`/view/${liturgy.id}`);
  };

  return (
    <div className="min-h-screen bg-secondary/40 flex flex-col">
      <Header showBackButton onShareClick={() => setShareModalOpen(true)} />
      
      <main className="flex-1 container max-w-3xl py-24 px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Informações do Culto</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Salvar
            </Button>
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-1" />
              Visualizar
            </Button>
          </div>
        </div>
        
        <LiturgyForm />
        
        <div className="mb-8 mt-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Momentos do Culto</h2>
          
          <div className="space-y-6">
            {liturgy.sections.map(section => (
              <LiturgySectionEdit key={section.id} section={section} />
            ))}
          </div>
        </div>
      </main>
      
      <ShareModal 
        open={shareModalOpen} 
        onOpenChange={setShareModalOpen} 
        onPrint={handlePreview}
      />
    </div>
  );
};

export default LiturgyEditor;
