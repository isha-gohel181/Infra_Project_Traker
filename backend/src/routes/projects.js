const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  addPhase,
  updatePhase,
  assignEngineerToPhase
} = require('../controllers/projectController');

// Project routes
router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);

// Phase routes
router.post('/:id/phases', addPhase);
router.put('/:projectId/phases/:phaseId', updatePhase);
router.post('/:projectId/phases/:phaseId/assign-engineer', assignEngineerToPhase);

module.exports = router;