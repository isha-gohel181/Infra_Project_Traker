import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';
import { formatDate, getStatusColor } from '../../lib/utils';
import { Calendar, Users, Edit, Plus } from 'lucide-react';

const PhaseCard = ({ phase, onEdit, onAssignEngineer, engineers = [] }) => {
  const getAssignedEngineers = () => {
    if (!phase.assignedEngineers) return [];
    
    return phase.assignedEngineers.map(assignment => {
      const engineer = engineers.find(e => e._id === assignment.engineerId);
      return {
        ...assignment,
        engineer
      };
    });
  };

  const assignedEngineers = getAssignedEngineers();

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{phase.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(phase.status)}>
              {phase.status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(phase)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600">{phase.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Start: {formatDate(phase.startDate)}
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              End: {formatDate(phase.endDate)}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">{phase.progress || 0}%</span>
            </div>
            <Progress value={phase.progress || 0} className="h-2" />
          </div>

          {/* Assigned Engineers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Assigned Engineers ({assignedEngineers.length})
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAssignEngineer(phase)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Assign
              </Button>
            </div>
            
            {assignedEngineers.length > 0 ? (
              <div className="space-y-2">
                {assignedEngineers.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">
                        {assignment.engineer?.name || 'Unknown Engineer'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {assignment.engineer?.role || 'No role specified'}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {assignment.role}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">
                No engineers assigned yet
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhaseCard;