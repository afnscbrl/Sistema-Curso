class DadosNaoFornecidos extends Error {
    constructor() {
        super('Não foram foram fornecidos dados para atualizar')
        this.name = 'DadosNaoFornecidos'
        this.idErro = 2
    }
}

module.exports = DadosNaoFornecidos