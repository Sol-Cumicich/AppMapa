import * as service from "../../services/puntos_visitables.service.js";

export async function getPuntos(req, res) {
    try {
    const puntos = await service.getPuntos(req.query);
    return res.status(200).json(puntos);
    } catch (e) {
    console.error("[getPuntos]", e);
    }
}

export function getPuntosById(req, res){
    const id = req.params.id
    service.getPuntosById(id)
        .then( punto => res.status(200).json(punto) )
        .catch( (err) => res.status(500).json( {message: "No se encontró punto"} ) )
}

export function nuevoPunto(req, res){
    const punto = {
        "categoria": req.body.categoria,
        "nombre": req.body.nombre,
        "foto": req.body.foto,
        "direccion": req.body.direccion,
        "descripcion": req.body.descripcion,
        "link": req.body.link
    }
    service.guardarPunto( punto )
        .then( (puntoNuevo) => res.status(201).json(puntoNuevo) )
        .catch( (err) => res.status(500).json( {message: "No se guardo el punto"} ) )
}

export function eliminarPunto(req, res){
    const id = req.params.id
    service.eliminarPunto(id)
        .then( (id) => res.status(202).json({ message: `El punto fue eliminado correctamente id: ${id}` }) )
        .catch( (err) => res.status(500).json( {message: "No se elimino el punto"} ) )
}

export function editarPunto(req, res){
    const id = req.params.id
    service.editarPunto(id, req.body)
        .then( (puntoEditado) => res.status(202).json(puntoEditado) )
        .catch( (err) => res.status(500).json( {message: "No se editó el punto"} ) )
}

export function reemplazarPunto(req, res){
    const id = req.params.id
    const punto = {
        "categoria": req.body.categoria,
        "nombre": req.body.nombre,
        "foto": req.body.foto,
        "direccion": req.body.direccion,
        "descripcion": req.body.descripcion,
        "link": req.body.link
    }
    service.reemplazarPunto(id, punto)
        .then( (puntoEditado) => res.status(202).json(puntoEditado) )
        .catch( (err) => res.status(500).json( {message: "No se guardo el punto"} ) )
}