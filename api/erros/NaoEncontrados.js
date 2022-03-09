class NaoEncontrado extends Error {
    constructor() {
        super('Modulo não encontrado')
        this.name = 'NaoEncontrado'
        this.idErro = 0
    }
}

module.exports = NaoEncontrado