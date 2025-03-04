
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useLiturgy } from '@/context/LiturgyContext';

const LiturgyForm: React.FC = () => {
  const { liturgy, updateLiturgy } = useLiturgy();

  return (
    <Card className="mb-6 animate-slide-up">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="preacher">Nome do Pregador</Label>
            <Input
              id="preacher"
              value={liturgy.preacher}
              onChange={(e) => updateLiturgy({ preacher: e.target.value })}
              placeholder="Insira o nome do pregador"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="liturgist">Nome do Liturgo</Label>
            <Input
              id="liturgist"
              value={liturgy.liturgist}
              onChange={(e) => updateLiturgy({ liturgist: e.target.value })}
              placeholder="Insira o nome do liturgo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Data do Culto</Label>
            <Input
              id="date"
              type="date"
              value={liturgy.date}
              onChange={(e) => updateLiturgy({ date: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiturgyForm;
