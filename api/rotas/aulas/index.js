const Sequelize = require('sequelize')
const roteadorAulas = require('express').Router()
const TabelaAulas = require('./TabelaAula')
const Aula = require('./Aula')
const Modulo = require('../modulos/Modulo')
const Modelo = require('../../models//ModeloTabelaAulas')
const ModeloMod = require('../../models//ModeloTabelaModulos')
const TabelaModulo = require('../modulos/TabelaModulo')
const SerializadorAula = require('../../Serializador').SerializadorAula
const auth = require('../usuarios/auth')
const verificaToken = require('../middlwares').verificaToken
const contentType = require('../middlwares').contentType
const c = require('config')


roteadorAulas.use(contentType).get('/', async (req, res) => {
    const resultados = await TabelaAulas.listar()
    console.log(resultados)
    res.status(200)

    const serializador = new SerializadorAula(
        res.getHeader('Content-Type')
    ) 
    res.send(
        serializador.serializar(resultados)
    )
})

roteadorAulas.use(contentType).get('/:idModulo', async (req, res, proximo) =>{

    try {
        const id = req.params.idModulo
        const modulo = new Modulo({ id: id})
        await modulo.carregar()        
        const encontrado = await Modelo.findAll({
            where: {
                modulo: modulo.nome
            },
            raw:true
        })

        console.log(encontrado)
        
        res.status(200)
        const serializador = new SerializadorAula(
            res.getHeader('Content-Type')
        ) 
        res.send(
            serializador.serializar(encontrado)
        )
    
    } catch(erro) {
        proximo(erro)
    }
})

roteadorAulas.use(contentType, verificaToken)
    .post('/', async (req, res, proximo) => {
    try {
        const dadosRecebidos = req.body
        dadosRecebidos.nome = dadosRecebidos.nome.charAt(0)
        .toUpperCase() + dadosRecebidos.nome.slice(1)
        const aula = new Aula(dadosRecebidos)
        await aula.criar()
        res.status(201)
        const moduloAula = aula.modulo
        //const aulaHoras = aula.duracao
        const totalAmountMod = await Modelo.findAll({raw:true, 
            attributes: [
                [Sequelize.fn('count', Sequelize.col('modulo')), 'total_amount'],
            ],
            where: {modulo : moduloAula},
            });

        const totalAmountHoras = await Modelo.findAll({raw:true, 
            attributes: [
                [Sequelize.fn('sum', Sequelize.col('duracao')), 'total_horas'],
            ],
            where: {modulo : moduloAula},
            });            

        const serializador = new SerializadorAula(
            res.getHeader('Content-Type')
        ) 
        res.send(
            serializador.serializar(aula)
        )
        
        const totalAulas = Object.values(totalAmountMod[0])
        const totalHoras = Object.values(totalAmountHoras[0])
        //----------
        const encontrado = await ModeloMod.findOne({
            where: {
                nome: moduloAula
            }
        })
        const totais = {
            totalAulas: totalAulas[0],
            totalHoras: totalHoras[0]
        }
        await TabelaModulo.atualizar(encontrado.id, totais)

    }catch (erro) {
        proximo(erro)
    }
})


roteadorAulas.use(contentType, verificaToken)
    .put('/:idAula', async(req, res, proximo) => {

    try {
        const id = req.params.idAula
        const dadosRecebidos = req.body
        dadosRecebidos.nome = dadosRecebidos.nome.charAt(0)
            .toUpperCase() + dadosRecebidos.nome.slice(1)
        const dados = Object.assign({}, dadosRecebidos, {id: id})
        const aula = new Aula(dados)
        await aula.atualizar()
        res.status(204)
        const moduloAula = aula.modulo
        //const aulaHoras = aula.duracao
        const totalAmountMod = await Modelo.findAll({raw:true, 
            attributes: [
                [Sequelize.fn('count', Sequelize.col('modulo')), 'total_amount'],
            ],
            where: {modulo : moduloAula},
            });

        const totalAmountHoras = await Modelo.findAll({raw:true, 
            attributes: [
                [Sequelize.fn('sum', Sequelize.col('duracao')), 'total_horas'],
            ],
            where: {modulo : moduloAula},
            });            
        
        const totalAulas = Object.values(totalAmountMod[0])
        const totalHoras = Object.values(totalAmountHoras[0])
        //----------
        const encontrado = await ModeloMod.findOne({
            where: {
                nome: moduloAula
            }
        })
        const totais = {
            totalAulas: totalAulas[0],
            totalHoras: totalHoras[0]
        }
        await TabelaModulo.atualizar(encontrado.id, totais)
        // res.end()
    } catch(erro) {
        proximo(erro)
    }

})

roteadorAulas.use(contentType, verificaToken)
    .delete('/:idAula', async (req, res, proximo) => {
    try {
        const id = req.params.idAula
        const aula = new Aula({ id: id})
        await aula.carregar()
        await aula.remover()
        res.status(204)
        const moduloAula = aula.modulo
       
        const totalAmountMod = await Modelo.findAll({raw:true, 
            attributes: [
                [Sequelize.fn('count', Sequelize.col('modulo')), 'total_amount'],
            ],
            where: {modulo : moduloAula},
            });
        
        const totalAmountHoras = await Modelo.findAll({raw:true, 
            attributes: [
                [Sequelize.fn('sum', Sequelize.col('duracao')), 'total_horas'],
            ],
            where: {modulo : moduloAula},
            });            
        
        const totalAulas = Object.values(totalAmountMod[0])
        const totalHoras = Object.values(totalAmountHoras[0])
        //----------
        const encontrado = await ModeloMod.findOne({
            where: {
                nome: moduloAula
            }
        })
        
        const totais = {
            totalAulas: totalAulas[0],
            totalHoras: (totalHoras[0] || 0)
        }
        console.log(totais)
        await TabelaModulo.atualizar(encontrado.id, totais)
        
        res.end()
    } catch(erro) {
        proximo(erro)
    }
})

module.exports = roteadorAulas