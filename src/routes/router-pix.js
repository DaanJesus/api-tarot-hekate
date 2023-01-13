const express = require("express");
const router = express.Router();
const GNRequest = require('../config/gerencianet')

const Gerencianet = require('gn-api-sdk-node');
const options = require('../credentials/credentials');
const gerencianet = new Gerencianet(options);
const reqGnAlready = GNRequest();

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

    const reqGn = await reqGnAlready;
    const body = req.body;

    try {

        const cobResponse = await reqGn.post('/v2/cob', body)
        const qrCodeResponse = await reqGn.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`)

        res.status(200).json({ resposta: cobResponse.data, qrcode: qrCodeResponse.data })

    } catch (err) {
        console.log('Request', err);
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