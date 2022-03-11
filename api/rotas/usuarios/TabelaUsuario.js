
const Modelo = require('../../models/ModeloUsuarios')
const NaoEncontrado = require('../../erros/NaoEncontrados')

module.exports = {
    
    inserir(modulo) {
        return Modelo.create(modulo)
    },
    atualizar (id, dadosAtualizar) {
        return Modelo.update(
            dadosAtualizar,
            {
                where: {id : id}
            }
        )
    },

    async pegarPorNome(nome) {
        const encontrado = await Modelo.findOne({
            where: {
                nome: nome
            }
        })
        if (!encontrado) {
            throw new NaoEncontrado('Usuário')
        }
        return encontrado
    },
    async pegarPorId(id) {
        const encontrado = await Modelo.findOne({
            where: {
                id: id
            }
        })
        if (!encontrado) {
            throw new NaoEncontrado('Usuário')
        }
        return encontrado
    },

    remover(id) {
        return Modelo.destroy({
            where: {id: id}
        })
    }

}