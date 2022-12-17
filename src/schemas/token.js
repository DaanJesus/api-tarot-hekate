const mongoose = require('mongoose');

let TokenSchema = new mongoose.Schema({
    token: {
        type: String
    },
    rest: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;