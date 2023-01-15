const mongoose = require('mongoose');

let PixSchema = new mongoose.Schema({
    status: {
        type: String
    },
    txid: {
        type: String
    },
    devedor: {
        type: String
    },
    valor: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Pix = mongoose.model('Pix', PixSchema);

module.exports = Pix;