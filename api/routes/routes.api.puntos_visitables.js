import { Router } from "express";
import * as controllers from "../controllers/controller.api.puntos_visitables.js";


const route = Router();

route.get("/", controllers.getPuntos)
route.get("/:id", controllers.getPuntosById)
route.post("/", controllers.nuevoPunto)
route.delete("/:id", controllers.eliminarPunto)
route.patch("/:id", controllers.editarPunto)
route.put("/:id", controllers.reemplazarPunto)

export default route