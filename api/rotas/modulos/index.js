const roteadorModulos = require('express').Router()
const TabelaModulo = require('./TabelaModulo')
const Modulo = require('./Modulo')
const SerializadorModulo = require('../../Serializador').SerializadorModulo
const auth = require('../usuarios/auth')
const { send } = require('express/lib/response')
//const Usuario = require('../usuarios/Usuario')

let verificaToken = async function (req, res, proximo) {
    try {
        const token = req.get('Authorization')
        await auth.verificaAutorizacao(token, res)
        proximo()
    } catch (erro) {
        
        // proximo(erro)
        res.status(401).send({Error: erro.message})
        
    }
}


roteadorModulos.get('/', async (req, res) => {
    const resultados = await TabelaModulo.listar()
    res.status(200)

    const serializador = new SerializadorModulo(
        res.getHeader('Content-Type')
    ) 
    res.send(
        serializador.serializar(resultados)
    )
})

roteadorModulos.post('/', async (req, res, proximo) => {
    try {
        const token = req.get('Authorization')
        await auth.verificaAutorizacao(token)
        const dadosRecebidos = req.body
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

roteadorModulos.get('/:idModulo', async (req, res, proximo) =>{

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

roteadorModulos.use(verificaToken)
    .put('/:idModulo', async(req, res, proximo) => {

    try {
        const id = req.params.idModulo
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, {id: id})
        const modulo = new Modulo(dados)
        await modulo.atualizar()
        res.status(204)
        res.end()
    } catch(erro) {
        proximo(erro)
    }

})

roteadorModulos.use(verificaToken)
    .delete('/:idModulo', async (req, res, proximo) => {
    try {
        const id = req.params.idModulo
        const modulo = new Modulo({ id: id})
        await modulo.carregar()
        await modulo.remover()
        res.status(204)
        res.end()
    } catch(erro) {
        proximo(erro)
    }
})

module.exports = roteadorModulos