# Documentação Técnica: Sistema de Classificação de E-mails

## 1. Visão Geral do Sistema
O sistema para classificação de e-mails, é uma aplicação web modular projetada para automatizar a triagem e o processamento de mensagens. O sistema é composto por duas aplicações independentes, um frontend em **React** e um backend em **Python**, que se comunicam através de uma API RESTful. Toda a arquitetura é contentorizada com **Docker** para garantir consistência e portabilidade em ambientes de desenvolvimento e produção.

### 1.1. Fluxo de Execução
1. O usuário interage com a interface do frontend, inserindo o conteúdo de um e-mail.
2. O frontend envia o texto do e-mail como uma requisição HTTP `POST` para o backend.
3. O backend recebe a requisição e utiliza uma biblioteca de IA para processar o texto.
4. O modelo de IA classifica o e-mail como "Produtivo" ou "Improdutivo" e gera uma resposta sugerida.
5. O backend retorna a classificação e a resposta ao frontend em formato JSON.
6. O frontend exibe a classificação e a resposta para o usuário.

---

## 2. Estrutura do Projeto
A organização do projeto segue a arquitetura de monorepositório, com diretórios dedicados a cada serviço.
`sort-email/`
- `.dockerignore`
- `docker-compose.yml`
- `README.md`
- `backend/`
  - `core/`
  - `api/`
    - `app.py`
  - `Dockerfile`
  - `requirements.txt`
  - `.env`
- `frontend/`
  - `public/`
  - `src/`
    - `assets/`
    - `components/`
    - `pages/`
    - `App.tsx`
    - `main.tsx`
  - `Dockerfile`
  - `index.html`
  - `package.json`
  - `tsconfig.json`
  - `tsconfig.node.json`
  - `vite.config.ts`

### 2.1. Detalhamento de Diretórios e Arquivos
`sort-email/`: Diretório raiz do projeto.
* `.dockerignore`: Arquivo que especifica arquivos e diretórios a serem ignorados pelo Docker durante a construção das imagens, otimizando o processo.
* `docker-compose.yml`: Define e orquestra os serviços do frontend e backend, garantindo a comunicação entre eles e o mapeamento de portas.
* `frontend/`: Aplicação web construída com **React** e **TypeScript** e gerenciada pelo **Vite**.
  * `index.html`: O ponto de entrada da aplicação, onde o script `main.tsx` é injetado.
  * `src/`: Contém o código-fonte da aplicação.
    * `pages/`: Subdiretório para as páginas da aplicação.
    * `components/`: Subdiretório para componentes reutilizáveis.
    * `App.tsx`: O componente raiz da aplicação, que atua como um orquestrador para as páginas.
    * `main.tsx`: O arquivo de entrada da aplicação que renderiza o componente `App`.
  * `public/`: Contém assets estáticos, como imagens e ícones.
  * `package.json`: Lista as dependências do Node.js e scripts de construção do Vite.
  * `tsconfig.*`: Configurações do Typescript.
  * `Dockerfile`: Instruções para criar o contêiner Docker do frontend.
* `backend/`: Serviço de API e processamento de IA construído com **Python**.
  * `api/`: Contém a lógica da API.
    * `app.py`: O script principal da API. Utilizará um framework como o **FastAPI** para criar os endpoints de comunicação com o frontend.
  * `core/`: Módulos de lógica central do sistema.
  * `requirements.txt`: Lista as dependências do Python, incluindo o framework da API e a biblioteca de IA (por exemplo, `transformers` ou `openai`).
  * `Dockerfile`: Instruções para criar o contêiner Docker do backend.
  * `.env`: Armazena variáveis de ambiente confidenciais, como chaves de API.

---

## 3. Tecnologias e Implementação

### 3.1. Frontend: React e TypeScript
A escolha de **React** e **TypeScript** oferece um ambiente robusto para a construção da interface do usuário. A tipagem estática do TypeScript reduz a probabilidade de erros em tempo de execução, enquanto o React proporciona uma arquitetura de componentes reutilizáveis. O uso de **Tailwind CSS** otimizará a criação de uma interface responsiva e visualmente agradável sem a necessidade de arquivos CSS complexos.

### 3.2. Backend: Python e IA
O **Python** é a linguagem padrão para aplicações de IA e processamento de dados. Utilizaremos uma API de IA, como a do **Gemini**, para a classificação do texto e a geração de respostas. O backend será implementado com um framework web, como **FastAPI**, que é reconhecido por sua alta performance e facilidade de uso na criação de APIs REST.

### 3.3. Contentorização com Docker
A contentorização é crucial para o sucesso do projeto. Cada serviço (frontend e backend) será encapsulado em seu próprio contêiner. O **`docker-compose.yml`** será a ferramenta de orquestração, permitindo que o sistema completo seja inicializado com um único comando, garantindo que o ambiente de desenvolvimento seja idêntico ao ambiente de produção.

---

## 4. Fases do Projeto
O desenvolvimento será dividido em três fases distintas para garantir uma abordagem metódica e controlada.

### 4.1. Fase 1: Desenvolvimento do Frontend e Contêiner
* **Objetivo:** Criar a interface do usuário com React, TypeScript e Tailwind, incluindo formulários e áreas de exibição. O `Dockerfile` do frontend será configurado para a contentorização.
* **Entregável:** Código-fonte do frontend funcional, pronto para se comunicar com o backend.

### 4.2. Fase 2: Desenvolvimento do Backend e Contêiner
* **Objetivo:** Construir a API em Python, configurar a comunicação com a API de IA e implementar a lógica de classificação e geração de respostas. O `Dockerfile` do backend será configurado.
* **Entregável:** Código-fonte do backend funcional, pronto para receber requisições do frontend.

### 4.3. Fase 3: Integração e Orquestração com Docker Compose
* **Objetivo:** Integrar o frontend e o backend, garantindo que a comunicação entre eles seja fluida. O `docker-compose.yml` será o foco, permitindo que a aplicação completa seja executada em um ambiente unificado e isolado.
* **Entregável:** Aplicação completa e funcional, pronta para deploy.

---

## 5. Primeiros Passos (Getting Started)
Para executar o projeto, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/deCODEyn/sort-email](https://github.com/deCODEyn/sort-email.git)
    cd sort-email
    ```
2.  **Construa e inicie os contêineres:**
    ```bash
    docker-compose up --build
    ```
A sua aplicação estará disponível em `http://localhost:3000`.

---

## 6. Licença
Este projeto está licenciado sob a Licença MIT.

---