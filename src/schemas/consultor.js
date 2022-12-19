const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

let ConsultorSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String,
        select: false
    },
    mediaAvaliacao: {
        type: Number
    },
    avaliation: [{
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
        createdAt: {
            type: Date,
            default: Date.now
        },
    }],
    description: {
        type: String
    },
    value: {
        type: Number
    },
    status: {
        status: {
            type: String,
            default: "Disponível"
        },
        mensagem: {
            type: String,
            default: "Em que posso te ajudar hoje?"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    image: {
        nome_file: String,
        size: Number,
        key: String,
        url: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    typelogin: {
        type: String
    }
    /* historico: [{
        type: Schema.Types.ObjectId,
        ref: 'Historico'
    }],
    comentarios: [{
        type: Schema.Types.ObjectId,
        ref: 'Comentarios'
    }], */
});

ConsultorSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    if (!this.image.url) {
        this.image.url = `${process.env.IP_LOCAL}/files/${this.image.key}`
    }

    next();
})

ConsultorSchema.pre("remove", function () {
    //console.log("Chegou aqui", this.image.key);
    if (process.env.STORAGE_TYPE == 's3') {
        return s3.deleteObject({
            Bucket: 'tarothekate',
            Key: this.image.key
        }).promise();
    } else {
        return promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", "uploads", this.image.key))
    }
});

const Consultor = mongoose.model('Consultor', ConsultorSchema);

module.exports = Consultor;