
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity, MessageCircle, FileText, Mic, CheckCircle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const updateTypeIcons = {
  progress: Activity,
  comment: MessageCircle,
  status_change: CheckCircle,
  file_upload: FileText,
  voice_note: Mic
};

const updateTypeColors = {
  progress: "bg-blue-100 text-blue-700",
  comment: "bg-emerald-100 text-emerald-700", 
  status_change: "bg-purple-100 text-purple-700",
  file_upload: "bg-amber-100 text-amber-700",
  voice_note: "bg-pink-100 text-pink-700"
};

export default function RecentActivity({ updates, tasks, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {updates.slice(0, 5).map((update) => {
            const task = tasks.find(t => t.id === update.task_id);
            const Icon = updateTypeIcons[update.update_type] || Activity;
            
            return (
              <div key={update.id} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm">
                    {update.created_by?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {update.created_by}
                    </p>
                    <Badge className={updateTypeColors[update.update_type]}>
                      <Icon className="w-3 h-3 mr-1" />
                      {update.update_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-1">
                    {update.update_text}
                  </p>
                  
                  {task && (
                    <p className="text-xs text-slate-500">
                      on <span className="font-medium">{task.title}</span>
                    </p>
                  )}
                  
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDistanceToNow(new Date(update.created_date), { addSuffix: true })}
                  </p>
                </div>

                {update.hours_logged && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">{update.hours_logged}h</div>
                    <div className="text-xs text-slate-500">logged</div>
                  </div>
                )}
              </div>
            );
          })}

          {updates.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No recent activity</p>
              <p className="text-sm">Task updates will appear here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

