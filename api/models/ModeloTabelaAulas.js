const Sequelize = require('sequelize')
const instancia = require('../banco-dados/index.js')
const modulos = require('./ModeloTabelaModulos')

const colunas = { 
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    modulo: {
        type: Sequelize.STRING,
        refereces: {
            model: modulos.modulo,
            key: 'id',
        },
        allowNull: false

    },
    data: {
        type: Sequelize.DATEONLY,
        allowNull: false
    }
}

module.exports = instancia.define('aulas', colunas)