const express = require("express");
const router = express.Router();
var fs = require("fs");

const Gerencianet = require('gn-api-sdk-node');
const options = require('../credentials/credentials');
const gerencianet = new Gerencianet(options);

router.post('/evp', async (req, res) => {
    try {

        gerencianet.gnCreateEvp()
            .then((resposta) => {
                console.log(resposta);
                res.status(200).json(resposta)
            })
            .catch((error) => {
                res.status(400).json(error);

            })

    } catch (error) {
        res.status(400).json(error);
    }
})

router.post('/create', async (req, res) => {

    const body = req.body;

    console.log(req.body);

    try {

        gerencianet.pixCreateImmediateCharge([], body)
            .then((resposta) => {

                if (resposta['txid']) {
                    var payload = {
                        'id': resposta['loc']['id']
                    }

                    gerencianet.pixGenerateQRCode(payload)
                        .then((qrcode) => {
                            res.status(200).json({ resposta, qrcode })

                        })
                        .catch((error) => {
                            console.log("pixGenerateQRCode ",error);
                            res.status(400).json(error);

                        })
                }

            })
            .catch((error) => {
                console.log("pixCreateImmediateCharge ",error);
                res.status(400).json(error);
            })

    } catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
})

router.post('/status', async (req, res) => {

    console.log(req.body);

    let params = {
        txid: "df2e39c60650413ca3af2932b7281d86"
    }

    try {

        gerencianet.pixDetailCharge(params)
            .then((resposta) => {
                res.status(200).json(resposta)
            })
            .catch((error) => {
                console.log(error);
                res.status(400).json({ error });

            })

    } catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
})

router.get('/listPix', async (req, res) => {
    let params = {
        inicio: "2022-12-01T16:01:35Z",
        fim: "2022-12-31T08:37:35Z"
    }
    try {

        gerencianet.pixListCharges(params)
            .then((resposta) => {
                console.log(resposta);
                res.status(200).json(resposta)

            })
            .catch((error) => {
                console.log(error);
                res.status(400).json({ error });

            })

    } catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
})

module.exports = (app) => app.use("/pix", router);