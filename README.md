# Sistema-Curso API REST
Projeto Web FullStack em NodeJs com React

### Resumo do projeto
Uma api rest que se comunica por json e aceita os 4 metodos de requisição para fazer parte de sistema de curso onde é possivel visualizar os modulos e aulas do curso e para quem for cadastrado, é possivel editar, criar e deletar cada modulo ou curso. Também há a opção de cadastro de usuário para conseguir fazer as requests mencionadas.

### Tecnologias usadas
Nodejs 17.6 com Express e Seequilize de orm para um banco de dados Mysql Ver 15.1 Distrib 10.7.3-MariaDB para Linux.

### Banco e dados
Utilizei o banco Mysql e criei 3 tabelas com um arquivo Js: Tabela Usuario contem somente id, nome e senha; Tabela Modulos tem os campos id, nome, categoria, total de aulas e total de duração; e Tabela Aulas com id, nome, modulo data da aula e tempo de duração.

### Guia rápido
Banco de dados: Mysql (mariadb) <br/>
Configs do banco: /config/default.json <br/>
Porta do server: 3030 <br/>
Antes de iniciar o server pela primeira vez, iniciar o banco de dados (no caso do arch linux: sudo suystemctl start mariadb) e iniciar as tabelas do banco com 'node /api/banco-dados/criarTabelas.js' <br/>
Rota principal: (localhost:3030)/api/ <br/>
Todos os metodos trabalham apenas com formato json <br/>
Banco de dados: Mysql (mariadb) <br/>
Configs do banco: /config/default.json <br/>
Porta do server: 3030 <br/>
Antes de iniciar o server pela primeira vez, iniciar as tabelas do banco com 'node /api/banco-dados/criarTabelas.js' <br/>
Rota principal: (localhost:3030)/api/ <br/>
Todos os metodos trabalham apenas com formato json <br/>

**Rotas Modulos:**
- **modulos/ (get - recebe todos os modulos)** <br/>
não precisa de autenticação
- **modulos/ (post - cria um modoulo novo)** <br/>
precisa de autenticação <br/>
formato json  <br/>
{ <br/>
    "nome": "nome", <br/>
    "categoria": "categoria" <br/>
}
- **modulos/id (get - recebe um modulo especifico)** <br/>
não precisa de autenticação
- **modulos/id (put - edita um modulo especifico)** <br/>
precisa de autenticação
- **modulos/id (delete - deleta um modulo especifico)**<br/>
precisa de autenticação <br/>
deleta todas as aulas referentes àquele modulo

**Rotas Aulas:**
- **aulas/ (get - recebe todas as aulas)** <br/>
não precisa de autenticação
- **aulas/id (get - recebe todas as aulas de um modulo)** <br/>
não precisa de autenticação <br/>
um detalhe que o ID passado na rota é do módulo e não da aula
- **aulas/ (post - cria um nova aulas)** <br/>
precisa de autenticação <br/>
atualiza o total de aulas e horas do modulo relacionado <br/>
formato json <br/> 
{ <br/>
    "nome": "nome", <br/> 
    "modulo": "modulo", <br/> 
    "data": "dd-mm-aaaa", <br/>
    "duracacao": "00" <br/>
} <br/>
- **aulas/id (put - edita uma aula especifica)** <br/>
precisa de autenticação <br/>
atualiza o total de horas do modulo relacionado
- **aulas/id (delete - deleta uma aula especifica)** <br/>
precisa de autenticação <br/>
atualiza o total de aulas e horas do modulo relacionado

**Rotas Usuarios**
- **users/registro (post - cria um usuario)** <br/>
formato json <br/>
{ <br/>
    "nome": "nome", <br/>
    "senha": "senha" <br/>
} <br/>
- **users/login (post - loga no sistema)** <br/>
formato json <br/>
{ <br/>
    "nome": "nome", <br/>
    "senha": "senha" <br/>
} <br/>
- **users/logout (get - desloga do sistema)** <br/>
precisa estar autenticado



### A API REST
#### Index
Comecei o projeto criando as config em js do banco e criação de tabelas como mencionado, em seguida criei o index.js principal com as principais rotas: para requests dos Modulo '/api/modulos'; para requests das Aulas 'api/aulas', para requests de login, registro e logout '/api/users. Tambem nesse arquivo foi adicionado alguns middlewares como o CORS habilitando expor o header 'Authorization' onde mais na frente utilizo para autenticação de rotas privadas no frontend. <br/> <br/> Necessário mencionar essa config do CORS porque na tentativa de pegar os tokens do header no sucesso de login, sem essa config a resposta do servidor omitia essa informação. Ao funal, subo o serviço na porta 3030.

#### Models
Em seguida modelei as tabelas para o seequilize (pasta models) com os campos necessários como tipo de variavel, default values e not null.

#### Rotas
Cada rota tem sua pasta especifica onde as rotas de modulos e aulas são basicamente as mesmas, com ligeiras mudanças em seus metodos de requests. Começando por elas, eu criei uma Classe (i.e. rotas/modulos/Modulo.js) com suas respectivias propriedades respeitando os campos de sua respectiva tabela e metodos que essa classe usa de acordo com os requests que a rota aceita. Esses metodos tem as regras de negocio de cada tabela e usam outras funções que estão em outro arquivo (i.e. rotas/modulos/TabelaModulo.js) que tem os metodos de querys do seequilize com o banco de dados. <br/> <br/>
Já no index.js de cada rota eu faço a complementação do path da rota e uso middlewares de contentType e autenticação importando esses middlewares da pasta rotas/middlewares. Nesse arquivo (index.js de cada rota) eu defino os requests que são feitos pra cada rota recebo os requests feitos, e chamo os metodos respectivos da classe, se o request for aceito, respondo com o status especifico assim como se der erro no request. As diferenças entre rotas de modulo e aula aqui são: no metodo delete do modulo, ele deleta todas as aulas de tem no modulo; e no metodo post, put e delete das aulas ele atualiza os dados do modulo respectivo com total de aulas e total de horas. <br/> <br/>
Nas rotas de Usuario são feitas as regras para cadastro, login e logout. Elas seguem a mesma estrutura das outras rotas com classes metodos e funções do seequeilize, mas so tem dois tipos requisições possiveis post e get onde um post para registro, um para login e um get para logout. No metodo de login é verificado se o usuário existe, compara a senha inserida com a senha hash salva no banco, se ok ele seta no header de resposta um "Authorization" com o token jwt com tempo de expiração de 5 minutos. No logout ele verifica se o usuario tem algum token valido no request, caso tenha ele apaga os tokens do header do usuario.
