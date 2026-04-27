# 🃏 Memory Game — Pokémon & Star Wars Edition

Jogo da memória em React Native com Expo Router, temas dinâmicos e 3 níveis progressivos.

## ✨ Funcionalidades

- **2 temas completos**: Pokémon (SVGs via PokeAPI) e Star Wars (fotos via SWAPI Gallery)
- **UI temática total**: cores, fontes, gradientes e elementos visuais mudam com o tema
- **3 níveis progressivos**:
  - Nível 1 — 6 pares, grade 3×4 (Iniciante)
  - Nível 2 — 10 pares, grade 4×5 (Intermediário)  
  - Nível 3 — 15 pares, grade 5×6 (Expert)
- **Sem repetição de imagens**: imagens já usadas em níveis anteriores não reaparecem
- **Expo Router com Tabs + Stack navigation**
- **Animações**: flip 3D das cartas, confetti na tela de conclusão, barra de progresso
- **Timer e contador de jogadas** em tempo real
- **Tela de placar** com estatísticas acumuladas
- **Fontes customizadas**: Orbitron + Press Start 2P

## 🚀 Como rodar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli` (opcional, funciona com npx)
- App **Expo Go** no celular (iOS/Android)

### Instalação

```bash
# Instalar dependências
npm install

# Rodar o projeto
npx expo start
```

Escaneie o QR Code com o Expo Go para rodar no celular.

### Rodar em emulador/simulador

```bash
# Android
npx expo start --android

# iOS (macOS apenas)
npx expo start --ios

# Web
npx expo start --web
```

## 📁 Estrutura do Projeto

```
memory-game/
├── app/
│   ├── _layout.tsx          # Root layout com providers
│   ├── index.tsx            # Tela de seleção de tema
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab navigator
│   │   ├── index.tsx        # Home — seleção de nível
│   │   ├── scores.tsx       # Placar / estatísticas
│   │   └── settings.tsx     # Configurações / troca de tema
│   └── game/
│       ├── level.tsx        # Tela do jogo em si
│       └── complete.tsx     # Tela de nível completo
├── components/
│   └── MemoryCard.tsx       # Carta com animação de flip 3D
├── constants/
│   └── themes.ts            # Temas, cores, URLs de imagens, níveis
├── context/
│   ├── ThemeContext.tsx     # Contexto global do tema
│   └── GameContext.tsx      # Contexto global do jogo
├── metro.config.js          # Config para suporte a SVG
├── babel.config.js
├── app.json
└── tsconfig.json
```

## 🎨 Temas

### ⚡ Pokémon
- Fundo escuro azul-navy
- Accent amarelo Pokémon (#FFCB05)
- Azul Pokébola (#3D7DCA)
- 1025 Pokémons disponíveis (SVG da PokeAPI)

### ⚔️ Star Wars
- Fundo preto espaço
- Accent amarelo Star Wars (#FFE81F)
- Dourado (#C0A030)
- 88 personagens disponíveis (SWAPI Gallery)

## 🔧 Tecnologias

| Tecnologia | Uso |
|---|---|
| Expo SDK 52 | Base do projeto |
| Expo Router v4 | Navegação (tabs + stack) |
| React Native Reanimated | Animações performáticas |
| React Native SVG | Renderização de SVGs (Pokémon) |
| Expo Linear Gradient | Gradientes de fundo |
| Expo Google Fonts | Orbitron + Press Start 2P |
| TypeScript | Tipagem estática |

## 🏗️ Arquitetura

- **ThemeContext**: gerencia o tema ativo globalmente, afeta todos os componentes
- **GameContext**: mantém o nível atual, pontuação, jogadas e IDs de imagens já usadas
- `getRandomUniqueIds()`: garante que imagens não se repitam entre níveis dentro da mesma sessão
- Cards são shuffled antes de serem renderizados
- Flip animation usa `rotateY` com `backfaceVisibility: 'hidden'` para o efeito 3D
