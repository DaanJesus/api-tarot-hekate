/*
 * Incidente
 * Certificado
 * Author : Daan Oliveira
 */

const express = require("express");
const Consultor = require("../schemas/consultor");
const router = express.Router();

router.post("/update", async (req, res) => {
    try {
        const alter = await Consultor.updateMany({},
            {
                '$set': {
                    'image.url': "http://localhost:5000/files/fed325ab3f5ce0decabe901b37c58fdc-juh.jpg"
                }
            }, { multi: true });

        res.send(alter)

    }
    catch (err) {
        res.status(400).json(err)
    }
})

router.get("/consulters", async (req, res) => {
    try {

        const consulters = await Consultor.find();

        res.status(200).json(
            consulters
        );

    } catch (err) {
        res.status(400).json(err);
    }
});

router.get("/consultor/:id", async (req, res) => {

    const { id } = req.params

    try {

        const consultor = await Consultor.findOne({ _id: id }).select("-password")

        res.status(200).json(
            consultor
        );

    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = (app) => app.use("/list", router);
