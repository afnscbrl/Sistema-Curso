
const Usuario = require('./Usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {

    autorizaUsuario:
    async function autorizaUsuario(req) {
        const {nome, senha} = req.body
        const usuario = new Usuario({nome: nome})
        await usuario.carregar()
        const senhaValida = await bcrypt.compare(senha, usuario.senha)
        if(!usuario || !senhaValida) {
            throw new Error('Nome ou senha invalidos')
        }
        
        const payload = {
            id: usuario.id
        }
        
        const token = jwt.sign(payload, process.env.CHAVE_JWT, {expiresIn: '15m'})
        return [token, usuario]
    },

    verificaAutorizacao:
    async function verificaAutorizacao(token) {
            const payload = jwt.verify(token, process.env.CHAVE_JWT, (err, decoded) => {
                if (err) {
                    throw new Error(err)
                } else {
                    return decoded
                }
            })
            const usuario = new Usuario({id: payload.id})
            await usuario.carregarId()

    }
}


