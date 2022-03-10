
const Modelo = require('../../models/ModeloUsuarios')

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
    remover(id) {
        return Modelo.destroy({
            where: {id: id}
        })
    }

}