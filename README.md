# Cafofo dos Peludos - Sistema de Adoção de Animais

O **Cafofo dos Peludos** é um sistema moderno para gerenciamento de resgates, cadastros de voluntários, adoções e relatórios para uma ONG de adoção de animais. 

A aplicação foi reestruturada de um modelo estático com armazenamento local para uma **arquitetura desacoplada baseada em API REST**, conectando-se a um banco de dados NoSQL em nuvem (**Cloud Firestore**) e com gerenciamento de sessões administrativas via **Firebase Authentication**.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React** (com **Vite** para build super rápida)
* **Axios** (para requisições assíncronas centralizadas à API)
* **Bootstrap 5** (estilização moderna e layout responsivo)
* **Lucide React** (biblioteca de ícones minimalistas de alta qualidade)

### Backend
* **Node.js** + **Express** (construção da API REST e controle de rotas)
* **Firebase Admin / SDK** (conexão e manipulação do banco Firestore)
* **CORS** (segurança nas chamadas entre origens diferentes)

---

## 🚀 Principais Recursos do Sistema

1. **Autenticação Segura (Firebase Auth)**:
   * Área administrativa protegida por rotas privadas.
   * Controle de sessão reativo com o estado de login persistido.

2. **CRUDs Completos no Firestore (Banco em Nuvem)**:
   * **Pets**: Criação, edição, exclusão e listagem de pets. Suporta upload de imagens com redimensionamento automático e compressão base64 inteligente (JPEG, qualidade 70%, reduzindo fotos para cerca de 20-50KB).
   * **Voluntários**: Cadastro público e área de gerenciamento administrativo em formato Grid de cards.
   * **Adoções**: Formulário interativo com modal de leitura e aceitação do Termo de Declaração para Adoção e controle administrativo de aprovação/rejeição.

3. **Inteligência de Banco de Dados e Regras**:
   * **IDs Sequenciais Numéricos**: O backend gera automaticamente chaves numéricas incrementais de forma legível no padrão sequencial (como `1`, `2`, `3...`), em vez das strings hash aleatórias nativas do Firestore.
   * **Sincronização Reativa**: Ao aprovar uma solicitação de adoção no painel administrativo, o status do pet correspondente é alterado automaticamente para "Adotado" no banco de dados.
   * **Auto-Seeding (Carga Inicial)**: Na inicialização, se o backend detectar que as coleções do banco estão vazias, ele insere automaticamente dados iniciais para que a aplicação nunca abra em branco.

4. **Painel de Relatório com JOIN Relacional**:
   * Simulação de uma operação `JOIN SQL` em memória, cruzando as tabelas de Adoções e Pets via chave estrangeira.
   * Gráficos com KPIs dinâmicos (Total de Pedidos, Aprovados, Pendentes, Rejeitados) e filtros avançados (pesquisa por nome de adotante, pet, justificativa ou status).

---

## ⚙️ Instalação e Execução

### Pré-requisitos
* Ter o **Node.js** instalado na máquina (versão 18 ou superior).

### 1. Preparação
Extraia o arquivo do projeto no computador. Em seguida, abra o terminal na pasta raiz da aplicação e instale as dependências de cada ambiente:

#### Instalar dependências do Backend:
```bash
cd backend
npm install
```

#### Instalar dependências do Frontend:
```bash
cd ../frontend
npm install
```

### 2. Rodando a Aplicação

#### Passo A: Iniciar o Servidor Backend (API)
No terminal do diretório `/backend`, execute:
```bash
npm start
```
*O servidor rodará na porta `3001` (`http://localhost:3001`).*

#### Passo B: Iniciar o Frontend (Vite)
Abra uma **nova janela do terminal**, acesse a pasta `/frontend` e execute:
```bash
npm run dev
```
*Isso iniciará o Vite localmente, oferecendo um link (como `http://localhost:5173`) para acessar a aplicação no seu navegador.*

---

## 🔑 Credenciais de Acesso Administrativo
Para acessar a área restrita de administração (`/login`) no sistema, utilize os seguintes dados de teste:

* **E-mail:** `admin@cafofo.com`
* **Senha:** `admin123`
