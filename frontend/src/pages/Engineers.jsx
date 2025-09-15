import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import EngineerCard from '../components/engineers/EngineerCard';
import EngineerForm from '../components/engineers/EngineerForm';
import { Button } from '../components/ui/Button';
import { engineersAPI } from '../services/api';
import { Plus, Search, Filter } from 'lucide-react';

const Engineers = () => {
  const [engineers, setEngineers] = useState([]);
  const [filteredEngineers, setFilteredEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEngineer, setEditingEngineer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [formLoading, setFormLoading] = useState(false);

  const engineerRoles = [
    'Project Manager',
    'Civil Engineer',
    'Structural Engineer',
    'Electrical Engineer',
    'Mechanical Engineer',
    'Site Supervisor'
  ];

  useEffect(() => {
    fetchEngineers();
  }, []);

  useEffect(() => {
    filterEngineers();
  }, [engineers, searchTerm, roleFilter]);

  const fetchEngineers = async () => {
    try {
      setLoading(true);
      const response = await engineersAPI.getAll();
      setEngineers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching engineers:', err);
      setError('Failed to fetch engineers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterEngineers = () => {
    let filtered = engineers;

    if (searchTerm) {
      filtered = filtered.filter(engineer =>
        engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        engineer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        engineer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(engineer => engineer.role === roleFilter);
    }

    setFilteredEngineers(filtered);
  };

  const handleCreateEngineer = async (engineerData) => {
    try {
      setFormLoading(true);
      const response = await engineersAPI.create(engineerData);
      setEngineers(prev => [response.data, ...prev]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error creating engineer:', err);
      setError('Failed to create engineer. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateEngineer = async (engineerData) => {
    try {
      setFormLoading(true);
      const response = await engineersAPI.update(editingEngineer._id, engineerData);
      setEngineers(prev =>
        prev.map(engineer =>
          engineer._id === editingEngineer._id ? response.data : engineer
        )
      );
      setEditingEngineer(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error updating engineer:', err);
      setError('Failed to update engineer. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEngineer = async (engineer) => {
    if (window.confirm(`Are you sure you want to delete ${engineer.name}?`)) {
      try {
        await engineersAPI.delete(engineer._id);
        setEngineers(prev => prev.filter(e => e._id !== engineer._id));
        setError(null);
      } catch (err) {
        console.error('Error deleting engineer:', err);
        setError('Failed to delete engineer. Please try again.');
      }
    }
  };

  const handleFormSubmit = (engineerData) => {
    if (editingEngineer) {
      handleUpdateEngineer(engineerData);
    } else {
      handleCreateEngineer(engineerData);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEngineer(null);
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
            <h1 className="text-3xl font-bold text-gray-900">Engineers</h1>
            <p className="mt-2 text-gray-600">
              Manage your engineering team members
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Engineer
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
              placeholder="Search engineers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Roles</option>
              {engineerRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Engineers Grid */}
        {filteredEngineers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {engineers.length === 0 ? 'No engineers found' : 'No engineers match your filters'}
            </div>
            {engineers.length === 0 && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Engineer
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEngineers.map((engineer) => (
              <EngineerCard
                key={engineer._id}
                engineer={engineer}
                onEdit={(engineer) => {
                  setEditingEngineer(engineer);
                  setShowForm(true);
                }}
                onDelete={handleDeleteEngineer}
              />
            ))}
          </div>
        )}

        {/* Engineer Form Modal */}
        {showForm && (
          <EngineerForm
            engineer={editingEngineer}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={formLoading}
          />
        )}
      </div>
    </Layout>
  );
};

export default Engineers;