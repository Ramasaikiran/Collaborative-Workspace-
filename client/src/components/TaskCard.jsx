
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MessageSquare, Paperclip } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const priorityColors = {
  low: 'border-blue-300',
  medium: 'border-amber-300',
  high: 'border-red-300',
  critical: 'border-purple-300',
};

export default function TaskCard({ task, onClick }) {
  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'completed';

  return (
    <Card onClick={onClick} className={`shadow-md bg-white border-l-4 ${priorityColors[task.priority]} cursor-pointer hover:shadow-lg transition-shadow`}>
      <CardContent className="p-4 space-y-3">
        <p className="font-semibold text-slate-800">{task.title}</p>

        <div className="flex justify-between items-center text-xs text-slate-500">
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-semibold' : ''}`}>
            <Clock className="w-3 h-3" />
            <span>{dueDate ? formatDistanceToNow(dueDate, { addSuffix: true }) : 'No due date'}</span>
          </div>
          <div className="flex items-center gap-3">
            {task.attachments?.length > 0 && <div className="flex items-center gap-1"><Paperclip className="w-3 h-3" />{task.attachments.length}</div>}
            {/* This would require a relation to TaskUpdate entity */}
            {/* <div className="flex items-center gap-1"><MessageSquare className="w-3 h-3"/>3</div> */}
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t">
          {task.tags?.length > 0 && (
            <div className="flex gap-1">
              {task.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-green-500 text-white text-xs font-semibold">
              {task.assigned_to?.[0].toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
}
