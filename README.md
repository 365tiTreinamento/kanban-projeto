# Trello-like Project Control (Java 21 + Spring Boot 3, React, SQL Server)

Este pacote entrega um **MVP funcional** de um sistema de controle de projetos estilo Trello com personalizações solicitadas.

## Stack
- **Backend:** Java 21, Spring Boot 3, JPA/Hibernate, JWT
- **DB:** SQL Server (já existente) — host `10.3.70.118`, user `sa`, senha `Avaya@100` (ajustável por env).
- **Frontend:** React (Vite), react-beautiful-dnd
- **Containerização:** Docker, docker-compose

## Principais Funcionalidades
- Kanban com **drag & drop** (com **motivo obrigatório** para cada movimentação).
- **Cards**: título, descrição, **flags coloridos**, **logo** (URL/arquivo), **data de criação** e **data alvo/entrega**.
- **Tempo dentro do card**: iniciar/pausar/finalizar com **classificações customizadas** (ex.: início do dia, almoço, pausa banheiro, troca de atividade, etc.).
- **Pausa automática** ao mover card + **alert** no frontend.
- **Relatório de tempo** por card e por coluna, com indício de **retrabalho** ao voltar para colunas à esquerda.
- **Gerenciamento de usuários**, **perfis/permissões** (OWNER, ADMIN, MEMBER, VIEWER) por projeto/card.
- **Compartilhamento de usuários** com projeto/card.
- **Anexos** e **logo do card** (upload local no container do backend).
- **Logs de atividades** (mudança de coluna, criação de card, login/logout).

> **Nota:** É um MVP coeso e compilável que cobre o fluxo principal e endpoints essenciais. Você pode expandir regras e validações conforme necessário.

## Como rodar (Docker)
1. Configure (se desejar) as variáveis no `.env` (já apontando para seu SQL Server).
2. Na raiz deste projeto, rode:
   ```bash
   docker compose up --build
   ```
3. Acesse:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

### Login padrão (seed)
- Usuário: `admin@local`
- Senha: `admin123`
- Token JWT é retornado no `/api/auth/login`.

## SQL Server
A aplicação espera um banco acessível em `10.3.70.118` (porta default 1433). A JPA criará/atualizará o schema automaticamente (`spring.jpa.hibernate.ddl-auto=update`). Ajuste em `backend/src/main/resources/application.properties` ou via env.

## Scripts úteis
- Popular **motivos de movimentação** e **classificações de tempo** iniciais: executado automaticamente no primeiro start (CommandLineRunner).

## Estrutura
```
backend/   -> Spring Boot (API + Auth + JPA + Uploads + Relatórios básicos)
frontend/  -> React + Vite + DnD + Modal de motivo + Timer UI
docker-compose.yml
.env
```

## Segurança
Credenciais em `.env` para facilitar testes. **Em produção** configure secretos via vault/secret manager.

---

## Endpoints Principais (resumo)
- `POST /api/auth/login` — retorna JWT
- `GET /api/boards/{projectId}` — board completo (colunas, cards)
- `POST /api/cards` — criar card
- `PATCH /api/cards/{id}` — atualizar card
- `POST /api/cards/{id}/move` — **mover card (com motivo obrigatório)** e pausa automática do tempo ativo
- `POST /api/cards/{id}/time/start|pause|stop` — timer do card (com classificação obrigatória em `start` e `pause`)
- `GET /api/cards/{id}/time/report` — totais por classificação e por coluna
- `GET /api/activity` — logs de atividades
- `GET /api/movement-reasons` — listar motivos
- `POST /api/projects/{id}/share` — compartilhar usuário com projeto + papel
- `POST /api/cards/{id}/assignees` — incluir usuário ao card
- `POST /api/cards/{id}/attachments` — upload de anexo/logo

Detalhes e payloads nos controllers.

Boa utilização! 🚀
