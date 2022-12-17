module.exports = {
	// PRODUÇÃO = false
	// HOMOLOGAÇÃO = true
	sandbox: process.env.SANDBOX,
	client_id: process.env.CLIENT_ID,
	client_secret: process.env.CLIENT_SECRET,
	pix_cert: process.env.PATH_CERT,
};