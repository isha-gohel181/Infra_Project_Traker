import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PhaseCard from '../components/phases/PhaseCard';
import PhaseForm from '../components/phases/PhaseForm';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { projectsAPI, engineersAPI, reportsAPI } from '../services/api';
import { formatDate, formatCurrency, getStatusColor } from '../lib/utils';
import { ArrowLeft, Plus, MapPin, Calendar, DollarSign, Users, Edit } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [engineers, setEngineers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhaseForm, setShowPhaseForm] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectRes, engineersRes, reportsRes] = await Promise.all([
        projectsAPI.getById(id),
        engineersAPI.getAll(),
        reportsAPI.getByProject(id)
      ]);
      
      setProject(projectRes.data);
      setEngineers(engineersRes.data);
      setReports(reportsRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('Failed to fetch project details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhase = async (phaseData) => {
    try {
      const response = await projectsAPI.addPhase(id, phaseData);
      setProject(response.data);
      setShowPhaseForm(false);
      setEditingPhase(null);
    } catch (err) {
      console.error('Error adding phase:', err);
      setError('Failed to add phase. Please try again.');
    }
  };

  const handleEditPhase = async (phaseData) => {
    try {
      const response = await projectsAPI.updatePhase(id, editingPhase._id, phaseData);
      setProject(response.data);
      setShowPhaseForm(false);
      setEditingPhase(null);
    } catch (err) {
      console.error('Error updating phase:', err);
      setError('Failed to update phase. Please try again.');
    }
  };

  const handlePhaseFormSubmit = (phaseData) => {
    if (editingPhase) {
      handleEditPhase(phaseData);
    } else {
      handleAddPhase(phaseData);
    }
  };

  const handleAssignEngineer = (phase) => {
    setSelectedPhase(phase);
    setShowAssignModal(true);
  };

  const assignEngineerToPhase = async (engineerId, role) => {
    try {
      const response = await projectsAPI.assignEngineer(id, selectedPhase._id, {
        engineerId,
        role
      });
      setProject(response.data);
      setShowAssignModal(false);
      setSelectedPhase(null);
    } catch (err) {
      console.error('Error assigning engineer:', err);
      setError('Failed to assign engineer. Please try again.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error || 'Project not found'}</div>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/projects')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="mt-2 text-gray-600 max-w-3xl">{project.description}</p>
            </div>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Phases */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Project Phases</h2>
                <Button onClick={() => setShowPhaseForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Phase
                </Button>
              </div>

              {project.phases && project.phases.length > 0 ? (
                <div className="space-y-4">
                  {project.phases.map((phase) => (
                    <PhaseCard
                      key={phase._id}
                      phase={phase}
                      engineers={engineers}
                      onEdit={(phase) => {
                        setEditingPhase(phase);
                        setShowPhaseForm(true);
                      }}
                      onAssignEngineer={handleAssignEngineer}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500 mb-4">No phases defined yet</p>
                    <Button onClick={() => setShowPhaseForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Phase
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Reports */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Recent Reports</h2>
                <Button variant="outline" onClick={() => navigate('/reports')}>
                  View All Reports
                </Button>
              </div>

              {reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.slice(0, 3).map((report) => (
                    <Card key={report._id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">Progress Report</p>
                          <span className="text-sm text-gray-500">
                            {formatDate(report.reportDate)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Progress: {report.progressPercentage}%</span>
                          <span className="text-xs text-gray-500">
                            By {report.reportedBy?.name}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-gray-500">No reports available</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 font-medium">{project.location}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">Start Date:</span>
                  <span className="ml-2 font-medium">{formatDate(project.startDate)}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">Due Date:</span>
                  <span className="ml-2 font-medium">{formatDate(project.expectedEndDate)}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">Budget:</span>
                  <span className="ml-2 font-medium">{formatCurrency(project.budget)}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">Client:</span>
                  <span className="ml-2 font-medium">{project.client}</span>
                </div>
              </CardContent>
            </Card>

            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Completion</span>
                    <span className="text-sm text-gray-600">{project.overallProgress}%</span>
                  </div>
                  <Progress value={project.overallProgress} className="h-3" />
                  
                  {project.currentPhase && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Current Phase</p>
                      <p className="font-medium">{project.currentPhase}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Phase Form Modal */}
        {showPhaseForm && (
          <PhaseForm
            phase={editingPhase}
            onSubmit={handlePhaseFormSubmit}
            onCancel={() => {
              setShowPhaseForm(false);
              setEditingPhase(null);
            }}
          />
        )}

        {/* Engineer Assignment Modal */}
        {showAssignModal && selectedPhase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>Assign Engineer to {selectedPhase.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engineers.map((engineer) => (
                    <div key={engineer._id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{engineer.name}</p>
                        <p className="text-sm text-gray-500">{engineer.role}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => assignEngineerToPhase(engineer._id, engineer.role)}
                      >
                        Assign
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowAssignModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectDetails;