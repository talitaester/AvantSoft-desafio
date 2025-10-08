# API Products - Gerenciamento de Produtos

## Descrição
API RESTful para gerenciamento de produtos, permitindo operações CRUD completas. Desenvolvida com arquitetura moderna e totalmente containerizada com Docker.

## Tecnologias
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- PostgreSQL
- Maven
- Docker & Docker Compose

## Configuração e Execução

### Opção 1: Execução Totalmente Dockerizada (Recomendada)
**Execute toda a aplicação com um único comando:**
```bash
docker-compose up --build
```
Isso irá subir:
- **API Products** (porta 8090)
- **Banco de dados PostgreSQL** (porta 5432)
- **Frontend** (porta 3000)

**Acesse:**
- API: http://localhost:8080
- Frontend: http://localhost:3000
- Banco: localhost:5432

### Opção 2: Execução Mista (Desenvolvimento)
**Apenas o banco com Docker:**
```bash
docker-compose up postgres -d
```

**Executar a aplicação localmente:**
```bash
mvn spring-boot:run
```

**Executar frontend localmente:**
```bash
npm run dev
```

### Exemplo:
```json
{
    "name": "Notebook Gamer Dell",
    "price": 4500.00,
    "sku": "NTB-DLL-GMR-001",
}

```
os atributos necessários para criar um produto são:
- name: String
- price: Double
- sku: String
