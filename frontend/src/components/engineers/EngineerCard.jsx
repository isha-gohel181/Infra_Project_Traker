import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Mail, Phone, Award, Edit, Trash2 } from 'lucide-react';

const EngineerCard = ({ engineer, onEdit, onDelete }) => {
  const getRoleColor = (role) => {
    const roleColors = {
      'Project Manager': 'bg-purple-100 text-purple-800',
      'Civil Engineer': 'bg-blue-100 text-blue-800',
      'Structural Engineer': 'bg-green-100 text-green-800',
      'Electrical Engineer': 'bg-yellow-100 text-yellow-800',
      'Mechanical Engineer': 'bg-red-100 text-red-800',
      'Site Supervisor': 'bg-orange-100 text-orange-800'
    };
    
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{engineer.name}</CardTitle>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(engineer)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(engineer)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Badge className={getRoleColor(engineer.role)}>
          {engineer.role}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Contact Information */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              {engineer.email}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              {engineer.contactNumber}
            </div>
          </div>

          {/* Specialization */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Specialization</p>
            <p className="text-sm text-gray-600">{engineer.specialization}</p>
          </div>

          {/* Experience */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Award className="h-4 w-4 mr-2" />
              Experience
            </div>
            <Badge variant="secondary">
              {engineer.experience} years
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngineerCard;