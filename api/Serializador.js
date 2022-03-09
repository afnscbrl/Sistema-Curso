
const ValorNaoSuportado = require("./erros/ValorNaoSuportado")

class Serializador {
    json(dados) {
        return JSON.stringify(dados)
    }

    serializar(dados) {
        if (this.contentType === 'application/json'){
            return this.json(this.filtrar(dados))
        }

        throw new ValorNaoSuportado(this.contentType)
    }

    filtraObjeto(dados) {
        const novoObjeto = {}

        this.camposPublicos.forEach((campo) => {
            if(dados.hasOwnProperty(campo)) {
                novoObjeto[campo] = dados[campo]
            }
        })

        return novoObjeto
    }

    filtrar(dados) {
        if(Array.isArray(dados)) {
            dados = dados.map(item => this.filtraObjeto(item))
        } else {
            dados = this.filtraObjeto(dados)
        }

        return dados
    }
}

class SerializadorModulo extends Serializador {
    constructor(contentType) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'nome', 'categoria', 'totalAulas']

    }
}

class SerializadorAula extends Serializador {
    constructor(contentType) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'nome', 'modulo', 'data']

    }
}

class SerializadorErro extends Serializador {
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'mensagem']
        .concat(camposExtras || [])
    }
}

module.exports = {
    Serializador,
    SerializadorModulo,
    SerializadorAula,
    SerializadorErro,
    formatosAceitos: ['application/json']
}