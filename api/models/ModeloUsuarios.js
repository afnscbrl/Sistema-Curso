const Sequelize = require('sequelize')
const instancia = require('../banco-dados/index.js')

const colunas = { 
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    }
}

module.exports = instancia.define('usuarios', colunas)