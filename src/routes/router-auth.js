/*
 * Incidente
 * Certificado
 * Author : Daan Oliveira
 */

const express = require("express");
const Cliente = require("../schemas/cliente");
const Consultor = require("../schemas/consultor");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");
const crypto = require("crypto");
const multerConfig = require("../config/multer");
const multer = require("multer");

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.post(
  "/register",
  multer(multerConfig).single("file"),
  async (req, res) => {
    try {
      const {
        originalname: nome_file,
        size,
        key,
        location: url = "",
      } = req.file;

      const {
        name,
        email,
        password,
        avaliation,
        value,
        status,
        description,
        categoria /* , cep, bairro, numero, rua, cpf */,
      } = req.body;

      if (
        (await Cliente.findOne({
          email,
        })) ||
        (await Consultor.findOne({
          email,
        }))
      ) {
        return res.status(400).json({
          error: "Este e-mail ja foi utilizado.",
        });
      }

      if (categoria == "cliente") {
        const cliente = await Cliente.create({
          nome,
          email,
          password,
          image: {
            nome_file,
            size,
            key,
            url,
          },
        });

        cliente.password = undefined;

        return res.json({
          cliente,
          token: generateToken({
            id: cliente._id,
          }),
        });
      } else {
        const consultor = await Consultor.create({
          name,
          email,
          password,
          avaliation,
          value,
          status,
          description,
          image: {
            nome_file,
            size,
            key,
            url,
          },
        });

        consultor.password = undefined;

        return res.json({
          consultor,
          token: generateToken({
            id: consultor._id,
          }),
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: "Falha ao registrar usuário.    " + err,
      });
    }
  }
);

router.post("/authenticate", async (req, res) => {
  try {
    const { email, password, categoria } = req.body;

    console.log(req.body);

    if (categoria == "cliente") {
      const cliente = await Cliente.findOne({ email }).select("+password");

      if (!cliente) {
        return res.status(400).json({
          error: "Usuário não encontrado.",
        });
      }

      if (!(await bcrypt.compare(password, cliente.password))) {
        return res.status(400).json({
          error: "Senha inválida.",
        });
      }

      cliente.password = undefined;

      res.status(200).json({
        cliente,
        token: generateToken({
          id: cliente._id,
        }),
        message: "Login efetuado com sucesso!",
        categoria: "cliente",
      });
    } else {
      const consultor = await Consultor.findOne({ email }).select("+password");

      if (!consultor) {
        return res.status(400).json({
          error: "Usuário não encontrado.",
        });
      }

      if (!(await bcrypt.compare(password, consultor.password))) {
        return res.status(400).json({
          error: "Senha inválida.",
        });
      }

      consultor.password = undefined;

      res.status(200).json({
        consultor,
        token: generateToken({
          id: consultor._id,
        }),
        message: "Login efetuado com sucesso!",
        categoria: "consultor",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

/* router.get("/get-user", async (req, res) => {
  try {
    const { _id } = req.params;

    console.log(_id);

    const cliente = await Cliente.findOne({ _id }).select("-password");

    if (cliente) {
      res.status(200).json(cliente);
    } else {
      const consultor = await Consultor.findOne({ _id }).select("-password");
      res.status(200).json(consultor);
    }
  } catch (err) {
    console.log(err);
  }
}); */

module.exports = (app) => app.use("/auth", router);
