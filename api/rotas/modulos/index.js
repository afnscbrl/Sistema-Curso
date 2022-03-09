const roteadorModulos = require('express').Router()
const TabelaModulo = require('./TabelaModulo')
const Modulo = require('./Modulo')
const SerializadorModulo = require('../../Serializador').SerializadorModulo


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

roteadorModulos.put('/:idModulo', async(req, res, proximo) => {

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

roteadorModulos.delete('/:idModulo', async (req, res, proximo) => {
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