const express = require("express");
const router = express.Router();

const GNRequest = require('../config/gerencianet')
const reqGnAlready = GNRequest();

/* router.post('/evp', async (req, res) => {
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
}) */

router.post('/create', async (req, res) => {

    const reqGn = await reqGnAlready;
    const body = req.body;

    try {

        const cobResponse = await reqGn.post('/v2/cob', body)
        if (!cobResponse.data.loc.id) {
            return res.status(400).json("Houve um erro ao tentar criar a cobrança.")
        }

        const qrCodeResponse = await reqGn.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`)
        res.status(200).json({ resposta: cobResponse.data, qrcode: qrCodeResponse.data })

    } catch (err) {
        console.log('Request', err);
        res.status(400).json({ err });
    }
})

router.get('/status/:txid', async (req, res) => {

    var interval;
    const { txid } = req.params
    const reqGn = await reqGnAlready;
    var pixStatus;

    try {
        interval = setInterval(async () => {
            pixStatus = await reqGn.get(`/v2/cob/${txid}`)

            if (pixStatus && pixStatus.data.status == "CONCLUIDA") {
                clearInterval(interval);
                res.status(200).json(pixStatus.data)
            }
        }, 3000)

    } catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
})

/* router.get('/listPix', async (req, res) => {
    let params = {
        inicio: "2023-01-15T16:01:35Z",
        fim: "2023-01-16T12:37:35Z"
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
}) */

module.exports = (app) => app.use("/pix", router);