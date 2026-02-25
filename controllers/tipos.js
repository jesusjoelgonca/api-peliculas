const tiposService = require('../services/tipos');

async function list(req, res) {
  try {
    const rows = await tiposService.findAll();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const row = await tiposService.findById(id);
    if (!row) return res.status(404).json({ error: 'Tipo no encontrado' });
    res.status(200).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const created = await tiposService.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 'VALIDATION') return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await tiposService.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Tipo no encontrado' });
    res.status(200).json(updated);
  } catch (err) {
    if (err.code === 'VALIDATION') return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await tiposService.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Tipo no encontrado' });
    res.status(200).json({ message: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { list, getById, create, update, remove };
