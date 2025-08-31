# Documentação Técnica: Sistema de Classificação de E-mails

## 1. Visão Geral do Sistema
O sistema Sort-Email é uma aplicação web modular projetada para automatizar a triagem e o processamento de mensagens. O sistema é composto por duas aplicações independentes, um frontend em **React** e um backend em **Python**, que se comunicam através de uma API RESTful. Toda a arquitetura é conteinerizada com **Docker** para garantir consistência e portabilidade em ambientes de desenvolvimento e produção.

### 1.1. Fluxo de Execução
1. O usuário interage com a interface do frontend, inserindo o conteúdo de um e-mail ou um arquivo.
2. O usuário seleciona o modelo de IA a ser utilizado para o processamento.
3. O frontend envia o texto do e-mail ou o arquivo, junto com o modelo selecionado, como uma requisição HTTP `POST` para o backend.
4. O backend recebe a requisição e utiliza uma biblioteca de IA para processar o conteúdo.
5. O modelo de IA classifica o e-mail como "Produtivo" ou "Improdutivo" e gera uma resposta sugerida.
6. O backend retorna a classificação e a resposta ao frontend em formato JSON.
7. O frontend exibe a classificação e a resposta para o usuário.

---

## 2. Estrutura do Projeto
A organização do projeto segue a arquitetura de monorepositório, com diretórios dedicados a cada serviço.  

