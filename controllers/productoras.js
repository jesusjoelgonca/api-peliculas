const productorasService = require('../services/productoras');

async function list(req, res) {
  try {
    const rows = await productorasService.findAll();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const row = await productorasService.findById(id);
    if (!row) return res.status(404).json({ error: 'Productora no encontrada' });
    res.status(200).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const created = await productorasService.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 'VALIDATION') return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await productorasService.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Productora no encontrada' });
    res.status(200).json(updated);
  } catch (err) {
    if (err.code === 'VALIDATION') return res.status(400).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await productorasService.remove(id);
    if (!deleted) return res.status(404).json({ error: 'Productora no encontrada' });
    res.status(200).json({ message: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { list, getById, create, update, remove };
