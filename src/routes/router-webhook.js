const express = require("express");
const router = express.Router();
var fs = require("fs");

const Gerencianet = require('gn-api-sdk-node');
const options = require('../credentials/credentials');
const gerencianet = new Gerencianet(options);

options['validateMtls'] = true;

let body = {
    "webhookUrl": "https://api.tarothekate.com/webhook/"
}

let params = {
    "chave": "fb525436-eb0b-405f-9366-663bd0c176ea"
}

router.post("/", (req, res) => {

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