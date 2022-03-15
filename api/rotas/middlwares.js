const auth = require('./usuarios/auth')
const formatosAceitos = require('../Serializador').formatosAceitos

module.exports = {
    verificaToken:
    async function(req, res, proximo) {
       try {
           const token = req.get('Authorization')
           await auth.verificaAutorizacao(token, res)
           proximo()
       } catch (erro) {
           
           // proximo(erro)
           res.status(401).send({Error: erro.message})
           
       }
    },
    contentType:
    function (req, res, proximo) {
            let formatoReq = req.header('Accept')
            
            if(formatoReq === '*/*') {
                formatoReq = 'application/json'
            }
            
            // if(formatosAceitos.indexOf(formatoReq) === -1) {
                //     res.status(406)
                //     res.end()
                //     return
                // }
                
            res.setHeader('Content-Type', formatoReq)
            proximo()
                    
    }     
}
