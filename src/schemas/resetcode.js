const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let ResetCodeSchema = new mongoose.Schema({
    code: {
        type: Number
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

const ResetCode = mongoose.model('ResetCode', ResetCodeSchema);

module.exports = ResetCode;