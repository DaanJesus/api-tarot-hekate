const express = require("express");
const authMiddleware = require("../middleware/auth");
const Cliente = require("../schemas/cliente");
const Comments = require("../schemas/comments");
const Consultor = require("../schemas/consultor");
const router = express.Router();

//router.use(authMiddleware);

router.post("/send-notify", async (req, res) => {
    try {

        const notify = req.body;

        await Consultor.updateMany(
            {},
            {
                $push: {
                    notify
                },
            }
        );

        await Cliente.updateMany(
            {},
            {
                $push: {
                    notify
                },
            }
        );

        res.status(200).json("Notificação enviada com sucesso!");
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.get("/get-notify/:id/:typelogin", async (req, res) => {
    try {

        const { id, typelogin } = req.params;

        if (typelogin == 'administrador') {
            const user = await Consultor.findOne({ _id: id })

            res.status(200).json(user.notify);
            return
        }

        const user = await Cliente.findOne({ _id: id })

        res.status(200).json(user.notify);

    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.post("/att-notify", async (req, res) => {
    try {

        const { id } = req.body;

        console.log(id);

        await Consultor.updateOne(
            { 'notify._id': id },
            {
                $set: {
                    'notify.$.status': true
                }
            }
        )

        const notification = await Consultor.findOne({ 'notify._id': id })

        res.status(200).json(notification);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.post("/save-video", async (req, res) => {
    try {

        const { consultor, video } = req.body;

        console.log(req.body);

        await Consultor.findOneAndUpdate({ _id: consultor },
            {
                $set: {
                    video: video
                }
            })

        var user = await Consultor.findOne({ _id: consultor })

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = (app) => app.use("/notify", router);