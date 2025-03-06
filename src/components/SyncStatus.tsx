import React from 'react';
import { useLiturgy, SyncStatus as SyncStatusType } from '@/context/LiturgyContext';
import { Cloud, CloudOff, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SyncStatusProps {
  className?: string;
}

const statusConfig = {
  synced: {
    icon: Check,
    color: 'text-green-500',
    text: 'Sincronizado',
    tooltip: 'Todas as alterações foram salvas na nuvem'
  },
  syncing: {
    icon: RefreshCw,
    color: 'text-amber-500',
    text: 'Sincronizando...',
    tooltip: 'Salvando alterações na nuvem'
  },
  pending: {
    icon: RefreshCw,
    color: 'text-amber-500',
    text: 'Pendente',
    tooltip: 'Aguardando para sincronizar'
  },
  error: {
    icon: CloudOff,
    color: 'text-red-500',
    text: 'Não sincronizado',
    tooltip: 'Não foi possível salvar na nuvem'
  }
};

const SyncStatus: React.FC<SyncStatusProps> = ({ className = '' }) => {
  const { syncStatus, forceSyncToCloud } = useLiturgy();
  const { icon: Icon, color, text, tooltip } = statusConfig[syncStatus];
  
  const handleClick = async () => {
    if (syncStatus === 'error' || syncStatus === 'pending') {
      // Mostrar notificação apenas quando o usuário clica explicitamente
      await forceSyncToCloud(true);
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center gap-1.5 h-8 px-2 ${className}`}
            onClick={handleClick}
            disabled={syncStatus === 'synced' || syncStatus === 'syncing'}
          >
            <Icon className={`h-4 w-4 ${color} ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            <span className="text-xs font-medium">{text}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
          {(syncStatus === 'error' || syncStatus === 'pending') && 
            <p className="text-xs">Clique para tentar sincronizar novamente</p>
          }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SyncStatus;
