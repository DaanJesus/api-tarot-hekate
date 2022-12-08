/*
 * Incidente
 * Certificado
 * Author : Daan Oliveira
 */

const express = require("express");
const Agenda = require("../schemas/agenda");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

//router.use(authMiddleware);

router.post("/agendar", async (req, res) => {

  let consulta = req.body
  try {

    const resp = await Agenda.create(
      consulta
    );

    res.status(200).json(resp);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

router.get("/agenda-consultor/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    const agenda = await Agenda.find({ consultor: _id })
      .populate('consultor');

    res.status(200).json(agenda);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/minha-agenda/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    const agenda = await Agenda.find({ cliente: _id })
      .populate('cliente');

    res.status(200).json(agenda);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/historico/:_id", async (req, res) => {
  const { _id } = req.params;
  console.log(_id);
  try {
    const agenda = await Agenda.find({ cliente: _id })
      .populate("cliente")
      .populate("consultor")

    res.status(200).json(agenda);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = (app) => app.use("/agendamento", router);
