require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const app = express();

const SERVER_PORT = Number(process.env.SERVER_PORT || 5000);

let host = `localhost:${SERVER_PORT}`;
let _schemas = "http";

app.get("/", function (req, res) {
  res.redirect("/api-docs/");
});

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

app.listen(process.env.PORT || 5000);
