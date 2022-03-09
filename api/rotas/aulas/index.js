const Sequelize = require('sequelize')
const roteadorAulas = require('express').Router()
const TabelaAulas = require('./TabelaAula')
const Aula = require('./Aula')
//const Modulo = require('./Modulo')
const Modelo = require('./ModeloTabelaAulas')
const ModeloMod = require('../modulos/ModeloTabelaModulos')
const TabelaModulo = require('../modulos/TabelaModulo')
const SerializadorAula = require('../../Serializador').SerializadorAula
//const roteadorModulos = require('../modulos')


roteadorAulas.get('/', async (req, res) => {
    const resultados = await TabelaAulas.listar()
    res.status(200)

    const serializador = new SerializadorAula(
        res.getHeader('Content-Type')
    ) 
    res.send(
        serializador.serializar(resultados)
    )
})

roteadorAulas.post('/', async (req, res, proximo) => {
    try {
        const dadosRecebidos = req.body
        const aula = new Aula(dadosRecebidos)
        await aula.criar()
        res.status(201)
        const moduloAula = aula.modulo
        const totalAmount = await Modelo.findAll({raw:true, 
            attributes: [
                [Sequelize.fn('count', Sequelize.col('modulo')), 'total_amount'],
            ],
            where: {modulo : moduloAula},
            });

        const serializador = new SerializadorAula(
            res.getHeader('Content-Type')
        ) 
        res.send(
            serializador.serializar(aula)
        )
        
        const totalAulas = Object.values(totalAmount[0])
        //----------
        const encontrado = await ModeloMod.findOne({
            where: {
                nome: moduloAula
            }
        })
        const totalAulasModulo = {
            totalAulas: totalAulas[0]
        }
        await TabelaModulo.atualizar(encontrado.id, totalAulasModulo)

    }catch (erro) {
        proximo(erro)
    }
})

roteadorAulas.get('/:idAula', async (req, res, proximo) =>{

    try {
        const id = req.params.idAula
        const aula = new Aula({id: id})
        await aula.carregar()
        res.status(200)
        const serializador = new SerializadorAula(
            res.getHeader('Content-Type')
        ) 
        res.send(
            serializador.serializar(aula)
        )
    
    } catch(erro) {
        proximo(erro)
    }
})

roteadorAulas.put('/:idAula', async(req, res, proximo) => {

    try {
        const id = req.params.idAula
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, {id: id})
        const aula = new Aula(dados)
        await aula.atualizar()
        res.status(204)
        res.end()
    } catch(erro) {
        proximo(erro)
    }

})

roteadorAulas.delete('/:idAula', async (req, res, proximo) => {
    try {
        const id = req.params.idAula
        const aula = new Aula({ id: id})
        await aula.carregar()
        await aula.remover()
        res.status(204)
        res.end()
    } catch(erro) {
        proximo(erro)
    }
})

module.exports = roteadorAulas