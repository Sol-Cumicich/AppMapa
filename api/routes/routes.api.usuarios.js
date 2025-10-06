import { Router } from "express";
import * as controllers from "../controllers/controller.api.usuarios.js";


const route = Router();

route.get("/", controllers.getUsuarios)
route.get("/:id", controllers.getUsuariosById)
route.post("/", controllers.nuevoUsuario)
route.delete("/:id", controllers.eliminarUsuario)
route.patch("/:id", controllers.editarUsuario)
route.put("/:id", controllers.reemplazarUsuario)
route.post("/:idUsuario/punto", controllers.nuevoPunto)
route.get("/:idUsuario/punto", controllers.getPuntoUsuario)
route.post("/:idUsuario/favorito", controllers.nuevoLugarFavorito);

export default route