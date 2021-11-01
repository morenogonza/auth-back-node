const { response, request } = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJwt } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");

const crearUsuario = async (req, res = response) => {
  const { email, name, password } = req.body;

  try {
    // Verificar que no exista el email
    const usuario = await Usuario.findOne({ email });

    if (usuario)
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe con ese email",
      });

    // crear usuario con el modelo
    const usuarioDb = new Usuario(req.body);

    // Encriptar la contraseña mediante hash
    const salt = bcrypt.genSaltSync();
    usuarioDb.password = bcrypt.hashSync(password, salt);

    // generar el JWT
    const token = await generarJwt(usuarioDb.id, name);

    // crear usuario de DB
    await usuarioDb.save();

    // Generar la respuesta exitosa
    return res.status(201).json({
      ok: true,
      uid: usuarioDb.id,
      name,
      token,
      email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuarioDb = await Usuario.findOne({ email });

    if (!usuarioDb)
      return res.status(400).json({
        ok: false,
        msg: "El email no existe",
      });

    // confirmar si el password hace match

    const validPassword = bcrypt.compareSync(password, usuarioDb.password);

    if (!validPassword)
      return res.status(400).json({
        ok: false,
        msg: "El password no es valido",
      });

    // tenemos usuario y contraseña validos
    // generar el JWT
    const token = await generarJwt(usuarioDb.id, usuarioDb.name);

    // respuesta del servicio

    return res.status(200).json({
      ok: true,
      uid: usuarioDb.id,
      name: usuarioDb.name,
      token,
      email: usuarioDb.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const validarToken = async (req = request, res) => {
  const { uid } = req;

  const usuarioDb = await Usuario.findById(uid);

  const token = await generarJwt(uid, usuarioDb.name);

  return res.json({
    ok: true,
    uid,
    name: usuarioDb.name,
    email: usuarioDb.email,
    token,
  });
};

module.exports = { crearUsuario, login, validarToken };
