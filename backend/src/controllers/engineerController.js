const Engineer = require('../models/Engineer');

// Get all engineers
const getEngineers = async (req, res) => {
  try {
    const engineers = await Engineer.find().sort({ name: 1 });
    res.json(engineers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single engineer
const getEngineer = async (req, res) => {
  try {
    const engineer = await Engineer.findById(req.params.id);
    
    if (!engineer) {
      return res.status(404).json({ message: 'Engineer not found' });
    }
    
    res.json(engineer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new engineer
const createEngineer = async (req, res) => {
  try {
    const engineer = new Engineer(req.body);
    const savedEngineer = await engineer.save();
    res.status(201).json(savedEngineer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update engineer
const updateEngineer = async (req, res) => {
  try {
    const engineer = await Engineer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!engineer) {
      return res.status(404).json({ message: 'Engineer not found' });
    }
    
    res.json(engineer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete engineer
const deleteEngineer = async (req, res) => {
  try {
    const engineer = await Engineer.findByIdAndDelete(req.params.id);
    
    if (!engineer) {
      return res.status(404).json({ message: 'Engineer not found' });
    }
    
    res.json({ message: 'Engineer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEngineers,
  getEngineer,
  createEngineer,
  updateEngineer,
  deleteEngineer
};