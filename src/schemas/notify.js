const mongoose = require('mongoose');

let NotifySchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Bem vindo'
    },
    description: {
        type: String,
        default: 'Seja bem vindo ao Tarot da Hékate'
    },
    status: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notify = mongoose.model('Notify', NotifySchema);

module.exports = Notify;