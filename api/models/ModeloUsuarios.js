const Sequelize = require('sequelize')
const instancia = require('../banco-dados/index.js')

const colunas = { 
    nome: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    }
}

module.exports = instancia.define('usuarios', colunas)