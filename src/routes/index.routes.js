import { Router } from "express";
import { connection } from "../index.js";
import bcrypt from "bcryptjs";
const router = Router();
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/crearCuenta", (req, res) => {
  res.render("crear");
});

router.post("/iniciar", async (req, res) => {
  const { nombre, contraseña } = req.body;

  try {
    const [rows, fields] = await connection
      .promise()
      .query("SELECT id, contraseña_hash FROM usuarios WHERE nombre=?", [
        nombre,
      ]);

    if (rows.length > 0) {
      const { id, contraseña_hash } = rows[0];

      // Compara la contraseña proporcionada con el hash almacenado
      bcrypt.compare(contraseña, contraseña_hash, (err, result) => {
        if (err) {
          console.error("Error al comparar contraseñas:", err);
          res.status(500).send("Error interno del servidor");
          return;
        }

        if (result) {
          // Contraseña válida, usuario autenticado
          res.render("main", { id: id });
        } else {
          console.log("Contraseña incorrecta D:");
          res.send("NO ACCESO");
        }
      });
    } else {
      console.log("Usuario no encontrado D:");
      res.send("NO ACCESO");
    }
  } catch (error) {
    console.error("Error al autenticar:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.post("/crear", async (req, res) => {
  const { correo, usuario, contraseña } = req.body;

  bcrypt.hash(contraseña, 10, async (err, hash) => {
    if (err) {
      console.error("Error al generar el hash de la contraseña:", err);
    } else {
      try {
        const [rows, fields] = await connection
          .promise()
          .query(
            "INSERT INTO usuarios (nombre,correo,contraseña_hash) VALUES (?,?,?)",
            [usuario, correo, hash]
          );

        if (rows) {
          res.redirect("/");
          // console.log("Inserccion exitosa");
        } else {
          console.log("Error al insertar");
        }
      } catch (error) {
        console.error("Error al autenticar:", error);
        res.status(500).send("Error interno del servidor");
      }
    }
  });
});

export default router;
