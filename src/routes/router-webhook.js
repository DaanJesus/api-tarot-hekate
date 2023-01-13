const express = require("express");
const router = express.Router();
var fs = require("fs");

const Gerencianet = require('gn-api-sdk-node');
const options = require('../credentials/credentials');

options['validateMtls'] = true;
const gerencianet = new Gerencianet(options);

let body = {
    "webhookUrl": "https://api.tarothekate.com/webhook/"
}

let params = {
    "chave": "fb525436-eb0b-405f-9366-663bd0c176ea"
}

router.put("/", (req, res) => {

    try {

        gerencianet.pixConfigWebhook(params, body)
            .then((resposta) => {
                res.status(200).json(resposta)
            })
            .catch((error) => {
                res.status(400).json(error);
            })

    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/", (req, res) => {

    if (req.socket.authorized) {
        res.status(200).end();
    } else {
        res.status(401).end();
    }
});

router.post("/pix", (req, res) => {
    if (req.socket.authorized) {

        var body = req.body;
        var filePath = __dirname + "../data.json";
        fs.appendFile(filePath, JSON.stringify(body) + "\n", function (err) {
            if (err) {
                console.log(err);
            } else {
                response.status(200).end();
            }
        })

        res.status(200).json("Sucesso ao registrar o webhook");
    } else {
        res.status(401).json("falha ao geristrar webhook");
    }
})

router.get("/:chave", (req, res) => {

    try {
        const { chave } = req.params;

        gerencianet.pixDetailWebhook(chave)
            .then((resposta) => {
                console.log(resposta);
                res.status(200).json(resposta)
            })
            .catch((error) => {
                console.log(error);
                res.status(400).json(error)
            })

    } catch (err) {
        res.status(400).json(err)
    }

});

module.exports = (app) => app.use("/webhook", router);