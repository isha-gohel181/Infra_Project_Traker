import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

const ReportForm = ({ report, projects, engineers, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    projectId: report?.projectId || '',
    phaseId: report?.phaseId || '',
    reportedBy: report?.reportedBy?._id || '',
    progressPercentage: report?.progressPercentage || 0,
    description: report?.description || '',
    nextSteps: report?.nextSteps || '',
    issues: report?.issues || []
  });

  const [errors, setErrors] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [newIssue, setNewIssue] = useState({
    description: '',
    severity: 'low',
    status: 'open'
  });

  useEffect(() => {
    if (formData.projectId) {
      const project = projects.find(p => p._id === formData.projectId);
      setSelectedProject(project);
    }
  }, [formData.projectId, projects]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddIssue = () => {
    if (newIssue.description.trim()) {
      setFormData(prev => ({
        ...prev,
        issues: [...prev.issues, { ...newIssue }]
      }));
      setNewIssue({
        description: '',
        severity: 'low',
        status: 'open'
      });
    }
  };

  const handleRemoveIssue = (index) => {
    setFormData(prev => ({
      ...prev,
      issues: prev.issues.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectId) newErrors.projectId = 'Project is required';
    if (!formData.phaseId) newErrors.phaseId = 'Phase is required';
    if (!formData.reportedBy) newErrors.reportedBy = 'Reporter is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.progressPercentage < 0 || formData.progressPercentage > 100) {
      newErrors.progressPercentage = 'Progress must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        progressPercentage: parseInt(formData.progressPercentage)
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {report ? 'Edit Progress Report' : 'Create New Progress Report'}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project *
              </label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.projectId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
              {errors.projectId && <p className="text-red-500 text-xs mt-1">{errors.projectId}</p>}
            </div>

            {/* Phase Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phase *
              </label>
              <select
                name="phaseId"
                value={formData.phaseId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phaseId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={!selectedProject}
              >
                <option value="">Select a phase</option>
                {selectedProject?.phases?.map(phase => (
                  <option key={phase._id} value={phase._id}>
                    {phase.name}
                  </option>
                ))}
              </select>
              {errors.phaseId && <p className="text-red-500 text-xs mt-1">{errors.phaseId}</p>}
            </div>

            {/* Reported By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reported By *
              </label>
              <select
                name="reportedBy"
                value={formData.reportedBy}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.reportedBy ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select an engineer</option>
                {engineers.map(engineer => (
                  <option key={engineer._id} value={engineer._id}>
                    {engineer.name} - {engineer.role}
                  </option>
                ))}
              </select>
              {errors.reportedBy && <p className="text-red-500 text-xs mt-1">{errors.reportedBy}</p>}
            </div>

            {/* Progress Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress Percentage *
              </label>
              <input
                type="number"
                name="progressPercentage"
                value={formData.progressPercentage}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.progressPercentage ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                max="100"
                placeholder="0"
              />
              {errors.progressPercentage && <p className="text-red-500 text-xs mt-1">{errors.progressPercentage}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the progress made..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Next Steps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Steps
              </label>
              <textarea
                name="nextSteps"
                value={formData.nextSteps}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe upcoming tasks..."
              />
            </div>

            {/* Issues Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issues
              </label>
              
              {/* Add New Issue */}
              <div className="space-y-2 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newIssue.description}
                    onChange={(e) => setNewIssue(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Issue description"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newIssue.severity}
                    onChange={(e) => setNewIssue(prev => ({ ...prev, severity: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  <Button
                    type="button"
                    onClick={handleAddIssue}
                    className="w-full"
                  >
                    Add Issue
                  </Button>
                </div>
              </div>

              {/* Issues List */}
              <div className="space-y-2">
                {formData.issues.map((issue, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{issue.description}</p>
                      <p className="text-sm text-gray-500">
                        Severity: {issue.severity} | Status: {issue.status}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveIssue(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (report ? 'Update Report' : 'Create Report')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportForm;