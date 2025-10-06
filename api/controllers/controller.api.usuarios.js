import * as serviceUsuarios from "../../services/usuarios.service.js";
import * as servicePuntos from "../../services/puntos_visitables.service.js";

export async function getUsuarios(req, res) {
    try {
    const usuarios = await serviceUsuarios.getUsuarios(req.query);
    return res.status(200).json(usuarios);
    } catch (e) {
    console.error("[getUsuarios]", e);
    }
}

export function getUsuariosById(req, res){
    const id = req.params.id
    service.getUsuariosById(id)
        .then( usuario => res.status(200).json(usuario) )
        .catch( (err) => res.status(500).json( {message: "No se encontró el usuario"} ) )
}

export function nuevoUsuario(req, res){
    const usuario = {
        "nombre":             req.body.nombre,
        "foto":               req.body.foto,
        "descripcion":        req.body.descripcion,
        "lugares_favoritos":  req.body.lugares_favoritos
    }
    service.guardarUsuario( usuario )
        .then( (usuarioNuevo) => res.status(201).json(usuarioNuevo) )
        .catch( (err) => res.status(500).json( {message: "No se guardo el usuario"} ) )
}

export function eliminarUsuario(req, res){
    const id = req.params.id
    service.eliminarUsuario(id)
        .then( (id) => res.status(202).json({ message: `El usuario fue eliminado correctamente id: ${id}` }) )
        .catch( (err) => res.status(500).json( {message: "No se elimino el usuario"} ) )
}

export function editarUsuario(req, res){
    const id = req.params.id
    service.editarUsuario(id, req.body)
        .then( (usuarioEditado) => res.status(202).json(usuarioEditado) )
        .catch( (err) => res.status(500).json( {message: "No se editó el usuario"} ) )
}

export function reemplazarUsuario(req, res){
    const id = req.params.id
    const usuario = {
        "nombre":             req.body.nombre,
        "foto":               req.body.foto,
        "descripcion":        req.body.descripcion,
        "lugares_favoritos":  req.body.lugares_favoritos
    }
    service.reemplazarUsuario(id, usuario)
        .then( (usuarioEditado) => res.status(202).json(usuarioEditado) )
        .catch( (err) => res.status(500).json( {message: "No se guardo el usuario"} ) )
}

export async function nuevoPunto(req, res) {
    const idUsuario = req.params.idUsuario;
    const punto = {
        categoria: req.body.categoria,
        nombre: req.body.nombre,
        foto: req.body.foto,
        direccion: req.body.direccion,
        descripcion: req.body.descripcion,
        link: req.body.link
    };

    try {
        // Crear punto y agregar al usuario
        const nuevoPunto = await serviceUsuarios.guardarDuenio(idUsuario, punto, true);

        res.status(201).json({ message: "Punto creado y agregado al usuario!", nuevoPunto });
    } catch (err) {
        console.error("[nuevoPunto]", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export function getPuntoUsuario(req, res){
    const id = req.params.idUsuario
    service.getPuntoUsuario(id)
        .then( puntos => {
            if( puntos ){
                res.status(200).json(puntos)
            }else{
                res.status(404).json( {message: "Usuario no encontrado"} )
            }
        } )
        .catch( err => res.status(500).json({ message: "Error del servidor" }) )
}

export async function nuevoLugarFavorito(req, res) {
    const idUsuario = req.params.idUsuario;
    const idPunto = req.body.idPunto;

    if (!idPunto) return res.status(400).json({ message: "Falta idPunto en el body" });

    try {
        // Traer punto existente completo
        const punto = await servicePuntos.getPuntosById(idPunto);
        if (!punto) return res.status(404).json({ message: "Punto no encontrado" });

        // Agregar al usuario sin crear en la colección de puntos
        await serviceUsuarios.guardarDuenio(idUsuario, punto, false);

        res.status(201).json({ message: "Punto agregado a lugares favoritos", punto });
    } catch (err) {
        console.error("[nuevoLugarFavorito]", err);
        res.status(500).json({ message: "Error al agregar lugar favorito" });
    }
}