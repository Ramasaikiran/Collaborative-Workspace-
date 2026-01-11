import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Project, Task, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, FolderOpen, Search } from "lucide-react";

import ProjectCard from "@/components/ProjectCard";
import ProjectForm from "@/components/ProjectForm";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projectData, taskData, userData] = await Promise.all([
        Project.list("-updated_date"),
        Task.list(),
        User.list()
      ]);
      setProjects(projectData);
      setTasks(taskData);
      setUsers(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleProjectSaved = () => {
    setIsFormOpen(false);
    loadData();
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <FolderOpen className="w-8 h-8 text-blue-600" />
              Projects
            </h1>
            <p className="text-slate-600 mt-2">Manage all your team's projects in one place.</p>
          </div>
          {user?.role === 'manager' && (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <ProjectForm users={users} onSave={handleProjectSaved} onCancel={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search projects..."
              className="pl-10 w-full md:w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} tasks={tasks.filter(t => t.project_id === project.id)} />
          ))}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skeleton loaders */}
            {Array(3).fill(0).map((_, i) => <Card key={i} className="animate-pulse"><CardHeader><div className="h-6 bg-gray-200 rounded w-3/4"></div></CardHeader><CardContent><div className="h-4 bg-gray-200 rounded w-full mb-2"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></CardContent></Card>)}
          </div>
        )}

        {!isLoading && filteredProjects.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-medium mb-2">No projects found</h2>
            <p>Start by creating a new project for your team.</p>
          </div>
        )}
      </div>
    </div>
  );
}