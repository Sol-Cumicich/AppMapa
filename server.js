import express from 'express';
import PuntosApiRouter from "./api/routes/routes.api.puntos_visitables.js"
import PuntosRouter from "./routes/puntos_visitables.route.js"
import UsuariosRouter from "./routes/usuarios.route.js"
import UsuariosApiRouter from "./api/routes/routes.api.usuarios.js"

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/",express.static("public"))

app.use("/puntos", PuntosRouter)
app.use("/api/puntos", PuntosApiRouter)
app.use("/usuarios", UsuariosRouter)
app.use("/api/usuarios", UsuariosApiRouter)


app.listen(3333, () => {
    console.log("Funciona, puerto 3333")
})

