const express = require("express");
const authMiddleware = require("../middleware/auth");
const Agenda = require("../schemas/agenda");
const Comments = require("../schemas/comments");
const Consultor = require("../schemas/consultor");
const router = express.Router();

//router.use(authMiddleware);

router.post("/status", async (req, res) => {
  try {

    const { _id, value, classe } = req.body;

    await Consultor.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          status: {
            value,
            classe
          }
        },
      }
    );

    const response = await Consultor.findOne({ _id: _id })

    res.status(200).json(response.status);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get("/get-status/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const status = await Consultor.findOne({ _id: id })

    res.status(200).json(status.status);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get("/comments/:id", async (req, res) => {
  try {

    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query

    const comments = await Comments.find({ consultor: id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await Comments.find({ consultor: id }).count()

    res.status(200).json({
      totalPages: Math.ceil(count / limit),
      totalComments: count,
      currentPage: page,
      comments
    });
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

router.post("/plantao", async (req, res) => {
  try {

    const { expediente, id } = req.body;

    console.log(expediente, id);

    await Consultor.findOneAndUpdate({ _id: id },
      {
        $set: {
          'plantao.fim': expediente
        }
      })

    var user = await Consultor.findOne({ _id: id })

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post("/dashboard", async (req, res) => {
  try {

    const { id } = req.body;

    console.log(id);

    await Agenda.findOneAndUpdate({ consultor: id })

    var result = await Consultor.findOne({ _id: id })

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = (app) => app.use("/config", router);