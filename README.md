Workout Plan

Aplicativo web para gerenciamento de treinos, construído com Next.js, TailwindCSS, Firebase e React Hot Toast.
Compatível com deploy no GitHub Pages.

🌟 Features

Login e Registro de usuários (Firebase Auth)

Adição e gerenciamento de exercícios

Filtragem por músculos, partes do corpo e equipamentos

Sistema de notificações com toast (react-hot-toast)

Responsivo para desktop e mobile

Deploy estático no GitHub Pages

⚡ Tecnologias

Next.js 16

React 19

TailwindCSS 4

Firebase 12

React Hot Toast

ShadCN/UI Components

Lucide Icons

React Hook Form

Zod

🛠️ Setup Local

Clone o repositório:

git clone https://github.com/LeandroASLeite/my-v0-project.git
cd my-v0-project

Instale dependências:

npm install

Crie o arquivo .env.local na raiz do projeto com as variáveis de Firebase:

NEXT_PUBLIC_FIREBASE_API_KEY=SEU_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=SEU_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=SEU_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=SEU_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=SEU_MEASUREMENT_ID

Atenção: Use apenas NEXT*PUBLIC* pois essas variáveis vão para o front-end. Não exponha secrets de backend.

Rode o projeto em modo desenvolvimento:

npm run dev

O app ficará disponível em http://localhost:3000.

⚡ Scripts
Script Descrição
npm run dev Roda o app em desenvolvimento
npm run build Build da aplicação Next.js
npm run export Exporta versão estática para out/
npm run start Roda o app buildado
npm run deploy Build + export + deploy no GitHub Pages
🚀 Deploy no GitHub Pages

Instale gh-pages se ainda não:

npm install --save-dev gh-pages

Configure next.config.js com basePath e assetPrefix igual ao nome do seu repo:

const nextConfig = {
basePath: '/my-v0-project',
assetPrefix: '/my-v0-project/',
images: {
remotePatterns: [
{
protocol: "https",
hostname: "cdn.exercisedb.dev",
port: "",
pathname: "/w/images/**",
},
],
},
};
module.exports = nextConfig;

Suba o projeto para o GitHub (branch principal, exemplo: main):

git add .
git commit -m "Preparando deploy"
git push origin main

Faça o deploy no GitHub Pages:

npm run deploy

Isso vai criar a pasta out/ e subir para o branch gh-pages.

Seu app estará disponível em:
https://LeandroASLeite.github.io/my-v0-project/

🔧 Observações

GitHub Pages não suporta SSR, então todas as páginas devem ser estáticas ou resolvidas no front-end.

Rotas dinâmicas devem ser pré-renderizadas ou substituídas por query params.

Firebase Auth funciona no front-end, então não é necessário backend para autenticação básica.

📂 Estrutura de Pastas
/components # Componentes UI (Cards, Buttons, Modals, etc.)
/pages # Páginas estáticas
/services # Serviços (Firebase Auth, Firestore)
/public # Assets públicos
/styles # Tailwind e CSS

📌 Dicas

Atualize as variáveis de ambiente no .env.local quando mudar de projeto Firebase.

Para atualizar o deploy: npm run deploy novamente.

Use react-hot-toast para mensagens de sucesso/erro no front-end.
