const mongoose = require('mongoose');

let NotifySchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
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