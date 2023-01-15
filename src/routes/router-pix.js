const express = require("express");
const router = express.Router();
const Pix = require("../schemas/pix");

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

        console.log(cobResponse.data)

        await Pix.create({
            status: cobResponse.data.status,
            txid: cobResponse.data.txid,
            devedor: cobResponse.data.devedor.cpf,
            valor: cobResponse.data.valor.original,
        })

        res.status(200).json({ resposta: cobResponse.data, qrcode: qrCodeResponse.data })

    } catch (err) {
        console.log('Request', err);
        res.status(400).json({ err });
    }
})

router.post('/status', async (req, res) => {

    console.log(req.body);

    const reqGn = await reqGnAlready;

    try {

        const pixStatus = await reqGn.get(`/v2/cob/${req.body.txid}`)

        res.status(200).json(pixStatus.data)

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