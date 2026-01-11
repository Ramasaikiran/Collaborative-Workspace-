import React, { useState } from 'react';
import { Project } from '@/entities/Project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Save, X } from "lucide-react";
import { format } from "date-fns";

export default function ProjectForm({ project, users, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    project || {
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      team_members: [],
      project_lead: '',
      start_date: '',
      end_date: '',
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (formData.id) {
        await Project.update(formData.id, formData);
      } else {
        await Project.create(formData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving project:", error);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Project Name"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        required
      />
      <Textarea
        placeholder="Project Description"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={formData.priority} onValueChange={(v) => handleChange('priority', v)}>
          <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Select value={formData.project_lead} onValueChange={(v) => handleChange('project_lead', v)}>
          <SelectTrigger><SelectValue placeholder="Project Lead" /></SelectTrigger>
          <SelectContent>
            {users.map(user => <SelectItem key={user.id} value={user.email}>{user.full_name || user.email}</SelectItem>)}
          </SelectContent>
        </Select>
        {/* Simplified multi-select for team members, for a better UX a multi-select component would be needed */}
        <div>
          <label className="text-sm text-slate-500">Team Members (comma separated emails)</label>
          <Input
            placeholder="member1@example.com, member2@example.com"
            value={formData.team_members.join(', ')}
            onChange={(e) => handleChange('team_members', e.target.value.split(',').map(s => s.trim()))}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.start_date ? format(new Date(formData.start_date), 'PPP') : 'Start Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent><Calendar mode="single" selected={formData.start_date ? new Date(formData.start_date) : undefined} onSelect={(d) => handleChange('start_date', d)} /></PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.end_date ? format(new Date(formData.end_date), 'PPP') : 'End Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent><Calendar mode="single" selected={formData.end_date ? new Date(formData.end_date) : undefined} onSelect={(d) => handleChange('end_date', d)} /></PopoverContent>
        </Popover>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" /> Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" /> {isLoading ? 'Saving...' : 'Save Project'}
        </Button>
      </div>
    </form>
  );
}