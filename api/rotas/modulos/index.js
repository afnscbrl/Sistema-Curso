const roteadorModulos = require('express').Router()
const TabelaModulo = require('./TabelaModulo')
const Modulo = require('./Modulo')
const SerializadorModulo = require('../../Serializador').SerializadorModulo
const TabelaAula = require('../aulas/TabelaAula')
const Aula = require('../../models/ModeloTabelaAulas')

const verificaToken = require('../middlwares').verificaToken
const contentType = require('../middlwares').contentType




roteadorModulos.use(contentType).get('/', async (req, res) => {
    const resultados = await TabelaModulo.listar()
    res.status(200)

    const serializador = new SerializadorModulo(
        res.getHeader('Content-Type')
    ) 
    res.send(
        serializador.serializar(resultados)
    )
})

roteadorModulos.use(contentType, verificaToken).post('/', async (req, res, proximo) => {
    try {
        const dadosRecebidos = req.body
        dadosRecebidos.nome = dadosRecebidos.nome.charAt(0)
            .toUpperCase() + dadosRecebidos.nome.slice(1)
        const modulo = new Modulo(dadosRecebidos)
        await modulo.criar()
        res.status(201)
        const serializador = new SerializadorModulo(
            res.getHeader('Content-Type')
        ) 
        res.send(
            serializador.serializar(modulo)
        )
    }catch (erro) {
        proximo(erro)
    }
})

roteadorModulos.use(contentType).get('/:idModulo', async (req, res, proximo) =>{

    try {
        
        const id = req.params.idModulo
        const modulo = new Modulo({id: id})
        await modulo.carregar()
        res.status(200)
        const serializador = new SerializadorModulo(
            res.getHeader('Content-Type')
        ) 
        res.send(
            serializador.serializar(modulo)
        )
    
    } catch(erro) {
        proximo(erro)
    }
})

roteadorModulos.use(contentType, verificaToken)
    .put('/:idModulo', async(req, res, proximo) => {

    try {
        const id = req.params.idModulo
        const dadosRecebidos = req.body
        dadosRecebidos.nome = dadosRecebidos.nome.charAt(0)
            .toUpperCase() + dadosRecebidos.nome.slice(1)
        const dados = Object.assign({}, dadosRecebidos, {id: id})
        const modulo = new Modulo(dados)
        await modulo.atualizar()
        res.status(204)
        res.end()
    } catch(erro) {
        proximo(erro)
    }

})

roteadorModulos.use(contentType, verificaToken)
    .delete('/:idModulo', async (req, res, proximo) => {
    try {
        const id = req.params.idModulo
        const modulo = new Modulo({ id: id})
        await modulo.carregar()
        await modulo.remover()   
            
        const encontrado = await Aula.findAll({
            where: {
                modulo: modulo.nome
            }
        })
        await encontrado.map(el => TabelaAula.remover(el.id))

        //await TabelaAula.remover(encontrado.id, totais)
                
                
        res.status(204)

        res.end()
    } catch(erro) {
        proximo(erro)
    }
})

module.exports = roteadorModulos