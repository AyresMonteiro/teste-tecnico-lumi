# teste-tecnico-lumi

## Como rodar localmente

### Pré-requisitos:

- Ter o NodeJs instalado na máquina.

### Atenção:

É necessário rodar simultaneamente os dois projetos para obter êxito ao visualizar os arquivos.

### Backend

No terminal, à partir da raiz do projeto, vá para a pasta do projeto backend:

```shell
cd backend
```

Depois, instale o projeto e execute-o:

```shell
npm i && npm run dev
```

### Frontend

No terminal, à partir da raiz do projeto, vá para a pasta do projeto frontend:

```shell
cd frontend
```

Depois, copie o arquivo de variáveis de ambiente:

```shell
cp .env.example .env.local
```

Por fim, instale o projeto e execute-o:

```shell
npm i && npm run dev
```

## Como testar se funciona?

Existe um arquivo no caminho `backend/spec/mocks/pdf/invoices/success_invoice.pdf`, que pode ser usado na aplicação para teste.
