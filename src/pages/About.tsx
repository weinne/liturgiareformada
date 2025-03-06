import React from 'react';
import Header from '@/components/Header';
import { BookOpen, ListChecks, Code, HelpCircle, Mail, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showBackButton />
      
      <main className="flex-1 container max-w-4xl py-28 px-6">
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-5">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Sobre o Editor de Liturgias</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Uma ferramenta para facilitar a criação e compartilhamento de liturgias reformadas
          </p>
        </div>
        
        <div className="space-y-16 animate-slide-up">
          <section className="prose prose-slate dark:prose-invert max-w-none">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-secondary rounded-lg">
                <BookOpen className="h-5 w-5 text-foreground/80" />
              </div>
              <h2 className="text-2xl font-semibold mt-0 mb-0">Nosso Propósito</h2>
            </div>
            <div className="pl-[46px]">
              <p className="text-lg leading-relaxed text-foreground/90">
                O Editor de Liturgias Reformadas foi desenvolvido para auxiliar pastores, liturgistas e líderes de igreja 
                na preparação de liturgias para cultos reformados. Nosso objetivo é proporcionar uma ferramenta simples e 
                eficiente que facilite o trabalho de organização dos momentos litúrgicos, permitindo a criação de liturgias 
                que sigam a tradição reformada.
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-12 mb-2">
              <div className="p-2 bg-secondary rounded-lg">
                <ListChecks className="h-5 w-5 text-foreground/80" />
              </div>
              <h2 className="text-2xl font-semibold mt-0 mb-0">Recursos</h2>
            </div>
            <div className="pl-[46px]">
              <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2 mt-4">
                <li className="flex items-center gap-2 text-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                  Criação de liturgias personalizáveis
                </li>
                <li className="flex items-center gap-2 text-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                  Sugestões de leituras bíblicas
                </li>
                <li className="flex items-center gap-2 text-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                  Inclusão de hinos e cânticos
                </li>
                <li className="flex items-center gap-2 text-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                  Informações sobre o sermão
                </li>
                <li className="flex items-center gap-2 text-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                  Compartilhamento de liturgias
                </li>
                <li className="flex items-center gap-2 text-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                  Armazenamento local
                </li>
                <li className="flex items-center gap-2 text-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                  Layout para impressão
                </li>
                <li className="flex items-center gap-2 text-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary block"></span>
                  Funcionamento offline (PWA)
                </li>
              </ul>
            </div>
            
            <div className="flex items-center gap-3 mt-12 mb-2">
              <div className="p-2 bg-secondary rounded-lg">
                <Code className="h-5 w-5 text-foreground/80" />
              </div>
              <h2 className="text-2xl font-semibold mt-0 mb-0">Desenvolvimento</h2>
            </div>
            <div className="pl-[46px]">
              <p className="text-lg leading-relaxed text-foreground/90">
                Este aplicativo foi desenvolvido por Weinne Santos como uma ferramenta de código aberto para 
                a comunidade reformada. Utilizamos tecnologias modernas como React, TypeScript e TailwindCSS 
                para proporcionar uma experiência de usuário agradável e responsiva.
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="text-xs px-3 py-1 bg-secondary rounded-full">React</div>
                <div className="text-xs px-3 py-1 bg-secondary rounded-full">TypeScript</div>
                <div className="text-xs px-3 py-1 bg-secondary rounded-full">TailwindCSS</div>
                <div className="text-xs px-3 py-1 bg-secondary rounded-full">Vite</div>
                <div className="text-xs px-3 py-1 bg-secondary rounded-full">PWA</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-12 mb-2">
              <div className="p-2 bg-secondary rounded-lg">
                <HelpCircle className="h-5 w-5 text-foreground/80" />
              </div>
              <h2 className="text-2xl font-semibold mt-0 mb-0">Como Usar</h2>
            </div>
            <div className="pl-[46px]">
              <p className="text-lg leading-relaxed text-foreground/90">
                Para começar, basta criar uma nova liturgia na página inicial. Adicione as informações básicas 
                como pregador, liturgista e data, e então personalize cada momento litúrgico conforme necessário. 
                Quando finalizar, você pode salvar, imprimir ou compartilhar a liturgia criada.
              </p>
              
              <div className="mt-6">
                <Button asChild className="rounded-full" size="lg">
                  <Link to="/edit">
                    Começar a criar uma liturgia
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-secondary/50 p-6 rounded-xl mt-16">
              <h2 className="text-2xl font-semibold mb-4">Contribuições</h2>
              <p className="text-lg leading-relaxed text-foreground/90 mb-6">
                Contribuições são bem-vindas! Se você encontrou um bug ou tem uma sugestão para melhorar o aplicativo, 
                por favor entre em contato ou envie um pull request para o nosso repositório no GitHub.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:contato@weinne.teo.br" 
                   className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>contato@weinne.teo.br</span>
                </a>
                
                <a href="https://github.com/weinne/liturgiareformada" 
                   className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                  <Github className="h-4 w-4" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="py-8 border-t text-center text-sm text-muted-foreground">
        <div className="container">
          <p>
            Editor de Liturgias Reformadas © {new Date().getFullYear()}{' '}
            <a href="https://weinne.teo.br" className="text-primary hover:underline">Weinne Santos</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
