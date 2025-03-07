# Guia de Migração do React para Apps Nativos com Capacitor

Este guia descreve o processo para transformar um projeto React existente em aplicativos móveis nativos para Android e iOS usando Capacitor.

## Visão Geral do Capacitor

O Capacitor é uma ponte entre aplicações web e plataformas nativas, permitindo que aplicações web acessem recursos nativos dos dispositivos móveis. É uma excelente solução para projetos React pelas seguintes razões:

- **Integração perfeita com React**: Funciona com qualquer framework web moderno
- **Mantém sua base de código existente**: Não é necessário reescrever sua aplicação
- **API nativa unificada**: Acesso a recursos nativos através de uma API JavaScript consistente
- **Desenvolvido pela equipe do Ionic**: Tem respaldo de uma equipe experiente
- **Atualizado regularmente**: Suporte para os recursos mais recentes das plataformas móveis

## Passo a Passo para Implementação

### 1. Instalar Capacitor no projeto existente

```bash
cd c:\Users\MASTER\Dev\liturgiareformada

# Instalar as dependências do Capacitor
npm install @capacitor/core @capacitor/cli
```

### 2. Inicializar o Capacitor no projeto

```bash
npx cap init "Liturgia Reformada" "org.liturgiareformada.app" --web-dir="build"
```

> Nota: Ajuste o `--web-dir` para a pasta onde o seu build de produção do React é gerado (geralmente "build" para projetos React criados com Create React App, "dist" para outros).

### 3. Fazer o build do seu projeto React

```bash
# Se você usa Create React App ou similar
npm run build
```

### 4. Adicionar plataformas desejadas

```bash
# Adicionar Android
npx cap add android

# Adicionar iOS (requer um Mac)
npx cap add ios
```

### 5. Configurar recursos nativos

Edite o arquivo `capacitor.config.ts` (ou .json) para personalizar as configurações:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.liturgiareformada.app',
  appName: 'Liturgia Reformada',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;
```

### 6. Adicionar plugins do Capacitor para funcionalidades nativas

```bash
# Exemplo: Para adicionar suporte a armazenamento local
npm install @capacitor/storage

# Para compartilhamento
npm install @capacitor/share

# Para notificações push (se necessário)
npm install @capacitor/push-notifications
```

### 7. Sincronizar as mudanças com os projetos nativos

```bash
# Após qualquer alteração no seu código ou configuração:
npx cap copy
npx cap sync
```

### 8. Testar nos ambientes nativos

```bash
# Abrir no Android Studio
npx cap open android

# Abrir no Xcode (requer macOS)
npx cap open ios
```

## Fluxo de desenvolvimento com Capacitor

1. **Desenvolvimento**: Desenvolva normalmente usando seu fluxo React
2. **Teste no navegador**: Use `npm start` para testar no navegador
3. **Build**: Execute `npm run build` quando quiser atualizar o app nativo
4. **Sincronize**: Execute `npx cap copy` ou `npx cap sync` para atualizar os projetos nativos
5. **Teste nativo**: Abra os projetos nativos e execute no emulador ou dispositivo

## Desenvolvimento ágil com Live Reload

Para testar mais rapidamente as alterações em seu app React no dispositivo nativo:

```bash
npx cap run android -l --external
# ou
npx cap run ios -l --external
```

Isso iniciará um servidor de desenvolvimento e carregará seu app React diretamente do seu computador.

## Plugins Úteis para Considerar

- **@capacitor/camera**: Acesso à câmera e galeria de fotos
- **@capacitor/geolocation**: Acesso à localização geográfica
- **@capacitor/network**: Informações sobre o estado da rede
- **@capacitor/app**: Informações sobre o estado do aplicativo e manipulação de eventos do ciclo de vida
- **@capacitor/local-notifications**: Envio de notificações locais
- **@capacitor/device**: Informações sobre o dispositivo

## Personalização da Aparência do App

### Ícones e Splash Screen

O Capacitor fornece uma ferramenta para gerar ícones e splash screens automaticamente:

```bash
npm install -D @capacitor/assets
npx capacitor-assets generate
```

### Configurando o tema e cores do App

Para Android, você pode modificar os arquivos em:
- `android/app/src/main/res/values/styles.xml`
- `android/app/src/main/res/values/colors.xml`

Para iOS, use o Xcode para modificar as configurações visuais.

## Publicação nas Lojas de Aplicativos

### Google Play Store

1. Gere um APK assinado no Android Studio
2. Crie uma conta de desenvolvedor no Google Play Console
3. Siga o processo de submissão do Google Play

### Apple App Store

1. Gere um arquivo IPA assinado no Xcode
2. Crie uma conta de desenvolvedor na Apple
3. Use o App Store Connect para publicar seu aplicativo

## Recursos Adicionais

- [Documentação oficial do Capacitor](https://capacitorjs.com/docs)
- [Plugins do Capacitor](https://capacitorjs.com/docs/plugins)
- [Comunidade do Capacitor](https://github.com/ionic-team/capacitor/discussions)

## Solução de Problemas Comuns

### Erro ao sincronizar com Android

Se você encontrar erros durante a sincronização com o Android, verifique:
- A versão do SDK do Android instalada
- As variáveis de ambiente JAVA_HOME e ANDROID_HOME

### Erro ao compilar para iOS

Para problemas com iOS:
- Verifique se o CocoaPods está instalado corretamente
- Execute `pod install` dentro da pasta `ios/App`
- Certifique-se de que o certificado de desenvolvedor está configurado