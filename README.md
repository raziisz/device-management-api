<h1 align="center">Device Management Api</h1>
<p align="center">Versão Api de desafio Pessoa Desenvolvedora Fullstack</p>

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/pt).
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/); Um SGBD para visualizar os dados gerados, recomendo [DBeaver](https://dbeaver.com/docs/dbeaver/);

Está aplicação foi desenvolvida na versão v22.15.0 do Node.js e v11.0.7 do NestJs

## Documentação da API

Acesse [Swagger](http://ec2-177-71-136-6.sa-east-1.compute.amazonaws.com:3000/swagger) da aplicação para verificar a documentação da API.

### 🎲 Baixando o repositório

```bash
# Clone este repositório
$ git clone <https://github.com/raziisz/device-management-api.git>

# Entrando na pasta
$ cd device-management-api

```

### 🔧 Configurando as variaveis de ambiente

Verifique o arquivo .env.example e coloque de acordo com seu ambiente. Os nomes de variaveis de ambiente ta bem intuitivo.

### 🚀 Rodando localmente

Para rodar localmente com comando no bash abaixo, cria-se arquivo .env.development com a variavel de ambiente NODE_ENV=development

```bash
# Primeiro baixe as dependencias
$ npm install

# Gere os models do prisma
$ npm run prisma:generate

# Rode as migrações do prisma. Ps: A conexão do banco de dados deve ta configurada no .env.development
$ npx dotenv-cli -e .env.development -- npm run prisma:migrate:dev

# Subindo em ambiente dev
$ npm run start:dev

```

### 🧪 Rodando os testes localmente

Para rodar os testes no bash abaixo, crie o arquivo .env.test com a variavel de ambiente NODE_ENV=test e demais variaveis colocando de acordo com seu ambiente.

```bash
#Todos os scripts abaixo aponta para .env.test onde o mesmo irá apontar o banco de dados test que vc definir.
# Roda todos os testes
$ npm run test

# Testes unitarios
$ npm run test:unit

# Testes de integração
$ npm run test:int

# Testes e2e
$ npm run test:e2e
```

### ⚙️ Subindo a API e o banco de dados diretamente com docker

Crie um arquivo .env e configure de acordo com seu ambiente.
Após configuração execute os seguintes scripts no bash

```bash
# Para buildar as imagens
$ docker compose build --no-cache

# E subir os containers em background
$ docker compose up -d

# (Opcional) Para visualizar se container subiu, rodar o seguinte comando, podendo visualizar outros container_name do docker-compose.yml
$ docker logs chat-backend -f
```

Após subida a API estará disponivel, para visualizar Documentação Swagger da Api http://localhost:3000/swagger

### 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/pt)
- [Prisma](https://www.prisma.io/)
- [MySql](https://dev.mysql.com/doc/)
- [Nest.js](https://docs.nestjs.com/)

# Observações

- Neste projeto, utilizei a Arquitetura Hexagonal (também chamada de Ports and Adapters). É um modelo de arquitetura de software onde:

* O núcleo (domínio) da aplicação é completamente isolado.

* As entradas (ports) e as saídas (adapters) conversam com esse núcleo através de interfaces, e não diretamente.

* Tudo é pensado para deixar o software independente de frameworks, bancos de dados, APIs externas, etc.

Adaptando também o Clean Architecture que é muito parecida com a hexagonal, mas com camadas mais formalizadas (Entities, Use Cases, etc).

💬 Em resumo:
Arquitetura Hexagonal = seu domínio no centro, tecnologias externas nas bordas, e tudo se conecta via interfaces.
É muito usada em projetos que querem ser testáveis, fáceis de manter, independentes de frameworks, e preparados para mudanças.

- Caso haja alguma coisa que eu possa melhorar no sistema, estarei totalmento aberto a criticas. Afinal, assim posso melhorar minhas habilidades no desenvolvimento.
- Qualquer dúvida em relação ao teste, entre em contato via telefone (caso tenha) ou email: felipelibertinni@gmail.com

### 👨‍💻 Autor

---

<a href="http://raziisz.github.io/">
 <img style="border-radius: 50%;" src="https://avatars2.githubusercontent.com/u/42245201?s=460&u=ce3bae80de213ad246855873906246051fba4458&v=4" width="100px;" alt=""/>
 <br />
 <sub><b>Luiz Felipe</b></sub></a> <a href="http://raziisz.github.io/" title="Dev">🚀</a>

Feito com ❤️ por Luiz Felipe 👋🏽 Entre em contato!

[![Linkedin Badge](https://img.shields.io/badge/-Felipe-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/felipelibert30/)](https://www.linkedin.com/in/felipelibert30/)
[![Outlook Badge](https://img.shields.io/badge/-raziel_libertino@hotmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:raziel_libertino@hotmail.com)](mailto:raziel_libertino@hotmail.com)
