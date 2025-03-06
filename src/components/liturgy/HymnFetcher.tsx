import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Music, Search } from 'lucide-react';
import { getHymn, searchHymnsByTitle } from '@/services/hymnsService';
import { toast } from '@/hooks/use-toast';

interface HymnFetcherProps {
  onHymnSelect: (hymnText: string) => void;
}

const HymnFetcher: React.FC<HymnFetcherProps> = ({ onHymnSelect }) => {
  const [hymnNumber, setHymnNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{number: string, title: string}>>([]);

  // Pesquisa por título
  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = searchHymnsByTitle(searchQuery);
      setSearchResults(results.map(hymn => ({
        number: hymn.number.replace(/^0+/, ''),
        title: hymn.title
      })));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Inserir hino pelo número
  const handleInsertHymn = () => {
    if (!hymnNumber || isNaN(Number(hymnNumber))) {
      toast({
        title: "Número inválido",
        description: "Por favor, insira um número de hino válido",
        variant: "destructive"
      });
      return;
    }

    const hymnText = getHymn(hymnNumber);
    if (hymnText) {
      onHymnSelect(hymnText);
      toast({
        title: "Hino inserido",
        description: `NC ${hymnNumber} adicionado ao editor`,
      });
    } else {
      toast({
        title: "Hino não encontrado",
        description: `Não foi possível localizar o hino NC ${hymnNumber}`,
        variant: "destructive"
      });
    }
  };

  // Selecionar da lista de pesquisa
  const handleSelectHymn = (number: string) => {
    const hymnText = getHymn(number);
    if (hymnText) {
      onHymnSelect(hymnText);
      setSearchQuery('');
    }
  };

  return (
    <div className="flex gap-2 items-center mt-1">
      <Input
        type="text"
        placeholder="Nº do hino"
        value={hymnNumber}
        onChange={(e) => setHymnNumber(e.target.value)}
        className="w-24"
      />
      <Button 
        onClick={handleInsertHymn}
        size="sm"
        variant="outline"
      >
        <Music className="h-4 w-4 mr-1" />
        Inserir
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="ml-2">
            <Search className="h-4 w-4 mr-1" />
            Buscar título
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <Input 
              placeholder="Digite o título do hino" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div className="max-h-60 overflow-y-auto">
              {searchResults.length > 0 ? (
                <ul className="space-y-1">
                  {searchResults.map((result) => (
                    <li 
                      key={result.number}
                      className="py-1 px-2 hover:bg-slate-100 rounded cursor-pointer"
                      onClick={() => handleSelectHymn(result.number)}
                    >
                      <span className="font-medium">NC {result.number}</span> · {result.title}
                    </li>
                  ))}
                </ul>
              ) : (
                searchQuery.length > 2 && (
                  <p className="text-sm text-slate-500">Nenhum hino encontrado</p>
                )
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default HymnFetcher;
