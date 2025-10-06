import { createPage } from "../pages/utils.js";
import * as services from "../services/puntos_visitables.service.js";
import * as views from "../views/puntos_visitables.view.js";

export function getPuntos(req, res) {
    const { categoria } = req.query;  //de aqui sacamos los botones
    services.getPuntos(req.query)
        .then(puntos => res.send(views.crearListadoPuntos(puntos, categoria)))
        .catch(() => res.send(createPage("Error", "<p>Error al listar puntos</p>")));
    }

export function getPuntosById(req, res) {
    const id = req.params.id;
        services.getPuntosById(id)
            .then(punto => punto ? res.send(views.crearDetallePunto(punto)) : res.send(createPage("Error", "<p>Punto no encontrado</p>")))
            .catch(() => res.send(createPage("Error", "<p>Error interno</p>")));
        }

export function formularioNuevoPunto(req, res) {
    res.send(views.formularioNuevoPunto());
}

export function guardarPunto(req, res) {
    const punto = {
        categoria:  req.body.categoria,
        nombre:     req.body.nombre,
        foto:       req.body.foto,
        direccion:  req.body.direccion,
        descripcion:req.body.descripcion,
        link:       req.body.link
        };
        services.guardarPunto(punto)
            .then(r => res.redirect(`/puntos/${String(r.insertedId)}`)) 
            .catch(() => res.send(createPage("Error", "<p>No se pudo guardar el punto</p>`")));

        }

export function formularioModificarPunto(req, res) {
    const id = req.params.id;
        services.getPuntosById(id)
            .then(punto => punto ? res.send(views.formularioModificarPunto(punto)) : res.send(createPage("Error", "<p>Punto no encontrado</p>")))
            .catch(() => res.send(createPage("Error", "<p>Error interno</p>")));
        }

export function editarPunto(req, res) {
    const id = req.params.id;
    const patch = {
        categoria:  req.body.categoria,
        nombre:     req.body.nombre,
        foto:       req.body.foto,
        direccion:  req.body.direccion,
        descripcion:req.body.descripcion,
        link:       req.body.link
        };
        services.editarPunto(id, patch)
            .then(() => services.getPuntosById(id))
            .then(punto => res.send(views.crearDetallePunto(punto)))
            .catch(() => res.send(createPage("Error", "<p>No se editó el punto</p>")));
    }

export function formularioEliminar(req, res) {
    const id = req.params.id;
        services.getPuntosById(id)
            .then(punto => punto ? res.send(views.formularioEliminar(punto)) : res.send(createPage("Error", "<p>Punto no encontrado</p>")))
            .catch(() => res.send(createPage("Error", "<p>Error interno</p>")));
    }

export function eliminarPunto(req, res) {
    const id = req.params.id;
        services.eliminarPunto(id)
        .then(r => r.deletedCount ? res.send(views.eliminacionExito(id)) : res.send(createPage("Error", "<p>Punto no encontrado</p>")))
        .catch(() => res.send(createPage("Error", "<p>No se eliminó el punto</p>")));
    }
