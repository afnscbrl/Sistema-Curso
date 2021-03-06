const TabelaAula = require('./TabelaAula')
const ModeloMod = require('../../models/ModeloTabelaModulos')
const CampoInvalido = require('../../erros/CampoInvalido')
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos')

class Aula {
    constructor({ id, nome, modulo, data, duracao}) {
        this.id = id
        this.nome = nome
        this.modulo = modulo
        this.data = data
        this.duracao = duracao

    }

    async criar() {
        this.validar()
        const modNome = await ModeloMod.findOne({
            where: { 
                nome: this.modulo}
            })
        if(!modNome) {
            throw new CampoInvalido('modulo')
        }
        const resultado = await TabelaAula.inserir({
            nome: this.nome,
            modulo: this.modulo,
            data: this.data,
            duracao: this.duracao
        })

        this.id = resultado.id
    }

    async carregar() {
        const encontrado = await TabelaAula.pegarPorId(this.id)
        this.nome = encontrado.nome
        this.modulo = encontrado.modulo
        this.data = encontrado.data
        this.duracao = encontrado.duracao
    }

    async atualizar() {
        await TabelaAula.pegarPorId(this.id)
        const campos = ['nome', 'modulo', 'data', 'duracao']
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
    
        await TabelaAula.atualizar(this.id, dadosAtualizar)
    }

    remover() {
        return TabelaAula.remover(this.id)
    }

    validar() {
        const campos = ['nome', 'modulo', 'data', 'duracao']
        campos.forEach(campo => {
            const valor = this[campo]

            if(typeof valor !== 'string' || valor.length === 0) {
                throw new CampoInvalido(campo)
            }
        })

    }
}


module.exports = Aula