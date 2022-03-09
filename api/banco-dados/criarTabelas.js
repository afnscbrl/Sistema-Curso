const ModeloTabelaModulos = require('../rotas/modulos/ModeloTabelaModulos')
const ModeloTabelaAulas = require('../rotas/aulas/ModeloTabelaAulas')

ModeloTabelaModulos.sync()
    .then(() => console.log('Tabela Modulos criada com sucesso'))
    .catch(console.log)

ModeloTabelaAulas.sync()
.then(() => console.log('Tabela Aulas criada com sucesso'))
.catch(console.log)