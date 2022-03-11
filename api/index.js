require('dotenv/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrados')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro


app.use(bodyParser.json())

app.use((req, res, proximo) => {
    let formatoReq = req.header('Accept')
    
    if(formatoReq === '*/*') {
        formatoReq = 'application/json'
    }
    
    if(formatosAceitos.indexOf(formatoReq) === -1) {
        res.status(406)
        res.end()
        return
    }
    
    res.setHeader('Content-Type', formatoReq)
    proximo()
    
    
})



const roteadorModulos = require('./rotas/modulos')
app.use('/api/modulos', roteadorModulos)

const roteadorAulas = require('./rotas/aulas')
app.use('/api/aulas', roteadorAulas)

const roteadorUsuario = require('./rotas/usuarios')
app.use('/api/users', roteadorUsuario)

app.use((erro, req, res, proximo) => {
    let status = 500

    if(erro instanceof NaoEncontrado) {
        status = 404
    }

    if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos)  {
        status = 400
    }

    if(erro instanceof ValorNaoSuportado) {
        status = 406
    }
    
    const serializador = new SerializadorErro(
        res.getHeader('Content-Type')
    )
    res.status(status)
    res.send(
        serializador.serializar({
            mensagem: erro.message,
            id: erro.IdErro
        })
    ) 
} )

app.listen(config.get('api.porta'), () => console.log("A Api esta ok"))