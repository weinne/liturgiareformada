
import React, { useState } from 'react';
import Header from '@/components/Header';
import LiturgyForm from '@/components/LiturgyForm';
import LiturgySectionEdit from '@/components/LiturgySectionEdit';
import ShareModal from '@/components/ShareModal';
import { Button } from '@/components/ui/button';
import { useLiturgy } from '@/context/LiturgyContext';
import { useNavigate } from 'react-router-dom';
import { Eye, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const LiturgyEditor: React.FC = () => {
  const { liturgy, updateLiturgy } = useLiturgy();
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
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Momentos do Culto 
            <span className="text-sm font-normal ml-2 text-muted-foreground">(arraste para reorganizar)</span>
          </h2>
          
          <div className="space-y-6">
            {liturgy.sections.map(section => (
              <LiturgySectionEdit 
                key={section.id} 
                section={section} 
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
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
