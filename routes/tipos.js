const express = require('express');
const router = express.Router();
const tiposController = require('../controllers/tipos');

router.get('/', tiposController.list);
router.get('/:id', tiposController.getById);
router.post('/', tiposController.create);
router.put('/:id', tiposController.update);
router.delete('/:id', tiposController.remove);

module.exports = router;
