const mongoose = require('mongoose');

let CommentsSchema = new mongoose.Schema({
    url: {
        type: String
    },
    name: {
        type: String
    },
    avaliacao: {
        type: String
    },
    comentario: {
        type: String
    },
    consultor: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

const Comments = mongoose.model('Comments', CommentsSchema);

module.exports = Comments;