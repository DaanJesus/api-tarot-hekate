const multer = require('multer');
const multerS3 = require('multer-s3');
const crypto = require('crypto');
const path = require('path');
const aws = require("aws-sdk")

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err)

                file.key = `${hash.toString('hex')}-${file.originalname}`

                cb(null, file.key)
            })
        }
    }),

    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'uploadforsale',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err)

                const fileName = `${hash.toString('hex')}-${file.originalname}`

                cb(null, fileName)
            })
        }
    })
}
module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes[process.env.STORAGE_TYPE || "local"],
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/jpg'
        ];

        console.log(file);

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Tipo de arquivo invalido"))
        }
    },
}