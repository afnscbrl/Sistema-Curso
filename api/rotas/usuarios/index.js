const roteadorUsuario = require('express').Router()
const Usuario = require('./Usuario')
const SerializadorUsuario = require('../../Serializador').SerializadorUsuario


roteadorUsuario.post('/', async (req, res, proximo) => {
    try {
        const dadosRecebidos = req.body
        const usuario = new Usuario(dadosRecebidos)
        await usuario.criar()
        res.status(201)
        const serializador = new SerializadorUsuario(
            res.getHeader('Content-Type')
        ) 
        res.send(
            serializador.serializar(usuario)
        )
    }catch (erro) {
        proximo(erro)
    }
})


roteadorUsuario.put('/:idUsuario', async(req, res, proximo) => {

    try {
        const id = req.params.idUsuario
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, {id: id})
        const usuario = new Usuario(dados)
        await usuario.atualizar()
        res.status(204)
        res.end()
    } catch(erro) {
        proximo(erro)
    }

})

roteadorUsuario.delete('/:idUsuario', async (req, res, proximo) => {
    try {
        const id = req.params.idUsuario
        const usuario = new Usuario({ id: id})
        await usuario.carregar()
        await usuario.remover()
        res.status(204)
        res.end()
    } catch(erro) {
        proximo(erro)
    }
})

module.exports = roteadorUsuario