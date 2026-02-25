const express = require('express');
const router = express.Router();
const directoresController = require('../controllers/directores');

router.get('/', directoresController.list);
router.get('/:id', directoresController.getById);
router.post('/', directoresController.create);
router.put('/:id', directoresController.update);
router.delete('/:id', directoresController.remove);

module.exports = router;
