import { MongoClient, ObjectId } from "mongodb";
import * as servicePuntos from "./puntos_visitables.service.js";

const client = new MongoClient(
  "mongodb+srv://alexysol_db:nosvamosagraduar2026@alexysol.kofkqam.mongodb.net/"
);
const db = client.db("AH20232CP1")
const collection = db.collection("usuarios");

//Esto es para que las busquedas por nombre sean mas flexibles
function _escapeRegex(s = "") {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function _expandDiacritics(s = "") {
  const map = {
    a:"[aáàäâãå]", A:"[AÁÀÄÂÃÅ]",
    e:"[eéèëê]",   E:"[EÉÈËÊ]",
    i:"[iíìïî]",   I:"[IÍÌÏÎ]",
    o:"[oóòöôõ]",  O:"[OÓÒÖÔÕ]",
    u:"[uúùüû]",   U:"[UÚÙÜÛ]",
    n:"[nñ]",      N:"[NÑ]",
    c:"[cç]",      C:"[CÇ]",
  };
  const esc = _escapeRegex(s);
  return esc.replace(/[aeiouncAEIOUNC]/g, ch => map[ch] || ch);
}
function buildFuzzyRegexes(text = "") {
  const t = text.trim();
  if (!t) return [];

  const base = _expandDiacritics(t);

  const regs = [];
  //contiene exacto
  regs.push(new RegExp(base, "i"));

  //tolera un caracter mal tipeado
  for (let i = 0; i < t.length; i++) {
    const before = _expandDiacritics(t.slice(0, i));
    const after  = _expandDiacritics(t.slice(i + 1));
    regs.push(new RegExp(before + "." + after, "i"));
  }

  //tolera si esta incompleta la consulta
  for (let i = 0; i < t.length; i++) {
    const omit = _expandDiacritics(t.slice(0, i) + t.slice(i + 1));
    regs.push(new RegExp(omit, "i"));
  }

  // match desde el inicio
  regs.push(new RegExp("^" + base, "i"));

  return regs;
}

export async function getUsuarios(filter = {}) {
  const filterMongo = {};

    // filtro favs
  if (filter.filtro === "Con favoritos") {
    filterMongo["lugares_favoritos.0"] = { $exists: true };
  } else if (filter.filtro === "Sin favoritos") {
    filterMongo.$or = [
      { lugares_favoritos: { $exists: false } },
      { "lugares_favoritos.0": { $exists: false } }
    ];
  }

  if (filter.nombreContiene !== undefined && String(filter.nombreContiene).trim() !== "") {
    const regs = buildFuzzyRegexes(String(filter.nombreContiene));
    filterMongo.$or = [
      ...(filterMongo.$or || []),
      ...regs.map(rx => ({ nombre: rx }))
    ];
  }
  await client.connect();
  return collection.find(filterMongo).toArray();
}

//Traer el usuario segun ID
export async function getUsuariosById(id) {
  await client.connect();
  return collection.findOne({ _id: new ObjectId(id) });
}

// Crear usuario
export async function guardarUsuario(usuario) {
  await client.connect();
  return collection.insertOne(usuario);
}

// Reemplazar usuario
export async function reemplazarUsuario(id, usuario) {
  await client.connect();
  return collection.replaceOne({ _id: new ObjectId(id) }, usuario);
}

// Eliminar usuario
export async function eliminarUsuario(id) {
  await client.connect();
  return collection.deleteOne({ _id: new ObjectId(id) });
}

// Editar usuario
export function editarUsuario(id, usuario) {
    return db.collection("usuarios").updateOne({ _id: new ObjectId(id) }, { $set: usuario })
}

// Crear punto favorito
export async function guardarDuenio(idUsuario, punto, crearNuevo = true) {
  let puntoFinal;

  if (crearNuevo) {
      // Crear nuevo punto en la colección de puntos
      const resultado = await servicePuntos.guardarPunto(punto);
      puntoFinal = { ...punto, _id: resultado.insertedId };
  } else {
      // Es un punto existente, no crear en puntos_visitables
      puntoFinal = punto;
  }

  // Asegurarse de que lugares_favoritos sea un array
  await db.collection("usuarios").updateOne(
      { _id: new ObjectId(idUsuario) },
      { $setOnInsert: { lugares_favoritos: [] } },
      { upsert: true }
  );

  // Agregar el objeto completo al array
  await db.collection("usuarios").updateOne(
      { _id: new ObjectId(idUsuario) },
      { $addToSet: { lugares_favoritos: puntoFinal } }
  );

  return puntoFinal;
}

export async function getPuntoUsuario(id){
  try {
    const usuario = await getUsuariosById(id);
    return usuario ? usuario.lugares_favoritos || [] : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Agregar favorito existente
export async function agregarLugarFavorito(idUsuario, punto) {
  await db.collection("usuarios").updateOne(
    { _id: new ObjectId(idUsuario) },
    { $setOnInsert: { lugares_favoritos: [] } },
    { upsert: true }
  );

  return db.collection("usuarios").updateOne(
    { _id: new ObjectId(idUsuario) },
    { $addToSet: { lugares_favoritos: { ...punto } } }
  );
}