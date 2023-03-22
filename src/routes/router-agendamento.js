/*
 * Incidente
 * Certificado
 * Author : Daan Oliveira
 */

const express = require("express");
const Agenda = require("../schemas/agenda");
const Consultor = require("../schemas/consultor");
const Comments = require("../schemas/comments");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const moment = require('moment');

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

router.get("/agenda-consultor/:_id/:data", async (req, res) => {
  const { _id, data } = req.params;

  try {
    const agenda = await Agenda.find({ consultor: _id, 'agenda.inicio_consulta': data })
      .populate('consultor')
      .populate('cliente')

    res.status(200).json(agenda);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/minha-agenda/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    const agenda = await Agenda.find({ cliente: _id })
      .populate('cliente')
      .populate('consultor');

    console.log(agenda);

    res.status(200).json(agenda);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.post("/send-feedback", async (req, res) => {

  try {

    const { consultor, avaliacao, url, name, comentario } = req.body

    await Comments.create({
      url,
      name,
      avaliacao,
      comentario,
      consultor
    })

    const resConsultor = await Comments.find({ consultor: consultor })

    if (resConsultor) {

      var length = resConsultor.length
      var media = 0;

      resConsultor.forEach(element => {
        media += parseFloat(element.avaliacao)
      });

      var total = media / length;

      await Consultor.findOneAndUpdate({ _id: consultor }, {
        $set: {
          mediaAvaliacao: total.toFixed(1),
          baseAvaliacao: length
        }
      })
    } else {
      await Consultor.findOneAndUpdate({ _id: consultor }, {
        $set: {
          mediaAvaliacao: avaliacao,
          baseAvaliacao: length
        }
      })
    }
    res.status(200).json("Feedback enviado com sucesso!");
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
});

router.get("/feedback/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const feedbacks = await Comments.find({ consultor: id })

    res.status(200).json(feedbacks);
  } catch (err) {
    console.log(err);
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
