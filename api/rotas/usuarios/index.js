
const roteadorUsuario = require('express').Router()
const Usuario = require('./Usuario')
const SerializadorUsuario = require('../../Serializador').SerializadorUsuario
const auth = require('./auth.js')
const contentType = require('../middlwares').contentType

roteadorUsuario.use(contentType).post('/registro', async (req, res, proximo) => {
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

roteadorUsuario.use(contentType).post('/login', async (req, res, proximo) => {
    try {
        const [token, usuario] = await auth.autorizaUsuario(req)
        res.set('Authorization', token)
        res.status(202)
        const serializador = new SerializadorUsuario(res.getHeader('Content-Type')) 
        
        res.send(serializador.serializar(usuario))     
        
    } catch (erro) {
        res.sendStatus(401)
        proximo(erro)
    }
})

roteadorUsuario.use(contentType).get('/logout', async(req, res, proximo) => {
    try {
        const token = req.get('Authorization')
        if (!token) {
            return res.setHeader('Content-Type', 'application/json').status(418).json({messagem: "Voce ja esta deslogado!"})
            // codigo 418 foi uma piada
        }
        await auth.verificaAutorizacao(token)
        res.removeHeader('Authorization')
        // editar para rota de alteração
    } catch (erro) {
        proximo(erro)
    }
})


module.exports = roteadorUsuario