import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share2, CheckCircle2, Facebook } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { QRCodeCanvas } from 'qrcode.react';
import { LiturgyType } from '@/context/LiturgyContext';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liturgy: LiturgyType;
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onOpenChange, liturgy }) => {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}/view/${liturgy.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para área de transferência."
      });
      
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Liturgia - ${liturgy.date}`,
          text: `Liturgia do culto - ${liturgy.date}`,
          url: shareUrl
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      handleCopy();
    }
  };

  const handleFacebookShare = () => {
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbShareUrl, 'facebook-share', 'width=580,height=296');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Liturgia</DialogTitle>
          <DialogDescription>
            Compartilhe esta liturgia com a congregação
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="py-4">
            <div className="flex items-center space-x-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button variant="secondary" size="sm" onClick={handleCopy} className="shrink-0">
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="mt-6 flex flex-col gap-4">
              <Button onClick={handleShare} className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
              <Button variant="outline" onClick={handleFacebookShare} className="w-full">
                <Facebook className="mr-2 h-4 w-4" />
                Compartilhar no Facebook
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="qrcode" className="flex flex-col items-center py-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeCanvas value={shareUrl} size={200} />
            </div>
            <p className="text-sm text-center mt-4 text-muted-foreground">
              Escaneie o QR code com a câmera do celular para abrir a liturgia
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
