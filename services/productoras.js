const { run, get, all } = require('../db/connection');

async function findAll() {
  return all(
    'SELECT id, nombre, estado, slogan, descripcion, created_at, updated_at FROM productora ORDER BY nombre'
  );
}

async function findById(id) {
  return get(
    'SELECT id, nombre, estado, slogan, descripcion, created_at, updated_at FROM productora WHERE id = ?',
    [id]
  );
}

async function create(data) {
  const { nombre, estado = 'Activo', slogan, descripcion } = data;
  if (!nombre || !estado) {
    const err = new Error('nombre y estado son requeridos');
    err.code = 'VALIDATION';
    throw err;
  }
  if (estado !== 'Activo' && estado !== 'Inactivo') {
    const err = new Error('estado debe ser Activo o Inactivo');
    err.code = 'VALIDATION';
    throw err;
  }
  const result = await run(
    'INSERT INTO productora (nombre, estado, slogan, descripcion, updated_at) VALUES (?, ?, ?, ?, datetime(\'now\'))',
    [nombre, estado, slogan || null, descripcion || null]
  );
  return findById(result.id);
}

async function update(id, data) {
  const row = await findById(id);
  if (!row) return null;
  const nombre = data.nombre !== undefined ? data.nombre : row.nombre;
  const estado = data.estado !== undefined ? data.estado : row.estado;
  const slogan = data.slogan !== undefined ? data.slogan : row.slogan;
  const descripcion = data.descripcion !== undefined ? data.descripcion : row.descripcion;
  if (estado !== 'Activo' && estado !== 'Inactivo') {
    const err = new Error('estado debe ser Activo o Inactivo');
    err.code = 'VALIDATION';
    throw err;
  }
  await run(
    'UPDATE productora SET nombre = ?, estado = ?, slogan = ?, descripcion = ?, updated_at = datetime(\'now\') WHERE id = ?',
    [nombre, estado, slogan, descripcion, id]
  );
  return findById(id);
}

async function remove(id) {
  const row = await findById(id);
  if (!row) return false;
  await run('DELETE FROM productora WHERE id = ?', [id]);
  return true;
}

module.exports = { findAll, findById, create, update, remove };
