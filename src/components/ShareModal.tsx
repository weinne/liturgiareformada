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
import { Check, Copy, Printer, Cloud, CloudOff } from 'lucide-react';
import { useLiturgy, LiturgyType } from '@/context/LiturgyContext';
import { toast } from '@/components/ui/use-toast';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrint?: () => void;
  liturgy?: LiturgyType; // Adiciona a liturgia como prop opcional
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onOpenChange, onPrint, liturgy }) => {
  const { syncStatus, forceSyncToCloud } = useLiturgy();
  const [copied, setCopied] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Usar o generateLink modificado que recebe a liturgia como parâmetro
  const generateLink = useCallback(async () => {
    if (!liturgy || (linkGenerated && shareableLink)) return;
    
    setIsLoading(true);
    
    try {
      // Garantir que a liturgia está sincronizada antes de gerar o link
      // Não mostrar notificação aqui, pois poderia ser duplicada
      if (syncStatus === 'error' || syncStatus === 'pending') {
        await forceSyncToCloud(false);
      }
      
      // Se a sincronização foi bem-sucedida, gera o link da visualização
      if (syncStatus === 'synced' || syncStatus === 'syncing') {
        const baseLink = `${window.location.origin}/#/view/${liturgy.id}`;
        setShareableLink(baseLink);
        setLinkGenerated(true);
      } else {
        toast({
          title: "Sincronização pendente",
          description: "Aguarde a sincronização da liturgia para gerar o link de compartilhamento.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao gerar link:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link de compartilhamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [liturgy, linkGenerated, shareableLink, syncStatus, forceSyncToCloud]);

  useEffect(() => {
    // Só gera link se tudo estiver ok e tivermos uma liturgia
    if (open && !linkGenerated && !isLoading && liturgy) {
      generateLink();
      setCopied(false);
    }
    
    // Reset quando o modal fechar
    if (!open) {
      setLinkGenerated(false);
      setShareableLink('');
      setCopied(false);
    }
  }, [open, liturgy, linkGenerated, isLoading, generateLink]);

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
            {syncStatus === 'synced' 
              ? "A liturgia está sincronizada na nuvem. Compartilhe o link abaixo."
              : "É necessário sincronizar a liturgia antes de compartilhar."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="share-link" className="sr-only">Link</Label>
            <Input
              id="share-link"
              value={isLoading ? "Gerando link..." : shareableLink || "Sincronize primeiro para gerar o link"}
              readOnly
              className="font-mono text-sm"
              disabled={isLoading || syncStatus !== 'synced'}
            />
          </div>
          <Button 
            size="sm" 
            onClick={handleCopy} 
            className="px-3"
            disabled={isLoading || !shareableLink}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copiar</span>
          </Button>
        </div>

        {syncStatus !== 'synced' && (
          <div className="flex items-center justify-center text-sm text-muted-foreground py-4">
            {syncStatus === 'syncing' ? (
              <>
                <Cloud className="h-4 w-4 mr-2 animate-pulse" />
                Sincronizando liturgia...
              </>
            ) : (
              <Button 
                onClick={() => forceSyncToCloud(true).then(() => generateLink())} 
                variant="outline"
                className="w-full"
              >
                <CloudOff className="h-4 w-4 mr-2" />
                Sincronizar com a nuvem
              </Button>
            )}
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
            <Button variant="default" onClick={onPrint} disabled={isLoading}>
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
