
const ValorNaoSuportado = require("./erros/ValorNaoSuportado")

class Serializador {
    json(dados) {
        return JSON.stringify(dados)
    }

    serializar(dados) {
        if (this.contentType === 'application/json' || this.contentType === 'application/json; charset=utf-8' || this.contentType === 'text/plain; charset=utf-8'){
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
        this.camposPublicos = ['id', 'nome', 'categoria', 'totalAulas', 'totalHoras']

    }
}

class SerializadorAula extends Serializador {
    constructor(contentType) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'nome', 'modulo', 'data', 'duracao']

    }
}

class SerializadorUsuario extends Serializador {
    constructor(contentType) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'nome']

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
    SerializadorUsuario,
    SerializadorErro,
    formatosAceitos: ['application/json']
}