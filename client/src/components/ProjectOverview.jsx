import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FolderOpen, Users, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  planning: "bg-gray-100 text-gray-700",
  active: "bg-emerald-100 text-emerald-700", 
  on_hold: "bg-amber-100 text-amber-700",
  completed: "bg-blue-100 text-blue-700"
};

const priorityColors = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
  critical: "bg-purple-100 text-purple-700"
};

export default function ProjectOverview({ projects, tasks, isLoading }) {
  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(task => task.project_id === projectId);
    if (projectTasks.length === 0) return 0;
    const completed = projectTasks.filter(task => task.status === 'completed').length;
    return Math.round((completed / projectTasks.length) * 100);
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          Active Projects
        </CardTitle>
        <Link to={createPageUrl("Projects")}>
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.slice(0, 3).map((project) => {
            const progress = getProjectProgress(project.id);
            const projectTasks = tasks.filter(task => task.project_id === project.id);
            
            return (
              <div key={project.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{project.name}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Badge className={statusColors[project.status]}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={priorityColors[project.priority]}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.team_members?.length || 0} members
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due {project.end_date ? format(new Date(project.end_date), 'MMM d') : 'TBD'}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-medium text-slate-900">
                      {projectTasks.filter(t => t.status === 'completed').length} / {projectTasks.length} tasks
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            );
          })}

          {projects.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No projects yet</p>
              <p className="text-sm">Create your first project to get started</p>
              <Link to={createPageUrl("Projects")}>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}