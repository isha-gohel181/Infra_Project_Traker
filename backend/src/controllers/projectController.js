const Project = require('../models/Project');
const Engineer = require('../models/Engineer');

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('phases.assignedEngineers.engineerId', 'name email role')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single project
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('phases.assignedEngineers.engineerId', 'name email role specialization');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('phases.assignedEngineers.engineerId', 'name email role');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add phase to project
const addPhase = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    project.phases.push(req.body);
    await project.save();
    
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update phase
const updatePhase = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const phase = project.phases.id(req.params.phaseId);
    
    if (!phase) {
      return res.status(404).json({ message: 'Phase not found' });
    }
    
    Object.assign(phase, req.body);
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Assign engineer to phase
const assignEngineerToPhase = async (req, res) => {
  try {
    const { engineerId, role } = req.body;
    
    const project = await Project.findById(req.params.projectId);
    const engineer = await Engineer.findById(engineerId);
    
    if (!project || !engineer) {
      return res.status(404).json({ message: 'Project or Engineer not found' });
    }
    
    const phase = project.phases.id(req.params.phaseId);
    
    if (!phase) {
      return res.status(404).json({ message: 'Phase not found' });
    }
    
    // Check if engineer is already assigned
    const existingAssignment = phase.assignedEngineers.find(
      assignment => assignment.engineerId.toString() === engineerId
    );
    
    if (existingAssignment) {
      return res.status(400).json({ message: 'Engineer already assigned to this phase' });
    }
    
    phase.assignedEngineers.push({ engineerId, role });
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  addPhase,
  updatePhase,
  assignEngineerToPhase
};