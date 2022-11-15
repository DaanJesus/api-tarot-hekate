const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

let AgendaSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente'
    },
    consultor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultor'
    },
    agenda: {
        data_consulta: {
            type: Date
        },
        hora_inicio: {
            type: String
        },
        hora_fim: {
            type: String
        },
        valor: {
            type: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Agenda = mongoose.model('Agenda', AgendaSchema);

module.exports = Agenda;