
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { GripVertical } from 'lucide-react';

interface SectionHeaderProps {
  id: string;
  title: string;
  enabled: boolean;
  onToggle: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ id, title, enabled, onToggle }) => {
  return (
    <CardHeader className="pb-2 flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="cursor-move">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor={`enable-${id}`} className="text-sm font-normal">
          {enabled ? 'Habilitado' : 'Desabilitado'}
        </Label>
        <Switch
          id={`enable-${id}`}
          checked={enabled}
          onCheckedChange={onToggle}
        />
      </div>
    </CardHeader>
  );
};

export default SectionHeader;
