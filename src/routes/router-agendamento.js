/*
 * Incidente
 * Certificado
 * Author : Daan Oliveira
 */

const express = require("express");
const Agenda = require("../schemas/agenda");
const router = express.Router();

router.post("/update", async (req, res) => {
    try {
        const alter = await Agenda.updateMany({},
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

router.post("/agendar", async (req, res) => {


    try {
        const { cliente, consultor, agenda } = req.body

        const resp = await Agenda.create({
            cliente: cliente,
            consultor: consultor,
            agenda: agenda
        });

        res.status(200).json(
            resp
        );

    } catch (err) {
        res.status(400).json({ err });
    }
});

router.get("/agenda-consultor/:cliente", async (req, res) => {

    const { cliente } = req.params

    try {

        const consulta = await Agenda.find({ cliente: cliente });

        res.status(200).json(
            consulta
        );

    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = (app) => app.use("/agendamento", router);
