const axios = require("axios");
var fs = require("fs");
const path = require("path");
const https = require("https");

const cert = fs.readFileSync(path.resolve(__dirname, process.env.PATH_CERTIFICADO))

const credential = Buffer(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
).toString('base64')

console.log(credential);
const agent = new https.Agent({
    pfx: cert,
    passphrase: ''
})

const authenticate = () => {
    return axios({
        method: "POST",
        url: `${process.env.URL_PIX}/oauth/token`,
        headers: {
            Authorization: `Basic ${credential}`,
            "Content-Type": "application/json",
        },
        httpsAgent: agent,
        data: {
            grant_type: "client_credentials"
        }
    })
};

const GNRequest = async () => {
    const authResponse = await authenticate();
    const accessToken = authResponse.data?.access_token;

    return axios.create({
        baseURL: process.env.URL_PIX,
        httpsAgent: agent,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
}

module.exports = GNRequest;