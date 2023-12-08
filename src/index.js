import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2";
import { error } from "console";
import indexRoutes from "./routes/index.routes.js"
const app = express();

 export const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "abner",
  database: "login2",
});

connection.connect((err) => {
  if (err) {
    console.log("Erros al conectar la bd", err);
  } else {
    console.log("bd conectada");
  }
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");



app.use(express.static(join(__dirname, "/public")));
app.use(indexRoutes);
app.listen(process.env.PORT || 3000);

console.log("Escuchando en el puerto: ", process.env.PORT || 3000);
