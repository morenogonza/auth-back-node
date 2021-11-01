const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, login, validarToken } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJwt } = require("../middlewares/validar-jwt");

const router = Router();

// crear nuevo usuario
router.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").isLength({ min: 6 }),
    validarCampos,
  ],
  crearUsuario
);

// login usuario
router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").isLength({ min: 6 }),
    validarCampos,
  ],
  login
);

// validar toekn
router.get("/renew", validarJwt, validarToken);

module.exports = router;
