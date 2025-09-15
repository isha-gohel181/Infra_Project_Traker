import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate, getStatusColor } from '../../lib/utils';
import { Calendar, Clock } from 'lucide-react';

const ProjectTimeline = ({ projects }) => {
  const timelineEvents = React.useMemo(() => {
    if (!projects) return [];

    const events = [];
    
    projects.forEach(project => {
      // Add project milestones
      events.push({
        id: `${project._id}-start`,
        type: 'project-start',
        date: project.startDate,
        title: `${project.name} - Project Start`,
        status: project.status,
        project: project.name
      });

      events.push({
        id: `${project._id}-end`,
        type: 'project-end',
        date: project.expectedEndDate,
        title: `${project.name} - Expected Completion`,
        status: project.status,
        project: project.name
      });

      // Add phase milestones
      project.phases?.forEach((phase, index) => {
        events.push({
          id: `${project._id}-phase-${index}`,
          type: 'phase',
          date: phase.endDate,
          title: `${project.name} - ${phase.name}`,
          status: phase.status,
          project: project.name,
          progress: phase.progress
        });
      });
    });

    return events
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10); // Show next 10 events
  }, [projects]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'project-start':
        return <Calendar className="h-4 w-4 text-green-600" />;
      case 'project-end':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'phase':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineEvents.map((event) => (
            <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {event.title}
                  </p>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{formatDate(event.date)}</span>
                  {event.progress !== undefined && (
                    <>
                      <span>•</span>
                      <span>{event.progress}% complete</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{event.project}</p>
              </div>
            </div>
          ))}
          {timelineEvents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No upcoming milestones
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;