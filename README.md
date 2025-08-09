# 📅 Agendify - Frontend

**Agendify** é um aplicativo mobile desenvolvido em **React Native** com **TypeScript**, voltado para o gerenciamento de eventos, usuários e calendário.  
O app permite criar, visualizar, editar e excluir **Eventos**, **Eventos Pendentes**, **Usuários** e **Usuários Pendentes**, além de oferecer funcionalidades de **Login**, **Logout** e **Cadastro** de usuários.  
O projeto é otimizado para ser compilado e exportado para **Android (.apk)** utilizando **Android Studio**.

---

## 🚀 Funcionalidades

### 📆 Eventos
- Criar, visualizar, editar e excluir eventos.
- Gerenciar conflitos de agendamento.
- Visualizar detalhes de eventos.

### ⏳ Eventos Pendentes
- Aprovar ou rejeitar eventos enviados para validação.
- Editar ou remover eventos pendentes.
- Resolver conflitos de eventos pendentes.

### 👤 Usuários
- CRUD completo de usuários.
- Visualizar perfil e detalhes.
- Editar informações do usuário.

### 🕒 Usuários Pendentes
- Aprovar ou rejeitar novos cadastros.
- Editar dados antes da aprovação.

### 📅 Calendário
- Visualização de eventos no calendário.
- Navegação por dias, semanas e meses.
- Integração com dados de eventos e eventos pendentes.

### 🔐 Autenticação
- Login e Logout.
- Cadastro de novos usuários.
- Controle de acesso baseado em permissões.

---

## 📂 Estrutura de Pastas

```

src/
├── api/                 # Integração com a API backend via Fetch API
├── components/          # Componentes reutilizáveis
├── contexts/            # Contextos globais (Auth, Tema, etc.)
├── hooks/               # Hooks customizados para formulários e lógica
├── routes/              # Configuração de navegação
├── screens/             # Telas do aplicativo
├── styles/              # Estilos globais
└── App.tsx              # Arquivo principal

````

---

## 🛠️ Tecnologias Utilizadas

- **React Native** (com **TypeScript**)
- **Context API** para gerenciamento de estado global
- **React Navigation** para rotas
- **Fetch API** para requisições HTTP
- **Styled Components** / Stylesheets para estilização
- **Android Studio** para build e exportação `.apk`

---

## 📦 Como Rodar o Projeto

### Pré-requisitos
- **Node.js** (>= 18)
- **npm** ou **yarn**
- **Java JDK** (>= 17)
- **Android Studio** (com SDK configurado)
- **Emulador Android** ou dispositivo físico

### Passos para execução
```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/agendify-frontend.git

# Entrar na pasta
cd agendify-frontend

# Instalar dependências
npm install
# ou
yarn install

# Rodar no emulador/dispositivo
npx react-native run-android
````

---

## 📤 Exportando .apk pelo Android Studio

1. Abra o projeto no **Android Studio** (`/android`).
2. Vá em **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. O `.apk` será gerado na pasta `android/app/build/outputs/apk/release/`.
4. Transfira para o dispositivo e instale.

---

## 🤝 Contribuindo

1. Faça um **fork** do projeto.
2. Crie uma branch para sua feature:
   `git checkout -b minha-feature`
3. Commit suas alterações:
   `git commit -m 'Minha nova feature'`
4. Envie para o repositório remoto:
   `git push origin minha-feature`
5. Abra um **Pull Request**.

---

## 📜 Licença

Este projeto está sob a licença MIT.
Sinta-se livre para usar, modificar e distribuir.

---

💡 *Agendify - Simplificando a organização do seu tempo!*
