const ModeloTabelaModulos = require('../models/ModeloTabelaModulos')
const ModeloTabelaAulas = require('../models/ModeloTabelaAulas')
const ModeloUsuarios = require('../models/ModeloUsuarios')

ModeloTabelaModulos.sync()
    .then(() => console.log('Tabela Modulos criada com sucesso'))
    .catch(console.log)

ModeloTabelaAulas.sync()
.then(() => console.log('Tabela Aulas criada com sucesso'))
.catch(console.log)

ModeloUsuarios.sync()
.then(()=> console.log('Tabela de usuários criada com sucesso'))
.catch(console.log)