# AI Career Advisor

Plataforma de recomendação de carreira baseada em Inteligência Artificial, desenvolvida como projeto acadêmico. Utiliza a API do Gemini para analisar perfis e gerar recomendações personalizadas.

## Tecnologias
- **Frontend**: React, Vite, React Router, Firebase Auth
- **Backend**: Python, FastAPI, Firebase Admin SDK, Gemini API
- **Banco de Dados**: Firestore
- **Hospedagem**: GitHub Pages (Frontend) e Local (Backend)

## Estrutura
- `/frontend`: Aplicação web responsiva com visual moderno.
- `/backend`: API em Python que processa dados e interage com o Gemini.

## Como rodar o projeto

### Backend (Local)
1. Instale o Python (3.9+)
2. Instale as dependências: `pip install -r backend/requirements.txt`
3. Crie o arquivo `.env` na pasta `backend` com sua chave `GEMINI_API_KEY`
4. Coloque o arquivo de credenciais do Firebase (`firebase-adminsdk.json`) na raiz do `backend`
5. Execute o servidor: `python -m uvicorn main:app --reload` (na pasta `backend`)
   - A API rodará em `http://localhost:8000`

### Frontend (Local)
1. Instale o Node.js
2. Na pasta `frontend`, rode `npm install`
3. Crie o arquivo `.env` na pasta `frontend` com as configurações do Firebase SDK
4. Inicie o servidor de desenvolvimento: `npm run dev`

### Acesso à Demo
Se a página do frontend estiver hospedada via GitHub Pages, garanta que o backend local está rodando em `http://localhost:8000` antes de enviar o formulário. O frontend se conectará automaticamente à API local.

## Notas Acadêmicas
* Este sistema possui propósito exclusivamente educacional e acadêmico.
* As carreiras recomendadas e análises feitas não substituem acompanhamento profissional adequado.
