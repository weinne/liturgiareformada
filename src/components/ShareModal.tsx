
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Printer } from 'lucide-react';
import { useLiturgy } from '@/context/LiturgyContext';
import { toast } from '@/components/ui/use-toast';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrint?: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onOpenChange, onPrint }) => {
  const { generateShareableLink } = useLiturgy();
  const [copied, setCopied] = useState(false);
  const [shareableLink, setShareableLink] = useState('');

  React.useEffect(() => {
    if (open) {
      setShareableLink(generateShareableLink());
      setCopied(false);
    }
  }, [open, generateShareableLink]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    
    toast({
      title: "Link copiado",
      description: "O link foi copiado para a área de transferência.",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Liturgia</DialogTitle>
          <DialogDescription>
            Use o link abaixo para compartilhar esta liturgia ou imprima-a diretamente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="share-link" className="sr-only">Link</Label>
            <Input
              id="share-link"
              value={shareableLink}
              readOnly
              className="font-mono text-sm"
            />
          </div>
          <Button size="sm" onClick={handleCopy} className="px-3">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copiar</span>
          </Button>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          
          {onPrint && (
            <Button variant="default" onClick={onPrint}>
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
