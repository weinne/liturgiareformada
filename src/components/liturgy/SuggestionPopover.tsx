
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';

interface SuggestionPopoverProps {
  icon: React.ReactNode;
  title: string;
  align?: 'start' | 'center' | 'end';
  width?: string;
  children: React.ReactNode;
}

const SuggestionPopover: React.FC<SuggestionPopoverProps> = ({ 
  icon, 
  title, 
  align = 'end', 
  width = 'w-60',
  children 
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          {icon}
          <span>{title}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className={`${width} max-h-[80vh] overflow-hidden`}>
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default SuggestionPopover;
