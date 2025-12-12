
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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

export default function ProjectCard({ project, tasks }) {
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <Card className="flex flex-col shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base font-bold text-slate-900">{project.name}</CardTitle>
          <Badge className={statusColors[project.status]}>{project.status.replace('_', ' ')}</Badge>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2 pt-1">{project.description}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Progress</span>
              <span className="font-medium text-slate-700">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex justify-between items-center text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <CheckSquare className="w-4 h-4" />
              <span>{completedTasks}/{tasks.length} Tasks</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{project.end_date ? format(new Date(project.end_date), 'MMM d') : 'N/A'}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="flex -space-x-2">
          {project.team_members?.slice(0, 3).map((email, index) => (
            <HoverCard key={index}>
              <HoverCardTrigger>
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-xs font-semibold">
                    {email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent className="p-2 text-xs">
                {email}
              </HoverCardContent>
            </HoverCard>
          ))}
          {project.team_members?.length > 3 && (
             <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarFallback>+{project.team_members.length - 3}</AvatarFallback>
             </Avatar>
          )}
        </div>
        <Badge className={priorityColors[project.priority]} variant="outline">{project.priority}</Badge>
      </CardFooter>
    </Card>
  );
}
