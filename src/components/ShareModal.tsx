import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Printer, Cloud } from 'lucide-react';
import { useLiturgy } from '@/context/LiturgyContext';
import { toast } from '@/components/ui/use-toast';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrint?: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onOpenChange, onPrint }) => {
  const { generateShareableLink, isLoading } = useLiturgy();
  const [copied, setCopied] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);

  // Função para gerar link, memoizada com useCallback
  const generateLink = useCallback(async () => {
    if (linkGenerated && shareableLink) return; // Evita regeneração se já tiver um link
    
    setIsGeneratingLink(true);
    try {
      const link = await generateShareableLink();
      if (link) {
        setShareableLink(link);
        setLinkGenerated(true);
      }
    } catch (error) {
      console.error("Erro ao gerar link:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link de compartilhamento.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLink(false);
    }
  }, [generateShareableLink, linkGenerated, shareableLink]);

  // Effect separado apenas para controlar a geração do link
  useEffect(() => {
    if (open && !linkGenerated) {
      generateLink();
      setCopied(false);
    }
  }, [open, linkGenerated, generateLink]);

  const handleCopy = () => {
    if (!shareableLink) return;
    
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    
    toast({
      title: "Link copiado",
      description: "O link foi copiado para a área de transferência.",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Não resetamos o linkGenerated aqui para evitar regeneração desnecessária
    // Somente resetamos se for necessário gerar um novo link na próxima vez
  };

  // Reset completo ao abrir com nova liturgia
  const handleReset = () => {
    setLinkGenerated(false);
    setShareableLink('');
    setCopied(false);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Liturgia</DialogTitle>
          <DialogDescription>
            A liturgia será salva na nuvem e o link poderá ser compartilhado com qualquer pessoa.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="share-link" className="sr-only">Link</Label>
            <Input
              id="share-link"
              value={isGeneratingLink || isLoading ? "Gerando link..." : shareableLink}
              readOnly
              className="font-mono text-sm"
              disabled={isGeneratingLink || isLoading}
            />
          </div>
          <Button 
            size="sm" 
            onClick={handleCopy} 
            className="px-3"
            disabled={isGeneratingLink || isLoading || !shareableLink}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copiar</span>
          </Button>
        </div>

        {(isGeneratingLink || isLoading) && (
          <div className="flex items-center justify-center text-sm text-muted-foreground py-2">
            <Cloud className="h-4 w-4 mr-2 animate-pulse" />
            Salvando liturgia na nuvem...
          </div>
        )}
        
        <div className="text-sm text-muted-foreground mt-2">
          {shareableLink && "Este link funciona para qualquer pessoa, mesmo que não tenha o aplicativo instalado."}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
          
          {linkGenerated && onPrint && (
            <Button variant="default" onClick={onPrint} disabled={isGeneratingLink || isLoading}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

function Label({ htmlFor, className, children }: { htmlFor: string, className?: string, children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none ${className || ''}`}>
      {children}
    </label>
  );
}

export default ShareModal;
