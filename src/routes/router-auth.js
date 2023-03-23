/*
 * Author : Daan Oliveira
 */

const express = require("express");
const Cliente = require("../schemas/cliente");
const Consultor = require("../schemas/consultor");
const ResetCode = require("../schemas/resetcode");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");
const crypto = require("crypto");
const multerConfig = require("../config/multer");
const multer = require("multer");
const Token = require("../schemas/token");
const nodemailer = require('nodemailer');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.post("/register", multer(multerConfig).single("file"), async (req, res) => {

  try {

    const img = {
      nome_file: "profile.png",
      size: 24378,
      key: "6ff837f9e14f57d1a55d930137b14f25-profile.png",
      url: "https://tarothekate.s3.amazonaws.com/6ff837f9e14f57d1a55d930137b14f25-profile.png",
    }

    const {
      originalname: nome_file,
      size,
      key,
      location: url = "",
    } = req.file == null ? img : req.file;

    const {
      name,
      email,
      cpf,
      password,
      avaliation,
      typelogin,
      status,
      description,
    } = JSON.parse(req.body.form);

    if (typelogin == "cliente") {

      if (
        (await Cliente.findOne({
          email,
        }))
      ) {
        return res.status(400).json({
          error: "Este e-mail ja foi utilizado.",
        });
      }

      const cliente = await Cliente.create({
        name,
        email,
        cpf,
        password,
        typelogin,
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

      if (
        (await Consultor.findOne({
          email,
        }))
      ) {
        return res.status(400).json({
          error: "Este e-mail ja foi utilizado.",
        });
      }

      const consultor = await Consultor.create({
        name,
        email,
        password,
        avaliation,
        status,
        description,
        typelogin,
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
});

router.post("/authenticate", async (req, res) => {
  try {
    const { email, password, categoria } = req.body;

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

router.post('/geraToken', async (req, res) => {

  try {

    const { cpf } = req.body

    if (!cpf) {
      res.status(400).json({
        err: "Você deve informar o cpf do tarologo! "
      })

      return
    }

    var token = generateToken({
      id: cpf,
    })

    var tokenGerad = await Token.create({ token: token })

    res.status(200).json({
      token: tokenGerad,
      message: "Token cadastrado",
    });

  } catch (err) {
    res.status(400).json({
      err: "Não foi possível gerar o token! " + err
    })
    console.log(err);
  }
})

router.post('/validaToken', async (req, res) => {

  try {

    const { token } = req.body

    if (!token) {
      res.status(400).json({
        err: "Informe o token que recebeu por e-mail! "
      })

      return
    }

    var validaToken = await Token.findOne({ token: token })

    if (validaToken) {

      jwt.verify(token, authConfig.secret, async (err, decoded) => {
        if (err) {
          await Token.deleteOne({ token: token })
          return res.status(401).json({
            err: "Este token expirou... por favor entre em contato com nossa equipe para gerar um novo.",
          });
        }

        await Token.deleteOne({ token: token })

        res.status(200).json({
          message: "Token validado",
          token: true
        });
      })

    } else {
      res.status(401).json({
        message: "Token inválido",
        token: false
      });
    }

  } catch (err) {
    res.status(400).json({
      err: "Não foi possível validar o token! " + err
    })
  }
})

router.post("/send-email-code", async (req, res) => {

  try {

    const { email } = req.body;
    const code = Math.floor(Math.random() * 9000) + 1000;

    const resp = await ResetCode.create({ code: code })

    if (resp) {

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'danilo25oliveira@gmail.com',
          pass: 'aqkfjknipniduagb'
        }
      }); // Configura o transporte de e-mail

      const mailOptions = {
        from: 'danilo25oliveira@gmail.com',
        to: email,
        subject: 'Código de redefinição de senha',
        text: `Seu código de redefinição de senha é: ${code}`
      }; // Configura as opções do e-mail

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(400).json('Não foi possível enviar o e-mail: ' + error);
        } else {
          res.status(200).json('E-mail enviado: ' + info.response);
        }
      }); // Envia o e-mail
    }

  } catch (err) {
    console.log(err);
  }
});

router.post("/valida-code", async (req, res) => {

  try {
    const { code } = req.body;
    const resp = await ResetCode.findOne({ code: code })

    if (resp) {
      await ResetCode.deleteOne({ code: code })
      res.status(200).json("Código validado")
    }

  } catch (err) {
    console.log(err);
  }
});

router.post("/reset-pass", async (req, res) => {

  try {
    var { email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    password = hash;

    const user = await Consultor.findOne({ email: email })

    if (user) {
      const resp = await Consultor.findOneAndUpdate({ email: email }, { password: password })

      if (resp) {
        res.status(200).json("Senha alterada com sucesso")
      } else {
        res.status(400).json("Não foi possível alterar a senha")
      }
    } else {
      const resp = await Cliente.findOneAndUpdate({ email: email }, { password: password })
      if (resp) {
        res.status(200).json("Senha alterada com sucesso")
      } else {
        res.status(400).json("Não foi possível alterar a senha")
      }
    }

  } catch (err) {
    console.log(err);
  }
});

module.exports = (app) => app.use("/auth", router);
