const TabelaUsuario = require('./TabelaUsuario')
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos')
const CampoInvalido = require('../../erros/CampoInvalido')
const bcrypt = require('bcrypt')

class Usuario {
    constructor({ id, nome, senha}) {
        this.id = id
        this.nome = nome
        this.senha = senha
    }
    
    async criar() {
        this.validar()
        //if (contranhaSenha !== xxx) { throw new Error}
        const resultado = await TabelaUsuario.inserir({
            nome: this.nome,
            senha: await this.gerarSenhaHash(this.senha)
        }) 
        this.id = resultado.id
    }

    async carregar() {
        const encontrado = await TabelaUsuario.pegarPorNome(this.nome)
        this.id = encontrado.id
        this.senha = encontrado.senha
    }
    async carregarId() {
        const encontrado = await TabelaUsuario.pegarPorId(this.id)
        this.nome = encontrado.nome
        this.senha = encontrado.senha
    }
    
    async atualizar() {
        await TabelaUsuario.pegarPorId(this.id)
        const campos = ['nome', 'senha']
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
    
        await TabelaUsuario.atualizar(this.id, dadosAtualizar)
    }

    remover() {
        return TabelaUsuario.remover(this.id)
    }

    gerarSenhaHash(senha) {
        const custoHash = 12
        return bcrypt.hash(senha, custoHash)
    }

    validar() {
        const campos = ['nome', 'senha']
        campos.forEach(campo => {
            const valor = this[campo]

            if(typeof valor !== 'string' || valor.length === 0) {
                throw new CampoInvalido(campo)
            }
        })
    }
}


module.exports = Usuario