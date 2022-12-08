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
                            res.status(400).json(error);

                        })
                }

            })
            .catch((error) => {
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

router.post("/webhook", (request, response) => {
    // Verifica se a requisição que chegou nesse endpoint foi autorizada
    if (request.socket.authorized) { 
        response.status(200).end();
    } else {
        response.status(401).end();
    }
});

router.post("/webhook/pix", (request, response) => {
    if (request.socket.authorized){
        //Seu código tratando a callback
        /* EXEMPLO:
        var body = request.body;
        filePath = __dirname + "/data.json";
        fs.appendFile(filePath, JSON.stringify(body) + "\n", function (err) {
            if (err) {
                console.log(err);
            } else {
                response.status(200).end();
            }
        })*/
        response.status(200).end();
    }else{
        response.status(401).end();
    }
});

module.exports = (app) => app.use("/pix", router);