const { run, get, all } = require('../db/connection');

async function findAll() {
  return all(
    'SELECT id, nombre, estado, descripcion, created_at, updated_at FROM genero ORDER BY nombre'
  );
}

async function findById(id) {
  return get(
    'SELECT id, nombre, estado, descripcion, created_at, updated_at FROM genero WHERE id = ?',
    [id]
  );
}

async function create(data) {
  const { nombre, estado = 'Activo', descripcion } = data;
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
    'INSERT INTO genero (nombre, estado, descripcion, updated_at) VALUES (?, ?, ?, datetime(\'now\'))',
    [nombre, estado, descripcion || null]
  );
  return findById(result.id);
}

async function update(id, data) {
  const row = await findById(id);
  if (!row) return null;
  const nombre = data.nombre !== undefined ? data.nombre : row.nombre;
  const estado = data.estado !== undefined ? data.estado : row.estado;
  const descripcion = data.descripcion !== undefined ? data.descripcion : row.descripcion;
  if (estado !== 'Activo' && estado !== 'Inactivo') {
    const err = new Error('estado debe ser Activo o Inactivo');
    err.code = 'VALIDATION';
    throw err;
  }
  await run(
    'UPDATE genero SET nombre = ?, estado = ?, descripcion = ?, updated_at = datetime(\'now\') WHERE id = ?',
    [nombre, estado, descripcion, id]
  );
  return findById(id);
}

async function remove(id) {
  const row = await findById(id);
  if (!row) return false;
  await run('DELETE FROM genero WHERE id = ?', [id]);
  return true;
}

module.exports = { findAll, findById, create, update, remove };
