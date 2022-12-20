const express = require("express");
const authMiddleware = require("../middleware/auth");
const Agenda = require("../schemas/agenda");
const Consultor = require("../schemas/consultor");
const router = express.Router();

//router.use(authMiddleware);

router.post("/status", async (req, res) => {
  try {

    const { _id, status, mensagem, tempo } = req.body;

    const alter = await Consultor.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          status: {
            status: status,
            mensagem: mensagem,
            tempo: tempo
          }
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

router.get("/comments/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const comments = await Consultor.findOne({ _id: id })
      .skip(0)
      .limit(5)

    res.status(200).json(comments.avaliation);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = (app) => app.use("/config", router);