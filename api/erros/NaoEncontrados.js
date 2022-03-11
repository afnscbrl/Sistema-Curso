class NaoEncontrado extends Error {
    constructor(arg) {
        super(`${arg} não encontrado`)
        this.name = 'NaoEncontrado'
        this.idErro = 0
    }
}

module.exports = NaoEncontrado