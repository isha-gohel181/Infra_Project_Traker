import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { formatDate, getStatusColor } from '../../lib/utils';
import { ExternalLink } from 'lucide-react';

const RecentProjects = ({ projects }) => {
  const recentProjects = React.useMemo(() => {
    if (!projects) return [];
    return projects
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  }, [projects]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Projects
          <Link 
            to="/projects" 
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            View All
            <ExternalLink className="h-4 w-4 ml-1" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <div key={project._id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{project.location}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Started: {formatDate(project.startDate)}</span>
                  <span>•</span>
                  <span>Due: {formatDate(project.expectedEndDate)}</span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs text-gray-500">{project.overallProgress}%</span>
                  </div>
                  <Progress value={project.overallProgress} className="h-2" />
                </div>
              </div>
            </div>
          ))}
          {recentProjects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No projects found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentProjects;