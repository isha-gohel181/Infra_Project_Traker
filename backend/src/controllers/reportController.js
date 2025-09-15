const ProgressReport = require('../models/ProgressReport');
const Project = require('../models/Project');

// Get all reports for a project
const getReportsByProject = async (req, res) => {
  try {
    const reports = await ProgressReport.find({ projectId: req.params.projectId })
      .populate('reportedBy', 'name email role')
      .sort({ reportDate: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single report
const getReport = async (req, res) => {
  try {
    const report = await ProgressReport.findById(req.params.id)
      .populate('projectId', 'name')
      .populate('reportedBy', 'name email role');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new report
const createReport = async (req, res) => {
  try {
    const report = new ProgressReport(req.body);
    const savedReport = await report.save();
    
    // Update project phase progress
    const project = await Project.findById(req.body.projectId);
    if (project) {
      const phase = project.phases.id(req.body.phaseId);
      if (phase) {
        phase.progress = req.body.progressPercentage;
        
        // Update phase status based on progress
        if (req.body.progressPercentage === 0) {
          phase.status = 'pending';
        } else if (req.body.progressPercentage === 100) {
          phase.status = 'completed';
        } else {
          phase.status = 'in-progress';
        }
        
        // Calculate overall project progress
        const totalPhases = project.phases.length;
        const totalProgress = project.phases.reduce((sum, p) => sum + p.progress, 0);
        project.overallProgress = Math.round(totalProgress / totalPhases);
        
        await project.save();
      }
    }
    
    const populatedReport = await ProgressReport.findById(savedReport._id)
      .populate('reportedBy', 'name email role');
    
    res.status(201).json(populatedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update report
const updateReport = async (req, res) => {
  try {
    const report = await ProgressReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('reportedBy', 'name email role');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getReportsByProject,
  getReport,
  createReport,
  updateReport
};