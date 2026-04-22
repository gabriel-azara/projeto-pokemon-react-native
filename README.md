# Pokédex App 📱⚡️

Um aplicativo móvel de Pokédex desenvolvido com **React Native** e **Expo**. Ele consome dados da [PokéAPI](https://pokeapi.co/) e oferece funcionalidades de busca, listagem infinita, mapa interativo com localização em tempo real e sistema de favoritos.

## 🚀 Como rodar o projeto

### Pré-requisitos
- Node.js instalado na sua máquina
- O aplicativo **Expo Go** instalado no seu celular (para testes físicos) ou um Emulador configurado (Android Studio / Xcode).

### Passo a passo

1. **Clone o repositório e instale as dependências:**
   # Navegue até a pasta do projeto
   ``
   cd projeto-pokemon-react-native
   ``
   
   # Instale as dependências do projeto
   ``
   npm install
   `` 

2. **Inicie o servidor de desenvolvimento do Expo:**
   ``
   npx expo start
   ``

3. **Rodando no celular ou emulador:**
   - **No celular físico:** Abra o app de Câmera (no iOS) ou o próprio app do Expo Go (no Android) e leia o QR Code que aparecerá no terminal.
   - **No emulador:** Pressione a tecla \`a\` no terminal para rodar no Android ou \`i\` para rodar no simulador do iOS.

---

## 🗺️ Visão Geral das Abas (Tabs)

O aplicativo é dividido em 3 telas principais, acessíveis pela barra de navegação inferior:

### 1. Pokédex (Lista)
A aba principal do app onde a mágica acontece.
- **Listagem Infinita:** Exibe os Pokémons em formato de cards. Ao rolar até o final da tela, ele carrega automaticamente a próxima leva para economizar dados e memória.
- **Busca por Nome:** Uma barra de pesquisa para você procurar exatamente aquele Pokémon que deseja.
- **Filtro por Tipo:** Uma lista horizontal rolável ("badges") que permite filtrar Pokémons pelo seu elemento (Fogo, Água, Grama, etc.).
- **Favoritos:** Cada card possui um ícone de coração. Ao clicar, o Pokémon é favoritado.

### 2. Mapa (Descoberta)
Uma aba interativa que utiliza os recursos de GPS do seu dispositivo.
- **Localização Real:** Solicita permissão de GPS e exibe a sua localização atual no mapa com um marcador nativo azul.
- **Pokémons Selvagens:** Gera 10 marcadores (pins vermelhos) aleatoriamente espalhados em um raio de até 4km ao seu redor, simulando a aparição de Pokémons selvagens.
- **Animações Dinâmicas:** Sempre que você entra nesta aba, a câmera faz uma animação automática dando zoom num dos Pokémons selvagens!
- **Controles de Câmera:** Botões dedicados na tela para dar *Zoom In*, *Zoom Out* e um botão para recentralizar o mapa instantaneamente na sua localização.

### 3. Favoritos
A sua coleção pessoal.
- **Armazenamento Local:** Lista todos os Pokémons que você clicou no "coração". Os dados são salvos no armazenamento local do aparelho (`AsyncStorage`), o que significa que seus favoritos continuam lá mesmo se você fechar e abrir o aplicativo novamente.
- **Gerenciamento Fácil:** Você pode desfavoritar qualquer Pokémon diretamente por essa tela, e ele sumirá da sua lista automaticamente.

---

## 🛠️ Tecnologias Utilizadas
- **React Native / Expo Router:** Base do projeto e navegação em abas.
- **@tanstack/react-query:** Gerenciamento poderoso do estado das requisições assíncronas para a PokéAPI (cache, repetição e paginação infinita).
- **react-native-maps & expo-location:** Para renderizar o mapa interativo e obter as coordenadas GPS.
- **@react-native-async-storage/async-storage:** Para salvar a lista de Pokémons favoritos persistentemente no dispositivo.
