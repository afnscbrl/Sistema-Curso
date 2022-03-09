const Sequelize = require('sequelize')
const instancia = require('../../banco-dados/index.js')

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

// const opcoes = { 
//     freezeTableName: true,
//     tableName: 'modulos',
//     timestamps: true,
//     createdAt: 'dataCriacao',
//     updateAt: 'dataAtualizacao',
//     version: 'versao'
// }

module.exports = instancia.define('modulos', colunas)