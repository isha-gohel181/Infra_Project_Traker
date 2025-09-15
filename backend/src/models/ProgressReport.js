const mongoose = require('mongoose');

const progressReportSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  phaseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Engineer',
    required: true
  },
  reportDate: {
    type: Date,
    default: Date.now
  },
  progressPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  description: {
    type: String,
    required: true
  },
  issues: [{
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open'
    }
  }],
  nextSteps: {
    type: String
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('ProgressReport', progressReportSchema);