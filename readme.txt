## Configuração das variáveis de ambiente

Este projeto utiliza a biblioteca `dotenv` para gerenciar variáveis de ambiente, mantendo informações de configuração e credenciais de teste separadas do código-fonte.

### 1. Instalar as dependências

Após clonar o repositório, execute:

```bash
npm install
```

Caso o `dotenv` ainda não esteja instalado:

```bash
npm install dotenv
```

### 2. Configurar o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto, seguindo o exemplo abaixo:

```dotenv
BASE_URL=https://minha-vida-financeira-a16d2.web.app
USER_EMAIL=seu-email-de-teste
USER_PASSWORD=sua-senha-de-teste
```

Substitua os valores de exemplo pelos dados da sua conta de teste autorizada.

### 3. Carregar as variáveis de ambiente

Para carregar as variáveis do arquivo `.env`, adicione o seguinte import no arquivo de configuração apropriado:

```typescript
import 'dotenv/config';
```

As variáveis poderão ser acessadas pelo código usando `process.env`:

```typescript
const email = process.env.USER_EMAIL;
const password = process.env.USER_PASSWORD;
```

### 4. Proteger as credenciais

Adicione o arquivo `.env` ao `.gitignore` para evitar o envio de credenciais ao repositório:

```gitignore
.env
```

### 5. Boas práticas

- Nunca publique senhas ou tokens reais no repositório.
- Não compartilhe o arquivo `.env`.
- Para disponibilizar um exemplo de configuração, utilize um arquivo `.env.example` com valores fictícios.
- Em ambientes de CI/CD, configure as credenciais por meio de variáveis ou secrets do ambiente de execução.
