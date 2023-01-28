require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('./swaggerDocs.json');
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

const app = express();

const server = require('http').Server(app)
const io = require('socket.io')(server, {
  options: {
    cors: '*'
  }
});

const SERVER_PORT = Number(process.env.SERVER_PORT || 5000);

var room = []
var socketsStatus = []
io.on('connection', (socket) => {

  const socketId = socket.id;
  socketsStatus[socket.id] = {};

  socket.on('join', (data, callback) => {

    socket.join(data.roomId)

    if (room.length == 0) {

      room.push({
        roomId: data.roomId,
        users: [data.user],
        messages: []
      })
    }

    if (room.length > 0) {

      var jaTem = false;

      room.forEach(el => {

        if (data.roomId == el.roomId) {
          jaTem = true
          return
        }
      })

      if (jaTem) {

        room.find((element, index) => {

          if (data.roomId == element.roomId) {
            var userJoined = room[index].users.find(({ idUser }) => idUser === data.user.idUser)

            if (userJoined == undefined) {
              room[index].users.push(data.user)
              socket.broadcast.to(room[index].roomId).emit('userLogged', room[index].users)
            }

            callback({
              users: room[index].users,
              messages: room[index].messages
            })
          }

        })

      } else {

        room.push({
          roomId: data.roomId,
          users: [data.user]
        })

        callback({
          users: room[room.length - 1].users
        })
      }
    }
  })

  /* socket.on('disconnect', data => {
    console.log(io.sockets);
    socket.leave()
  }) */

  socket.on('leave', data => {
    room.find((element, index) => {
      if (data.roomId == element.roomId) {
        var usersRest = room[index].users.find(({ idUser }) => idUser !== data.idUser)
        room[index].users = [usersRest]
        if (usersRest == undefined) {
          room[index].users = []
          room[index].messages = []
        }
        socket.leave(data.roomId)
        socket.broadcast.to(room[index].roomId).emit('userLogged', room[index].users)
      }
    })
  })

  socket.on('sendMessage', data => {

    room.find((element, index) => {

      if (data.roomId == element.roomId) {
        room[index].messages.push(data.message)
        socket.broadcast.to(room[index].roomId).emit('receivedMessage', data.message)
      }
    })

  })

  socket.on('voice', data => {

    var newData = data.split(";");
    newData[0] = "data:audio/ogg;";
    newData = newData[0] + newData[1];

    for (const id in socketsStatus) {

      if (id != socketId && !socketsStatus[id].mute && socketsStatus[id].online)
        socket.broadcast.to(id).emit("received-voice", newData);
    }
  })

})

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));

app.use(express.json());
app.use(morgan("dev"));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.get("/", async (req, res) => {
  res.redirect("/api-docs");
});

app.post("/webhook(/pix)?", async (req, res) => {
  console.log(req.body);

  /* if (req.status == 200) {
    await Pix.findOneAndUpdate({ txid: req.body.pix[0].txid }, {
      $set: {
        status: "Finalizado"
      },
    })
    res.status(200).json({ message: "Pagamento processado com sucesso." });
    return
  }

  res.status(400).json({ message: "Falha ao processar o pagamento." }) */
});

require("./routes/index")(app);

mongoose
  .connect(process.env.URL_MONGO, {
    useNewUrlParser: true,
    /* useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true, */
  })
  .then(
    () => {
      console.log("Success connect to: ", SERVER_PORT);
    },
    (err) => {
      console.log("Error connect to: " + err);
    }
  );

server.listen(SERVER_PORT, () => {
  console.log("Application runnig port ", SERVER_PORT);
});