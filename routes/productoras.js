const express = require('express');
const router = express.Router();
const productorasController = require('../controllers/productoras');

router.get('/', productorasController.list);
router.get('/:id', productorasController.getById);
router.post('/', productorasController.create);
router.put('/:id', productorasController.update);
router.delete('/:id', productorasController.remove);

module.exports = router;
