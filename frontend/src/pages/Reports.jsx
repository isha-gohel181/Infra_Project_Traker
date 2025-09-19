import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import ReportCard from '../components/reports/ReportCard';
import ReportForm from '../components/reports/ReportForm'; // Add this import
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { reportsAPI, projectsAPI, engineersAPI } from '../services/api'; // Add engineersAPI
import { Plus, Search, Filter, FileText } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [engineers, setEngineers] = useState([]); // Add engineers state
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Add form state
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, projectFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsResponse, engineersResponse] = await Promise.all([
        projectsAPI.getAll(),
        engineersAPI.getAll()
      ]);
      
      const projectsData = projectsResponse.data;
      setProjects(projectsData);
      setEngineers(engineersResponse.data);

      // Fetch reports for all projects
      const reportsPromises = projectsData.map(project => 
        reportsAPI.getByProject(project._id).catch(() => ({ data: [] }))
      );
      
      const reportsResponses = await Promise.all(reportsPromises);
      const allReports = reportsResponses.flatMap(response => response.data);
      
      setReports(allReports);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (projectFilter !== 'all') {
      filtered = filtered.filter(report => report.projectId === projectFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));

    setFilteredReports(filtered);
  };

  // Add report creation handler
  const handleCreateReport = async (reportData) => {
    try {
      setFormLoading(true);
      const response = await reportsAPI.create(reportData);
      
      // Add the new report to the list
      setReports(prev => [response.data, ...prev]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error creating report:', err);
      setError('Failed to create report. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // Add report update handler
  const handleUpdateReport = async (reportData) => {
    try {
      setFormLoading(true);
      const response = await reportsAPI.update(editingReport._id, reportData);
      
      // Update the report in the list
      setReports(prev =>
        prev.map(report =>
          report._id === editingReport._id ? response.data : report
        )
      );
      setEditingReport(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error updating report:', err);
      setError('Failed to update report. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormSubmit = (reportData) => {
    if (editingReport) {
      handleUpdateReport(reportData);
    } else {
      handleCreateReport(reportData);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingReport(null);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
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

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progress Reports</h1>
            <p className="mt-2 text-gray-600">
              Track project progress and issues across all projects
            </p>
          </div>
          <Button 
            className="flex items-center"
            onClick={() => setShowForm(true)} // Add onClick handler
          >
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Project Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reports Grid */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 mb-4">
              {reports.length === 0 ? 'No reports found' : 'No reports match your filters'}
            </div>
            {reports.length === 0 && (
              <Button onClick={() => setShowForm(true)}> {/* Add onClick handler */}
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Report
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard
                key={report._id}
                report={report}
                onView={handleViewReport}
              />
            ))}
          </div>
        )}

        {/* Report Form Modal */}
        {showForm && (
          <ReportForm
            report={editingReport}
            projects={projects}
            engineers={engineers}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={formLoading}
          />
        )}

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Progress Report Details</CardTitle>
                  <Button variant="ghost" onClick={handleCloseModal}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">Report Date</p>
                      <p className="text-gray-600">{new Date(selectedReport.reportDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Reported By</p>
                      <p className="text-gray-600">{selectedReport.reportedBy?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Progress</p>
                      <p className="text-gray-600">{selectedReport.progressPercentage}%</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Project</p>
                      <p className="text-gray-600">
                        {projects.find(p => p._id === selectedReport.projectId)?.name || 'Unknown Project'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 mb-2">Description</p>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded">{selectedReport.description}</p>
                  </div>

                  {selectedReport.issues && selectedReport.issues.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Issues ({selectedReport.issues.length})</p>
                      <div className="space-y-2">
                        {selectedReport.issues.map((issue, index) => (
                          <div key={index} className="p-3 border rounded bg-red-50">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-medium text-red-900">{issue.description}</p>
                              <span className={`text-xs px-2 py-1 rounded ${
                                issue.severity === 'critical' ? 'bg-red-200 text-red-800' :
                                issue.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                                issue.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-green-200 text-green-800'
                              }`}>
                                {issue.severity}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">Status: {issue.status}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedReport.nextSteps && (
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Next Steps</p>
                      <p className="text-gray-600 bg-blue-50 p-3 rounded">{selectedReport.nextSteps}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;