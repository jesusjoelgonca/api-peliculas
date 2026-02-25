const { run, get, all } = require('../db/connection');

async function findAll() {
  return all(
    'SELECT id, nombre, descripcion, created_at, updated_at FROM tipo ORDER BY nombre'
  );
}

async function findById(id) {
  return get(
    'SELECT id, nombre, descripcion, created_at, updated_at FROM tipo WHERE id = ?',
    [id]
  );
}

async function create(data) {
  const { nombre, descripcion } = data;
  if (!nombre) {
    const err = new Error('nombre es requerido');
    err.code = 'VALIDATION';
    throw err;
  }
  const result = await run(
    'INSERT INTO tipo (nombre, descripcion, updated_at) VALUES (?, ?, datetime(\'now\'))',
    [nombre, descripcion || null]
  );
  return findById(result.id);
}

async function update(id, data) {
  const row = await findById(id);
  if (!row) return null;
  const nombre = data.nombre !== undefined ? data.nombre : row.nombre;
  const descripcion = data.descripcion !== undefined ? data.descripcion : row.descripcion;
  await run(
    'UPDATE tipo SET nombre = ?, descripcion = ?, updated_at = datetime(\'now\') WHERE id = ?',
    [nombre, descripcion, id]
  );
  return findById(id);
}

async function remove(id) {
  const row = await findById(id);
  if (!row) return false;
  await run('DELETE FROM tipo WHERE id = ?', [id]);
  return true;
}

module.exports = { findAll, findById, create, update, remove };
