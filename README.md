# API de Vendas (v2)

Reescrita da API antiga (Node + TypeScript + Express + Sequelize), conectando
no **mesmo banco Postgres já existente** — nenhuma tabela ou dado foi alterado.

## Rodando localmente

```bash
npm install
cp .env.example .env   # ja existe um .env preenchido com as credenciais atuais
npm run dev             # http://localhost:8888/api/v1
```

Scripts: `npm run build` (compila para `dist/`), `npm start` (roda o build),
`npm run typecheck`.

## Estrutura

- `src/database/models` — models Sequelize mapeando 1:1 as tabelas existentes
  (nenhuma migration roda contra o banco; os models só leem/escrevem nas
  tabelas que já existem).
- `src/config/junctionTables.ts` — as 3 relações N:N que o Prisma antigo criava
  implicitamente (categoria↔produto, linha↔produto, meta↔usuario) não tinham
  o nome real da tabela gravado no schema. No boot, o servidor detecta
  automaticamente qual nome existe no banco entre os candidatos mais prováveis
  e loga qual foi usado. **Recomendo conferir esse log no primeiro deploy** —
  se nenhum candidato bater, o servidor falha ao subir com uma mensagem clara
  (em vez de gravar/ler dado errado silenciosamente).
- `src/services` — regras de negócio (portadas 1:1 da API antiga).
- `src/controllers` + `src/routes` — camada REST (`/api/v1/...`).
- `src/middlewares/auth.ts` — autenticação JWT real em todas as rotas
  (a API antiga gerava o token no login mas nunca validava nas demais
  chamadas) e autorização por perfil sempre a partir do token assinado
  (a antiga confiava em um campo enviado pelo próprio cliente).

## Diferenças/melhorias em relação à API antiga

- GraphQL/Apollo/Prisma → REST/Express/Sequelize.
- Autenticação de verdade em todas as rotas (exceto `/auth/login`,
  `/health` e `/error-report`).
- Autorização (criar/editar/excluir) baseada no perfil do token, não em
  parâmetro enviado pelo cliente.
- Validação de payload com `zod` em todas as rotas de escrita.
- `PUT /produtos/:id` implementado (na API antiga estava comentado/quebrado).
- Paginação e mensagens de erro padronizadas em todos os endpoints.
- Autoatendimento de perfil: `PUT /usuarios/:id` libera a própria vendedora
  editar campos não sensíveis (foto, data de nascimento, tema) sem precisar
  de permissão de gestão; nome, CPF, e-mail e função continuam exigindo
  ADMIN/MANAGER. `POST /usuarios/:id/senha` permite trocar a própria senha
  informando a senha atual (diferente do `recovery-senha`, que é reset feito
  por um gestor, sem checar a senha antiga).
- `GET /lojas/ranking` — não existia na API antiga; adicionado para o painel
  de gestão poder comparar unidades (mesmo padrão do ranking de marcas).
- `GET /usuarios/timeline` — expõe a série histórica (tratamentos x
  colorações) por usuário/loja/marca, usada nos gráficos do Backoffice.

## Endpoints principais

`/api/v1/auth/login`, `/usuarios`, `/vendas`, `/produtos`, `/categorias`,
`/marcas`, `/linhas`, `/lojas`, `/metas` — todos com os mesmos filtros/insights
que a API antiga (rankings, insights por loja/marca/usuário, metas com etapas).
`POST /error-report` (fora do prefixo `/api/v1`) continua igual, para o front
reportar erros de runtime.
