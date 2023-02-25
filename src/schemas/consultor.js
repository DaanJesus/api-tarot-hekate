const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const aws = require("aws-sdk");

const s3 = new aws.S3();

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
        type: Number,
        default: 5
    },
    baseAvaliacao: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    video: {
        type: String,
        default: ''
    },
    status: {
        value: {
            type: String,
            default: "Disponível"
        },
        classe: {
            type: String,
            default: "disponivel"
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
    notify: [{
        title: {
            type: String,
            default: "Bem Vindo"
        },
        description: {
            type: String,
            default: "É um prazer te-lo conosco"
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
    typelogin: {
        type: String
    }
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