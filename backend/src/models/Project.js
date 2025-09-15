const mongoose = require('mongoose');

const phaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'delayed'],
    default: 'pending'
  },
  assignedEngineers: [{
    engineerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Engineer'
    },
    role: String
  }],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  client: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  expectedEndDate: {
    type: Date,
    required: true
  },
  currentPhase: {
    type: String,
    default: 'Planning'
  },
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  phases: [phaseSchema],
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'suspended'],
    default: 'planning'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);