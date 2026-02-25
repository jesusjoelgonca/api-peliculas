const { run, get, all } = require('../db/connection');

async function findAll() {
  return all(
    'SELECT id, nombres, estado, created_at, updated_at FROM director ORDER BY nombres'
  );
}

async function findById(id) {
  return get(
    'SELECT id, nombres, estado, created_at, updated_at FROM director WHERE id = ?',
    [id]
  );
}

async function create(data) {
  const { nombres, estado = 'Activo' } = data;
  if (!nombres || !estado) {
    const err = new Error('nombres y estado son requeridos');
    err.code = 'VALIDATION';
    throw err;
  }
  if (estado !== 'Activo' && estado !== 'Inactivo') {
    const err = new Error('estado debe ser Activo o Inactivo');
    err.code = 'VALIDATION';
    throw err;
  }
  const result = await run(
    'INSERT INTO director (nombres, estado, updated_at) VALUES (?, ?, datetime(\'now\'))',
    [nombres, estado]
  );
  return findById(result.id);
}

async function update(id, data) {
  const row = await findById(id);
  if (!row) return null;
  const nombres = data.nombres !== undefined ? data.nombres : row.nombres;
  const estado = data.estado !== undefined ? data.estado : row.estado;
  if (estado !== 'Activo' && estado !== 'Inactivo') {
    const err = new Error('estado debe ser Activo o Inactivo');
    err.code = 'VALIDATION';
    throw err;
  }
  await run(
    'UPDATE director SET nombres = ?, estado = ?, updated_at = datetime(\'now\') WHERE id = ?',
    [nombres, estado, id]
  );
  return findById(id);
}

async function remove(id) {
  const row = await findById(id);
  if (!row) return false;
  await run('DELETE FROM director WHERE id = ?', [id]);
  return true;
}

module.exports = { findAll, findById, create, update, remove };
