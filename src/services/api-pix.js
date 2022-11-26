const sdk = require('api')('@devpagseguro/v2.0#1fbzyjg0la9zasaj');

sdk.pixOauth({
    grant_type: 'client_credentials',
    scope: 'string'
}, {
    username: 'v38188079427069313112@sandbox.pagseguro.com.br',
    password: '67257D1BPKmm4N69'
})
    .then(({ data }) => console.log(data))
    .catch(err => console.error(err));

module.exports = ApiPix;