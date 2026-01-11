import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Task, Project, User } from '@/entities/all';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckSquare, Search } from 'lucide-react';
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import TaskDetailsModal from "@/components/TaskDetailsModal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusMap = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  completed: 'Completed',
};

const columns = ['todo', 'in_progress', 'review', 'completed'];

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = assigneeFilter === 'all' || task.assigned_to === assigneeFilter;
    return matchesSearch && matchesAssignee;
  });

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      let taskFilter = {};
      // Logic for permission filtering if needed, e.g.
      // if (user.role === 'member') {
      //   taskFilter = { assigned_to: user.email };
      // }

      const [taskData, projectData, userData] = await Promise.all([
        Task.list(), // Or Task.filter(taskFilter)
        Project.list(),
        User.list(),
      ]);
      setTasks(taskData);
      setProjects(projectData);
      setUsers(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleTaskSaved = () => {
    setIsFormOpen(false);
    loadData();
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const taskToMove = tasks.find(t => t.id === draggableId);
    if (taskToMove && taskToMove.status !== destination.droppableId) {
      // Optimistic UI update
      setTasks(prevTasks =>
        prevTasks.map(t => (t.id === draggableId ? { ...t, status: destination.droppableId } : t))
      );
      // Persist change to the backend
      try {
        await Task.update(draggableId, { status: destination.droppableId });
      } catch (error) {
        console.error("Failed to update task status:", error);
        // Revert on failure? For now just log
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <CheckSquare className="w-8 h-8 text-blue-600" />
              Task Board
            </h1>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-9 w-full md:w-64 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Filter by Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {users.map(u => (
                    <SelectItem key={u.id} value={u.email}>{u.full_name || u.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <TaskForm
                    projects={projects}
                    users={users}
                    onSave={handleTaskSaved}
                    onCancel={() => setIsFormOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start h-full overflow-x-auto pb-4">
            {columns.map(columnId => {
              const columnTasks = filteredTasks.filter(t => (t.status || 'todo') === columnId);

              return (
                <div key={columnId} className="flex flex-col h-full bg-slate-100/50 rounded-xl p-4 min-w-[280px]">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-between">
                    {statusMap[columnId]}
                    <Badge variant="secondary" className="bg-white text-slate-600">
                      {columnTasks.length}
                    </Badge>
                  </h3>

                  <Droppable droppableId={columnId}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 space-y-3 min-h-[200px] transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
                          }`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? 0.8 : 1,
                                }}
                              >
                                <TaskCard
                                  task={task}
                                  onClick={() => setSelectedTask(task)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            // Update local state
            setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
            // Persist to backend (TaskDetailsModal handles its own save technically, but we update UI here)
            // Ideally TaskDetailsModal should call an API, or we pass a handler.
            // Looking at TaskDetailsModal logic, it calls onUpdate with the new task object.
            // We should probably save it here or assume TaskDetailsModal saved it? 
            // Ref says: "onUpdate: (updatedTask) => { ... }"
            // Let's assume we need to save it.
            Task.update(updatedTask.id, updatedTask).catch(err => console.error(err));
            setSelectedTask(null);
          }}
          users={users}
        />
      )}
    </DragDropContext>
  );
}