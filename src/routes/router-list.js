/*
 * Incidente
 * Certificado
 * Author : Daan Oliveira
 */

const express = require("express");
const authMiddleware = require("../middleware/auth");
const Agenda = require("../schemas/agenda");
const Consultor = require("../schemas/consultor");
const router = express.Router();

//router.use(authMiddleware);

router.post("/update", async (req, res) => {
  try {
    const alter = await Consultor.updateMany(
      {},
      {
        $set: {
          plantao: {
            inicio: "10:00",
            pausa: "13:20",
            fimpausa: "13:30",
            fim: "17:00"
          },
        },
      },
      { multi: true }
    );

    res.status(200).json(alter);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get("/consulters", async (req, res) => {
  try {
    const consulters = await Consultor.find();

    res.status(200).json(consulters);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/consultor/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const consultor = await Consultor.findOne({ _id: id });
    const totalConsultas = await Agenda.find({ consultor: id }).count();

    return res.status(200).json({ consultor, totalConsultas });
  } catch (err) {
    return res.status(400).json(err);
  }
});

module.exports = (app) => app.use("/list", router);
