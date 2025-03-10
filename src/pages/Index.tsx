import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileEdit, ArrowRight, Clock, List, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import { LiturgyType, useLiturgy } from '@/context/LiturgyContext';

const Index: React.FC = () => {
  const { liturgy, resetLiturgy, getSavedLiturgies } = useLiturgy();
  const [savedLiturgies, setSavedLiturgies] = React.useState<LiturgyType[]>([]);

  useEffect(() => {
    setSavedLiturgies(getSavedLiturgies());
  }, [getSavedLiturgies]);

  // Removemos o useEffect que estava chamando saveLiturgy
  // Isso evita o salvamento desnecessário ao carregar a página inicial

  const hasDraft = liturgy.preacher || liturgy.liturgist || liturgy.sections.some(
    section => section.bibleReading || section.prayer || section.songs || 
    (section.sermon && (section.sermon.text || section.sermon.theme))
  );

  return (
    <div className="min-h-screen bg-secondary/40 flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-5xl py-24 px-4">
        <div className="mb-16 text-center animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Editor de Liturgias Reformadas</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Crie e compartilhe liturgias para cultos reformados. 
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up opacity-90 hover:opacity-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileEdit className="h-5 w-5" />
                <span>Criar nova liturgia</span>
              </CardTitle>
              <CardDescription>
                Comece do zero com uma nova liturgia para o seu culto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">10 momentos litúrgicos personalizáveis</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Sugestões de leituras bíblicas e orações</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Salve e retome seu trabalho a qualquer momento</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                asChild 
                className="w-full gap-1"
                onClick={resetLiturgy}
              >
                <Link to="/edit">
                  Criar nova liturgia
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className={`transition-all duration-300 hover:shadow-md animate-slide-up delay-100 ${!hasDraft ? 'opacity-50 hover:opacity-70' : 'opacity-90 hover:opacity-100'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Continuar liturgia atual</span>
              </CardTitle>
              <CardDescription>
                {hasDraft 
                  ? `Continue editando a liturgia para ${liturgy.date || 'o culto'}.`
                  : 'Você não tem nenhuma liturgia em edição no momento.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasDraft ? (
                <div className="space-y-2">
                  {liturgy.preacher && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Pregador:</span> {liturgy.preacher}
                    </div>
                  )}
                  {liturgy.liturgist && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Liturgo:</span> {liturgy.liturgist}
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Seções habilitadas:</span> {liturgy.sections.filter(s => s.enabled).length} de 10
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Crie uma nova liturgia para começar a editar.
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                asChild 
                variant={hasDraft ? "default" : "outline"} 
                className="w-full gap-1"
                disabled={!hasDraft}
              >
                <Link to="/edit">
                  {hasDraft ? "Continuar editando" : "Nenhuma liturgia em edição"}
                  {hasDraft && <ArrowRight className="h-4 w-4 ml-1" />}
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Histórico de Liturgias</span>
              </CardTitle>
              <CardDescription>
                Visualize e edite liturgias salvas anteriormente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedLiturgies.length > 0 ? (
                <ul className="space-y-2">
                  {savedLiturgies.map(liturgy => (
                    <li key={liturgy.id} className="text-sm">
                      <Link to={`/view/${liturgy.id}`} className="hover:underline">
                        {liturgy.date ? new Date(liturgy.date).toLocaleDateString('pt-BR') : 'Sem data'} - {liturgy.preacher || 'Sem Pregador'}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Nenhuma liturgia salva encontrada.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="py-6 border-t text-center text-sm text-muted-foreground">
        <div className="container">
          <p>
            Editor de Liturgias Reformadas © {new Date().getFullYear()}{' '}
            <a href="https://weinne.teo.br" className="hover:underline">Weinne Santos</a>
            {' • '} 
            <Link to="/about" className="hover:underline">Sobre</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
