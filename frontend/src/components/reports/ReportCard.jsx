import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatDate } from '../../lib/utils';
import { Calendar, User, AlertTriangle, FileText, Eye } from 'lucide-react';

const ReportCard = ({ report, onView }) => {
  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const openIssues = report.issues?.filter(issue => issue.status !== 'resolved').length || 0;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Progress Report</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(report)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Report Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(report.reportDate)}
            </div>
            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-2" />
              {report.reportedBy?.name || 'Unknown'}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className={`text-sm font-bold ${getProgressColor(report.progressPercentage)}`}>
                {report.progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  report.progressPercentage >= 80 ? 'bg-green-500' :
                  report.progressPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${report.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 line-clamp-3">
              {report.description}
            </p>
          </div>

          {/* Issues Summary */}
          {report.issues && report.issues.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Issues
                </span>
                {openIssues > 0 && (
                  <Badge className="bg-red-100 text-red-800">
                    {openIssues} Open
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {['critical', 'high', 'medium', 'low'].map(severity => {
                  const count = report.issues.filter(issue => issue.severity === severity).length;
                  return count > 0 ? (
                    <Badge key={severity} className={`${getSeverityColor(severity)} text-xs`}>
                      {count} {severity}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Attachments */}
          {report.attachments && report.attachments.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-2" />
              {report.attachments.length} attachment(s)
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;