const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

let AgendaSchema = new mongoose.Schema({
    consultor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultor'
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente'
    },
    agenda: {
        hora_inicio_consulta: {
            type: String
        },
        hora_fim_consulta: {
            type: String
        },
        inicio_consulta: {
            type: String
        },
        fim_consulta: {
            type: String
        }
    },
    avaliacao: {
        estrelas: {
            type: String,
        },
        descricao: {
            type: String
        },
        nivel: {
            type: String
        }
    },
    valor: {
        type: String
    },
    valor_tarologo: {
        type: String
    },
    valor_site: {
        type: String
    },
    confirma_agenda: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Agenda = mongoose.model('Agenda', AgendaSchema);

module.exports = Agenda;