require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const app = express();

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  options: {
    cors: '*'
  }
});

const SERVER_PORT = Number(process.env.SERVER_PORT || 5000);

let host = `localhost:${SERVER_PORT}`;
let _schemas = "http";

mongoose
  .connect(process.env.URL_MONGO, {
    useNewUrlParser: true,
    /* useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true, */
  })
  .then(
    () => {
      console.log("Success connect to: ", host);
    },
    (err) => {
      console.log("Error connect to: " + err);
    }
  );

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.set("view engine", "ejs");

app.use(express.json());

app.get("/", async (req, res) => {
  res.redirect("/api-docs");
});

/* app.get('/resete_senha', async (req, res) => {
    res.render("../app/views/resete_senha");
}); */

require("./routes/index")(app);

server.listen(SERVER_PORT, () => {
  console.log("Application runnig port ", SERVER_PORT);
});

io.on('connection', (client) => {
  console.log(client.id)
  
  client.on('join', (data) => {
    console.log('User logado: ', data.id);

    client.join(data.room);
    client.broadcast.to(data.room).emit('user joined');

    /* const roomName = data.roomName;
    socket.join(roomName);
    socket.to(roomName).broadcast.emit('new-user', data)

    socket.on('disconnect', () => {
      socket.to(roomName).broadcast.emit('bye-user', data)
    }) */
  })

  client.on('message', (data) => {
    io.in(data.room).emit('new message', { user: data.user, message: data.message })
  })
})