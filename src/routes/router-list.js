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
          baseAvaliacao: 0
        },
      },
      { multi: true }
    );

    console.log("Chegou");
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

    return res.status(200).json({consultor, totalConsultas});
  } catch (err) {
    return res.status(400).json(err);
  }
});

module.exports = (app) => app.use("/list", router);
