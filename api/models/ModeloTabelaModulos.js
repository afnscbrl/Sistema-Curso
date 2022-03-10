const Sequelize = require('sequelize')
const instancia = require('../banco-dados/index.js')

const colunas = { 
    nome: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    categoria: {
        type: Sequelize.ENUM('Front-End', 'Back-End'),
        allowNull: false
    },
    totalAulas: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}

module.exports = instancia.define('modulos', colunas)