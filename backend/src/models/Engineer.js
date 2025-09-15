const mongoose = require('mongoose');

const engineerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Project Manager', 'Civil Engineer', 'Structural Engineer', 'Electrical Engineer', 'Mechanical Engineer', 'Site Supervisor']
  },
  specialization: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Engineer', engineerSchema);