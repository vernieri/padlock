# Padlock

**Padlock** é um sistema de gerenciamento seguro de senhas desenvolvido para garantir a privacidade e a proteção de informações confidenciais. Este repositório contém a API backend escrita em Node.js com autenticação JWT e suporte para armazenamento de senhas criptografadas.

---

## **Requisitos**

- Node.js (v16 ou superior)
- NPM ou Yarn
- MongoDB (local ou em nuvem)
- (Opcional) Docker e Docker Compose

---

## **Configuração do Ambiente**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```env
# Configurações do MongoDB
MONGO_URI=mongodb://localhost:27017/padlockDB

# Configuração do Servidor
PORT=3000

# Configuração do JWT
JWT_SECRET=seu_segredo_super_secreto
JWT_EXPIRATION=1h
```

---

## **Instalação**

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu_usuario/padlock.git
   cd padlock
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o MongoDB localmente ou configure a URI para um MongoDB remoto.

4. Inicie o servidor:
   ```bash
   npm start
   ```

5. O servidor estará rodando em `http://localhost:3000`.

---

## **Documentação da API**

### **Autenticação**

#### **1. Registro de Usuário**

**Endpoint:**
```http
POST /api/auth/register
```

**Payload:**
```json
{
  "username": "exemplo",
  "email": "exemplo@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "Usuário registrado com sucesso!",
  "token": "<JWT>"
}
```

---

#### **2. Login de Usuário**

**Endpoint:**
```http
POST /api/auth/login
```

**Payload:**
```json
{
  "email": "exemplo@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "token": "<JWT>"
}
```

---

### **Gerenciamento de Senhas**

#### **1. Criar Seed**

**Endpoint:**
```http
POST /api/seed
```

**Headers:**
```json
{
  "Authorization": "Bearer <JWT>"
}
```

**Payload:**
```json
{
  "service": "Google",
  "account": "usuario@gmail.com"
}
```

**Resposta:**
```json
{
  "seed": "<uuid4>",
  "service": "Google",
  "account": "usuario@gmail.com"
}
```

---

#### **2. Buscar Seed**

**Endpoint:**
```http
GET /api/seed/:id
```

**Headers:**
```json
{
  "Authorization": "Bearer <JWT>"
}
```

**Resposta:**
```json
{
  "seed": "<uuid4>",
  "service": "Google",
  "account": "usuario@gmail.com"
}
```

---

#### **3. Atualizar Seed**

**Endpoint:**
```http
PUT /api/seed/:id
```

**Headers:**
```json
{
  "Authorization": "Bearer <JWT>"
}
```

**Payload:**
```json
{
  "service": "Google",
  "account": "novo_usuario@gmail.com"
}
```

**Resposta:**
```json
{
  "message": "Seed atualizada com sucesso!"
}
```

---

#### **4. Deletar Seed**

**Endpoint:**
```http
DELETE /api/seed/:id
```

**Headers:**
```json
{
  "Authorization": "Bearer <JWT>"
}
```

**Resposta:**
```json
{
  "message": "Seed deletada com sucesso!"
}
```

---

## **Testes**

1. Execute os testes unitários:
   ```bash
   npm test
   ```

2. Verifique os relatórios de cobertura:
   ```bash
   npm run coverage
   ```

---

## **Logs**

Os logs do sistema são gerados automaticamente e podem ser encontrados em:
- Diretório local: `logs/`
- Tipos de logs: `info`, `error`

---

## **Contribuição**

1. Fork o repositório.
2. Crie um branch para sua feature:
   ```bash
   git checkout -b minha-feature
   ```
3. Commit suas alterações:
   ```bash
   git commit -m "Adiciona minha nova feature"
   ```
4. Push para o branch:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

---

## **Licença**

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