`sort-email/`
- `.dockerignore`
- `.env.exemple`
- `.gitignore`
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`
- `README.md`
- `backend/`
  - `app/`
    - `routes/`
    - `services/`
    - `utils/`
    - `__init__.py`
    - `main.py`
    - `schemas.py`
  - `Dockerfile`
  - `Dockerfile.dev`
  - `requirements.txt`
- `frontend/`
  - `public/`
  - `src/`
    - `components/`
    - `constants/`
    - `context/`
    - `hooks/`
    - `pages/`
    - `types/`
    - `app.tsx`
    - `index.css`
    - `main.tsx`
    - `vite-env.d.ts`
  - `Dockerfile`
  - `Dockerfile.dev`
  - `index.html`
  - `nginx.conf`
  - `package.json`
  - `tsconfig*.json`
  - `vite.config.ts`
- `Demais arquivos para configuração do linter Biomejs`

### 2.1. Detalhamento de Diretórios e Arquivos
`sort-email/`: Diretório raiz do projeto.
* `.env.example`: Cópia exemplo da `.env.production`, onde são armazenadas variáveis de ambiente confidenciais, como chaves de API.
* `.dockerignore`: Especifica arquivos e diretórios a serem ignorados pelo Docker durante a construção das imagens.
* `docker-compose.dev.yml`: Define e orquestra os serviços  ambiente de desenvolvimento.
* `docker-compose.prod.yml`: Define e orquestra os serviços  ambiente de produção.
* `frontend/`: Aplicação web construída com **React** e **TypeScript** e gerenciada pelo **Vite**.
  * `index.html`: O ponto de entrada da aplicação, onde o script `main.tsx` é injetado.
  * `src/`: Contém o código-fonte da aplicação.
    * `components/`: Subdiretório para componentes reutilizáveis.
    * `constants/`: Subdiretório para centralizar as constants da aplicação.
    * `context/`: Subdiretório onde estão os arquivos da ContextAPI.
    * `hooks/`: Subdiretório dos hooks personalizados contendo a lógica e regras de negócio.
    * `pages/`: Subdiretório para as páginas da aplicação.
    * `types/`: Subdiretório para definição de tipagens do Typescript.
    * `app.tsx`: O componente raiz da aplicação.
    * `main.tsx`: O arquivo de entrada que renderiza o componente `App`.
  * `public/`: Contém assets estáticos, como imagens e ícones.
  * `package.json`: Lista as dependências do Node.js e scripts de construção.
  * `tsconfig.*`: Configurações do Typescript.
  * `Dockerfile`: Instruções para criar o contêiner Docker do frontend.
* `backend/`: Serviço de API e processamento de IA construído com **Python**e  **FastAPI**.
  * `app/`: Contém os scripts da lógica da API.
    * `routes/`: Contém as rotas da API.
    * `services/`: Contém a lógica para os serviços de IA consumidos pela API.
    * `utils/`: Contém os utilitários usados pela API.
    * `__init__.py`: Mandatório para scripts **Python**.
    * `main.py`: Script principal da API.
    * `schemas.py`: Contém os schemas para validação de request e response.
  * `Dockerfile`: Instruções para criar o contêiner Docker do backend.
  * `requirements.txt`: Lista as dependências do Python.

---

## 3. Tecnologias e Implementação

### 3.1. Frontend: React e TypeScript
A escolha de **React** e **TypeScript** oferece um ambiente robusto para a construção da interface do usuário. A tipagem estática do TypeScript reduz a probabilidade de erros em tempo de execução, enquanto o React proporciona uma arquitetura de componentes reutilizáveis. O uso de **Tailwind CSS** otimizará a criação de uma interface responsiva e visualmente agradável sem a necessidade de arquivos CSS complexos.

### 3.2. Backend: Python e IA
O **Python** é a linguagem padrão para aplicações de IA e processamento de dados. Utilizaremos uma API de IA, como a do **Gemini**ou **OpenAI**, para a classificação do texto e a geração de respostas. O backend será implementado com uo framework web **FastAPI**, que é reconhecido por sua alta performance e facilidade de uso na criação de APIs REST.

### 3.3. Conteinerização com Docker
A conteinerização é crucial para o sucesso do projeto. Cada serviço (frontend e backend) será encapsulado em seu próprio contêiner. Os arquivos **`docker-compose`** serão a ferramenta de orquestração, permitindo que o sistema completo seja inicializado com um único comando, garantindo que o ambiente de desenvolvimento seja idêntico ao ambiente de produção.

---

## 4. Fases do Projeto
O desenvolvimento foi dividido em três fases distintas para garantir uma abordagem metódica e controlada.

### 4.1. Fase 1: Desenvolvimento do Frontend e Contêiner
* **Objetivo:** Criar a interface do usuário com React, TypeScript e Tailwind, incluindo formulários e áreas de exibição. Os arquivos `Dockerfile` do frontend serão configurados.
* **Entregável:** Código-fonte do frontend funcional, pronto para se comunicar com o backend.

### 4.2. Fase 2: Desenvolvimento do Backend e Contêiner
* **Objetivo:** Construir a API em Python com FastAPI, configurar a comunicação com a API de IA e implementar a lógica de classificação e geração de respostas. Os arquivos `Dockerfile` do backend serão configurados.
* **Entregável:** Código-fonte do backend funcional, pronto para receber requisições do frontend.

### 4.3. Fase 3: Integração, Testes e Deploy
* **Objetivo:** Integrar o frontend e o backend, garantindo que a comunicação entre eles seja fluida. Esta fase inclui a implementação de testes unitários e de integração para validar a aplicação, a orquestração final com o`docker-compose` e, por fim, o deploy da aplicação em um ambiente de produção.
* **Entregável:** Aplicação completa e funcional, publicada e acessível online.

---

## 5. Primeiros Passos (Getting Started)
Para executar o projeto, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/deCODEyn/sort-email](https://github.com/deCODEyn/sort-email.git)
    cd sort-email
    ```
2.  **Preencha suas váriaveis de ambiente:**  
    Crie um arquivo .env.production e informe suas chaves de API conforme o `.env.exemple`
    ```bash
    touch .env.production
    ```
3.  **Construa e inicie os contêineres:**
    ```bash
    docker compose -f docker-compose.prod.yml up --build
    ```
A sua aplicação estará disponível em `http://localhost`.

---

## 6. Licença
Este projeto está licenciado sob a Licença MIT.

---