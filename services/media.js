const { run, get, all } = require('../db/connection');
const generosService = require('./generos');
const directoresService = require('./directores');
const productorasService = require('./productoras');
const tiposService = require('./tipos');

async function findAll() {
  const rows = await all(`
    SELECT m.id, m.serial, m.titulo, m.sinopsis, m.url, m.imagen_portada, m.anio_estreno,
           m.created_at, m.updated_at, m.genero_id, m.director_id, m.productora_id, m.tipo_id
    FROM media m
    ORDER BY m.titulo
  `);
  return rows;
}

async function findById(id) {
  return get(
    `SELECT id, serial, titulo, sinopsis, url, imagen_portada, anio_estreno,
            created_at, updated_at, genero_id, director_id, productora_id, tipo_id
     FROM media WHERE id = ?`,
    [id]
  );
}

async function validateReferences(data, excludeId = null) {
  const { genero_id, director_id, productora_id, tipo_id } = data;
  if (genero_id == null || director_id == null || productora_id == null || tipo_id == null) {
    const err = new Error('genero_id, director_id, productora_id y tipo_id son requeridos');
    err.code = 'VALIDATION';
    throw err;
  }
  const [genero, director, productora, tipo] = await Promise.all([
    generosService.findById(genero_id),
    directoresService.findById(director_id),
    productorasService.findById(productora_id),
    tiposService.findById(tipo_id)
  ]);
  if (!genero) {
    const err = new Error('género no encontrado');
    err.code = 'VALIDATION';
    throw err;
  }
  if (genero.estado !== 'Activo') {
    const err = new Error('el género debe estar activo');
    err.code = 'VALIDATION';
    throw err;
  }
  if (!director) {
    const err = new Error('director no encontrado');
    err.code = 'VALIDATION';
    throw err;
  }
  if (director.estado !== 'Activo') {
    const err = new Error('el director debe estar activo');
    err.code = 'VALIDATION';
    throw err;
  }
  if (!productora) {
    const err = new Error('productora no encontrada');
    err.code = 'VALIDATION';
    throw err;
  }
  if (productora.estado !== 'Activo') {
    const err = new Error('la productora debe estar activa');
    err.code = 'VALIDATION';
    throw err;
  }
  if (!tipo) {
    const err = new Error('tipo no encontrado');
    err.code = 'VALIDATION';
    throw err;
  }
  if (data.serial != null) {
    const existing = await get('SELECT id FROM media WHERE serial = ? AND (? IS NULL OR id != ?)', [
      data.serial,
      excludeId,
      excludeId
    ]);
    if (existing) {
      const err = new Error('el serial ya existe');
      err.code = 'VALIDATION';
      throw err;
    }
  }
  if (data.url != null) {
    const existing = await get('SELECT id FROM media WHERE url = ? AND (? IS NULL OR id != ?)', [
      data.url,
      excludeId,
      excludeId
    ]);
    if (existing) {
      const err = new Error('la URL ya existe');
      err.code = 'VALIDATION';
      throw err;
    }
  }
}

async function create(data) {
  const { serial, titulo, sinopsis, url, imagen_portada, anio_estreno, genero_id, director_id, productora_id, tipo_id } = data;
  if (!serial || !titulo || !url) {
    const err = new Error('serial, titulo y url son requeridos');
    err.code = 'VALIDATION';
    throw err;
  }
  await validateReferences(data, null);
  const result = await run(
    `INSERT INTO media (serial, titulo, sinopsis, url, imagen_portada, anio_estreno, genero_id, director_id, productora_id, tipo_id, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [
      serial,
      titulo,
      sinopsis || null,
      url,
      imagen_portada || null,
      anio_estreno != null ? anio_estreno : null,
      genero_id,
      director_id,
      productora_id,
      tipo_id
    ]
  );
  return findById(result.id);
}

async function update(id, data) {
  const row = await findById(id);
  if (!row) return null;
  const payload = {
    serial: data.serial !== undefined ? data.serial : row.serial,
    titulo: data.titulo !== undefined ? data.titulo : row.titulo,
    sinopsis: data.sinopsis !== undefined ? data.sinopsis : row.sinopsis,
    url: data.url !== undefined ? data.url : row.url,
    imagen_portada: data.imagen_portada !== undefined ? data.imagen_portada : row.imagen_portada,
    anio_estreno: data.anio_estreno !== undefined ? data.anio_estreno : row.anio_estreno,
    genero_id: data.genero_id !== undefined ? data.genero_id : row.genero_id,
    director_id: data.director_id !== undefined ? data.director_id : row.director_id,
    productora_id: data.productora_id !== undefined ? data.productora_id : row.productora_id,
    tipo_id: data.tipo_id !== undefined ? data.tipo_id : row.tipo_id
  };
  await validateReferences(payload, id);
  await run(
    `UPDATE media SET serial = ?, titulo = ?, sinopsis = ?, url = ?, imagen_portada = ?, anio_estreno = ?,
     genero_id = ?, director_id = ?, productora_id = ?, tipo_id = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [
      payload.serial,
      payload.titulo,
      payload.sinopsis,
      payload.url,
      payload.imagen_portada,
      payload.anio_estreno,
      payload.genero_id,
      payload.director_id,
      payload.productora_id,
      payload.tipo_id,
      id
    ]
  );
  return findById(id);
}

async function remove(id) {
  const row = await findById(id);
  if (!row) return false;
  await run('DELETE FROM media WHERE id = ?', [id]);
  return true;
}

module.exports = { findAll, findById, create, update, remove };
