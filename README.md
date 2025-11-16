# Windows Web OS

Sistema operacional estilo Windows rodando no navegador com Next.js, TypeScript, Tailwind CSS, Zustand, Framer Motion, PWA.

## Tecnologias
- Next.js 14 + TypeScript
- Tailwind CSS
- Zustand (estado de janelas e UI)
- react-draggable + re-resizable (arrastar/redimensionar)
- Framer Motion (animações)
- next-pwa (PWA / manifest / service worker)
- ESLint + Prettier

## Estrutura
```
/src
  /components
    /desktop
    /taskbar
    /window
  /apps
    /notes
    /files
    /settings
  /store
/pages
/public
  /icons
  manifest.json
```

## Scripts
- `npm run dev` – desenvolvimento
- `npm run build` – build produção
- `npm start` – servidor produção
- `npm run lint` – ESLint
- `npm run format` – Prettier

## Como iniciar
```bash
npm install
npm run dev
```
Abrir: http://localhost:3000 (ou 3001 se 3000 estiver em uso)

## Funcionalidades atuais
- Desktop com ícones (duplo clique abre apps)
- Barra de tarefas com janelas abertas
- Menu Start com abertura de apps
- Janelas: abrir, fechar, minimizar, maximizar, foco (zIndex), mover, redimensionar
- Animações básicas (Framer Motion) em janelas e menu Start

## Store (Zustand)
`windowsStore`: controla a lista de janelas e ações.
`uiStore`: estado global do Menu Start.

## PWA
`manifest.json` configurado. Service worker desativado em desenvolvimento (por configuração `next-pwa`). Adicionar ícones reais substituindo placeholders.

## Próximos Passos
- Persistir notas (localStorage ou backend)
- Gerenciador de arquivos real
- Temas / wallpapers dinâmicos
- Sistema de notificações
- Multi desktop virtual
- Integração backend (NestJS) para usuários e arquivos

## Qualidade / Lint
Use `npm run lint` para verificar regras. Ajustes feitos para evitar variáveis não usadas.

## Segurança / Vulnerabilidades
Rodar `npm audit` para detalhes; algumas dependências transientes (workbox, eslint) podem gerar avisos. Atualizar conforme necessário.

## Contribuição
Pull requests e sugestões são bem-vindos.

---
Projeto inicial configurado e funcional.
