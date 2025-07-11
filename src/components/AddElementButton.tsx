import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, BookOpen, Church, Music, Users, Crown, MessageSquare, Heart, Star, Type } from 'lucide-react';
import { ElementType, useLiturgy } from '@/context/LiturgyContext';

const AddElementButton: React.FC = () => {
  const { addSection } = useLiturgy();

  const elementOptions = [
    { type: 'bibleReading' as ElementType, label: 'Leitura Bíblica', icon: BookOpen },
    { type: 'prayer' as ElementType, label: 'Oração', icon: Church },
    { type: 'hymn' as ElementType, label: 'Hino/Cântico', icon: Music },
    { type: 'lordsSupper' as ElementType, label: 'Ceia do Senhor', icon: Heart },
    { type: 'baptism' as ElementType, label: 'Batismo', icon: Users },
    { type: 'baptismProfession' as ElementType, label: 'Batismo e Profissão de Fé', icon: Users },
    { type: 'profession' as ElementType, label: 'Profissão de Fé', icon: Users },
    { type: 'preaching' as ElementType, label: 'Pregação da Palavra', icon: MessageSquare },
    { type: 'blessing' as ElementType, label: 'Bênção', icon: Crown },
    { type: 'custom' as ElementType, label: 'Personalizado', icon: Star },
    { type: 'title' as ElementType, label: 'Título', icon: Type },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Elemento Litúrgico
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {elementOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <DropdownMenuItem
              key={option.type}
              onClick={() => addSection(option.type)}
              className="cursor-pointer"
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddElementButton;