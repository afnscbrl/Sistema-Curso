
const roteadorUsuario = require('express').Router()
const Usuario = require('./Usuario')
const SerializadorUsuario = require('../../Serializador').SerializadorUsuario
const auth = require('./auth.js')

roteadorUsuario.post('/registro', async (req, res, proximo) => {
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

roteadorUsuario.post('/login', async (req, res, proximo) => {
    try {
        const [token, usuario] = await auth.autorizaUsuario(req)
        res.set('Authorization', token)
        res.status(202)
        const serializador = new SerializadorUsuario(res.getHeader('Content-Type')) 
        
        res.send(serializador.serializar(usuario))     
        //return res.redirect(200, '../modulos/')
        //console.log(res.getHeader('Content-Type'))
        // editar para rota de alteração
    } catch (erro) {
        proximo(erro)
    }
})

roteadorUsuario.get('/logout', async(req, res, proximo) => {
    try {
        const token = req.get('Authorization')
        if (!token) {
            return res.setHeader('Content-Type', 'application/json').status(418).json({messagem: "Voce ja esta deslogado!"})
            // codigo 418 foi uma piada
        }
        await auth.verificaAutorizacao(token)
        res.removeHeader('Authorization')
        return res.setHeader('Content-Type', 'application/json').redirect('../modulos/')
        // editar para rota de alteração
    } catch (erro) {
        proximo(erro)
    }
})


// roteadorUsuario.put('/:idUsuario', async(req, res, proximo) => {

//     try {
//         const id = req.params.idUsuario
//         const dadosRecebidos = req.body
//         const dados = Object.assign({}, dadosRecebidos, {id: id})
//         const usuario = new Usuario(dados)
//         await usuario.atualizar()
//         res.status(204)
//         res.end()
//     } catch(erro) {
//         proximo(erro)
//     }

// })

// roteadorUsuario.delete('/:idUsuario', async (req, res, proximo) => {
//     try {
//         const id = req.params.idUsuario
//         const usuario = new Usuario({ id: id})
//         await usuario.carregar()
//         await usuario.remover()
//         res.status(204)
//         res.end()
//     } catch(erro) {
//         proximo(erro)
//     }
// })


module.exports = roteadorUsuario