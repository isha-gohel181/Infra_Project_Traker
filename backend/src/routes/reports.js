const express = require('express');
const router = express.Router();
const {
  getReportsByProject,
  getReport,
  createReport,
  updateReport
} = require('../controllers/reportController');

router.get('/project/:projectId', getReportsByProject);
router.get('/:id', getReport);
router.post('/', createReport);
router.put('/:id', updateReport);

module.exports = router;