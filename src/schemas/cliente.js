const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

let ClienteSchema = new mongoose.Schema({
    nome: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
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
    /* historico: [{
        type: Schema.Types.ObjectId,
        ref: 'Historico'
    }],
    comentarios: [{
        type: Schema.Types.ObjectId,
        ref: 'Comentarios'
    }], */
});

ClienteSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    if (!this.image.url) {
        this.image.url = `${process.env.IP_LOCAL}/files/${this.image.key}`
    }

    next();
})

ClienteSchema.pre("remove", function () {
    //console.log("Chegou aqui", this.image.key);
    if (process.env.STORAGE_TYPE == 's3') {
        return s3.deleteObject({
            Bucket: 'uploadforsale',
            Key: this.image.key
        }).promise();
    } else {
        return promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "..", "tmp", "uploads", this.image.key))
    }
});

const Cliente = mongoose.model('Cliente', ClienteSchema);

module.exports = Cliente;