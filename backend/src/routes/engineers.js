const express = require('express');
const router = express.Router();
const {
  getEngineers,
  getEngineer,
  createEngineer,
  updateEngineer,
  deleteEngineer
} = require('../controllers/engineerController');

router.get('/', getEngineers);
router.get('/:id', getEngineer);
router.post('/', createEngineer);
router.put('/:id', updateEngineer);
router.delete('/:id', deleteEngineer);

module.exports = router;