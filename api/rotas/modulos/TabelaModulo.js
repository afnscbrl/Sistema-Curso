
const Modelo = require('../../models/ModeloTabelaModulos')
const NaoEncontrado = require('../../erros/NaoEncontrados')

module.exports = {
    listar () {
        return Modelo.findAll({raw: true})
    },
    
    inserir(modulo) {
        return Modelo.create(modulo)
    },
    async pegarPorId(id) {
        const encontrado = await Modelo.findOne({
            where: {
                id: id
            }
        })
        if (!encontrado) {
            throw new NaoEncontrado()
        }
        return encontrado
    },

    atualizar (id, dadosAtualizar) {
        return Modelo.update(
            dadosAtualizar,
            {
                where: {id : id}
            }
        )
    },

    remover(id) {
        return Modelo.destroy({
            where: {id: id}
        })
    }

}