import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(
  "mongodb+srv://alexysol_db:nosvamosagraduar2026@alexysol.kofkqam.mongodb.net/"
);
const db = client.db("AH20232CP1")
const collection = db.collection("puntos_visitables");

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

export async function getPuntos(filter = {}) {
  const filterMongo = {};
  const options = {};
    if (filter.categoria && filter.categoria !== "Todos") {
      filterMongo.categoria = String(filter.categoria);
    }
    if (filter.nombreContiene !== undefined && String(filter.nombreContiene).trim() !== "") {
    const regs = buildFuzzyRegexes(String(filter.nombreContiene));
    filterMongo.$or = regs.map(rx => ({ nombre: rx }));
  }
  await client.connect();
  return collection.find(filterMongo).toArray();
}

//Traer el punto segun ID
export async function getPuntosById(id) {
  await client.connect();
  return collection.findOne({ _id: new ObjectId(id) });
}

// Crear punto
export async function guardarPunto(punto) {
  await client.connect();
  return collection.insertOne(punto);
}

// Reemplazar punto
export async function reemplazarPunto(id, punto) {
  await client.connect();
  return collection.replaceOne({ _id: new ObjectId(id) }, punto);
}

// Eliminar punto
export async function eliminarPunto(id) {
  await client.connect();
  return collection.deleteOne({ _id: new ObjectId(id) });
}

// Editar punto
export async function editarPunto(id, punto) {
  await client.connect();
  return collection.updateOne({ _id: new ObjectId(id) }, { $set: punto });
}