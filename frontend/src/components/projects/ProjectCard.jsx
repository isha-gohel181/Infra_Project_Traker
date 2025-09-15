import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Button } from '../ui/Button';
import { formatDate, formatCurrency, getStatusColor } from '../../lib/utils';
import { MapPin, Calendar, DollarSign, Users, ExternalLink } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const assignedEngineersCount = React.useMemo(() => {
    if (!project.phases) return 0;
    
    const uniqueEngineers = new Set();
    project.phases.forEach(phase => {
      phase.assignedEngineers?.forEach(assignment => {
        uniqueEngineers.add(assignment.engineerId);
      });
    });
    
    return uniqueEngineers.size;
  }, [project.phases]);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Project Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {project.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(project.startDate)}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              {formatCurrency(project.budget)}
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              {assignedEngineersCount} Engineers
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{project.overallProgress}%</span>
            </div>
            <Progress value={project.overallProgress} className="h-2" />
          </div>

          {/* Current Phase */}
          {project.currentPhase && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Current Phase</p>
              <p className="text-sm text-gray-600">{project.currentPhase}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Link to={`/projects/${project._id}`} className="flex-1">
              <Button className="w-full" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;