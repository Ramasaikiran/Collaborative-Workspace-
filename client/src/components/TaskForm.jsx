import React, { useState } from 'react';
import { Task } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Save, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from '@/utils';
import VoiceTaskInput from './VoiceTaskInput';

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1.5 text-slate-700">
    {children}
  </label>
);

export default function TaskForm({ task, projects, users, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    task || {
      title: '',
      description: '',
      project_id: '',
      assigned_to: '',
      status: 'todo',
      priority: 'medium',
      due_date: '',
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleChange = (field, value) => {
    console.log(`Field changed: ${field} ->`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVoiceInput = (transcript) => {
    if (!formData.title) {
      handleChange('title', transcript);
    } else {
      handleChange('description', (formData.description + ' ' + transcript).trim());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Task Form", formData);
    setIsLoading(true);
    try {
      if (formData.id) {
        await Task.update(formData.id, formData);
      } else {
        await Task.create(formData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving task:", error);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            placeholder="e.g., Update Landing Page"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            className="w-full"
          />
        </div>
        <VoiceTaskInput onInput={handleVoiceInput} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Add details..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="project_id">Project</Label>
          <Input
            id="project_id"
            placeholder="Enter Project Name"
            value={formData.project_id}
            onChange={(e) => handleChange('project_id', e.target.value)}
            required
            className="w-full"
            title="Project Name"
          />
        </div>

        <div>
          <Label htmlFor="assigned_to">Assignee</Label>
          <Input
            id="assigned_to"
            placeholder="Enter Assignee Name/Email"
            value={formData.assigned_to}
            onChange={(e) => handleChange('assigned_to', e.target.value)}
            className="w-full"
            title="Assignee"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <div className="relative">
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              title="Task Status"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="priority">Priority</Label>
          <div className="relative">
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              title="Task Priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <Label>Due Date</Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              type="button"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.due_date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.due_date ? format(new Date(formData.due_date), 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.due_date ? new Date(formData.due_date) : undefined}
              onSelect={(d) => {
                handleChange('due_date', d ? d.toISOString() : '');
                setIsCalendarOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Checklist Feature */}
      <div className="space-y-2">
        <Label>Checklist</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add subtask..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const val = e.currentTarget.value.trim();
                if (val) {
                  setFormData(prev => ({
                    ...prev,
                    checklist: [...(prev.checklist || []), { id: Date.now(), text: val, completed: false }]
                  }));
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          <Button type="button" variant="outline" size="icon" onClick={() => {
            const input = document.querySelector('input[placeholder="Add subtask..."]');
            if (input && input.value.trim()) {
              setFormData(prev => ({
                ...prev,
                checklist: [...(prev.checklist || []), { id: Date.now(), text: input.value.trim(), completed: false }]
              }));
              input.value = '';
            }
          }}>
            <span className="text-lg">+</span>
          </Button>
        </div>
        <div className="space-y-1 pl-1">
          {(formData.checklist || []).map((item, idx) => (
            <div key={item.id} className="flex items-center gap-2 group">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => {
                  const newChecklist = [...formData.checklist];
                  newChecklist[idx].completed = !newChecklist[idx].completed;
                  setFormData({ ...formData, checklist: newChecklist });
                }}
                className="rounded border-gray-300"
                aria-label={`Mark ${item.text} as completed`}
              />
              <span className={cn("text-sm flex-1", item.completed && "line-through text-gray-400")}>{item.text}</span>
              <button
                type="button"
                onClick={() => {
                  const newChecklist = formData.checklist.filter((_, i) => i !== idx);
                  setFormData({ ...formData, checklist: newChecklist });
                }}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                aria-label="Delete subtask"
                title="Delete subtask"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Attachments (Mock) */}
      <div>
        <Label>Attachments</Label>
        <div className="mt-1 flex items-center gap-4">
          <Button type="button" variant="outline" className="relative" title="Choose File to Upload">
            Choose File
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                if (e.target.files?.length) {
                  // Mock upload
                  alert(`Mock upload: ${e.target.files[0].name} attached!`);
                }
              }}
              title="Upload File"
              aria-label="Upload File"
            />
          </Button>
          <span className="text-sm text-gray-500 italic">No file chosen</span>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
