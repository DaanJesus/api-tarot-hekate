const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

let ClienteSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    cpf: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
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
    },
    notify: [{
        title: {
            type: String,
            default: "Bem vindo"
        },
        description: {
            type: String,
            default: "Olá, seja bem vindo ao Tarot da Hekate"
        },
        status: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
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
    if (process.env.STORAGE_TYPE == 's3') {
        return s3.deleteObject({
            Bucket: 'tarothekate',
            Key: this.image.key
        }).promise();
    } else {
        return promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "..", "tmp", "uploads", this.image.key))
    }
});

const Cliente = mongoose.model('Cliente', ClienteSchema);

module.exports = Cliente;