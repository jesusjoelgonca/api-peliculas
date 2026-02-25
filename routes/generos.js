const express = require('express');
const router = express.Router();
const generosController = require('../controllers/generos');

router.get('/', generosController.list);
router.get('/:id', generosController.getById);
router.post('/', generosController.create);
router.put('/:id', generosController.update);
router.delete('/:id', generosController.remove);

module.exports = router;
