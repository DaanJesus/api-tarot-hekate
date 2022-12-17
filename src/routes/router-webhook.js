const express = require("express");
const router = express.Router();
var fs = require("fs");

const Gerencianet = require('gn-api-sdk-node');
const options = require('../credentials/credentials');
const gerencianet = new Gerencianet(options);

options['validateMtls'] = true;

let body = {
    "webhookUrl": "http://api.tarothekate/webhook/"
}

let params = {
    "chave": "fb525436-eb0b-405f-9366-663bd0c176ea"
}

router.post("/config-webhook", (request, response) => {

    try {

        gerencianet.pixConfigWebhook(params, body)
            .then((resposta) => {
                console.log(resposta);
            })
            .catch((error) => {
                console.log(error);
            })

    } catch (error) {
        res.status(400).json(error);
    }
});

router.post("/webhook/pix", (request, response) => {
    if (request.socket.authorized) {
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
    } else {
        response.status(401).end();
    }
});

module.exports = (app) => app.use("/webhook", router);