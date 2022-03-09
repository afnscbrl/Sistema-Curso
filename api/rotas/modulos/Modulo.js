const TabelaModulo = require('./TabelaModulo')
const CampoInvalido = require('../../erros/CampoInvalido')
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos')

class Modulo {
    constructor({ id, nome, categoria, totalAulas}) {
        this.id = id
        this.nome = nome
        this.categoria = categoria
        this.totalAulas = totalAulas
    }

    async criar() {
        this.validar()
        const resultado = await TabelaModulo.inserir({
            nome: this.nome,
            categoria: this.categoria,            
        })
        this.id = resultado.id
    }

    async carregar() {
        const encontrado = await TabelaModulo.pegarPorId(this.id)
        this.nome = encontrado.nome
        this.categoria = encontrado.categoria 
        this.totalAulas = encontrado.totalAulas

    }

    async atualizar() {
        await TabelaModulo.pegarPorId(this.id)
        const campos = ['nome', 'categoria']
        const dadosAtualizar = {}
        campos.forEach((campo) => {
            const valor = this[campo]
            if(typeof valor === 'string' && valor.length > 0) {
                dadosAtualizar[campo] = valor
            }
        })
        if(Object.keys(dadosAtualizar).length === 0) {
            throw new DadosNaoFornecidos()
        }
    
        await TabelaModulo.atualizar(this.id, dadosAtualizar)
    }

    remover() {
        return TabelaModulo.remover(this.id)
    }

    validar() {
        const campos = ['nome', 'categoria']
        campos.forEach(campo => {
            const valor = this[campo]

            if(typeof valor !== 'string' || valor.length === 0) {
                throw new CampoInvalido(campo)
            }
        })
    }
}


module.exports = Modulo