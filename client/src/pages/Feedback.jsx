import React, { useState, useEffect } from 'react';
import { Feedback as FeedbackEntity, Task, Project, User } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Star, Plus, ExternalLink } from 'lucide-react';

import FeedbackForm from "@/components/FeedbackForm";
import FeedbackCard from "@/components/FeedbackCard";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('received');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [feedbackData, taskData, projectData, userData] = await Promise.all([
        FeedbackEntity.list('-created_date'),
        Task.list(),
        Project.list(),
        User.list()
      ]);

      const user = await User.me();

      setFeedbacks(feedbackData);
      setTasks(taskData);
      setProjects(projectData);
      setUsers(userData);
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleFeedbackSaved = () => {
    setIsFormOpen(false);
    loadData();
  };

  const receivedFeedback = feedbacks.filter(f => f.target_user === currentUser?.email);
  const givenFeedback = feedbacks.filter(f => f.created_by === currentUser?.email);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            Feedback & Reviews
          </h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.open('https://forms.gle/example', '_blank')}
              className="border-emerald-200 hover:bg-emerald-50"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Google Form Survey
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Give Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Give Feedback</DialogTitle>
                </DialogHeader>
                <FeedbackForm
                  projects={projects}
                  users={users}
                  tasks={tasks}
                  onSave={handleFeedbackSaved}
                  onCancel={() => setIsFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="received">Received ({receivedFeedback.length})</TabsTrigger>
            <TabsTrigger value="given">Given ({givenFeedback.length})</TabsTrigger>
            <TabsTrigger value="team">Team Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {receivedFeedback.map(feedback => (
                <FeedbackCard key={feedback.id} feedback={feedback} users={users} tasks={tasks} />
              ))}
              {receivedFeedback.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <MessageCircle className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No feedback received yet</h3>
                    <p className="text-slate-500">Feedback from your team will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="given" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {givenFeedback.map(feedback => (
                <FeedbackCard key={feedback.id} feedback={feedback} users={users} tasks={tasks} />
              ))}
              {givenFeedback.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Star className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No feedback given yet</h3>
                    <p className="text-slate-500">Start by giving feedback to your teammates.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {feedbacks.filter(f => f.visibility === 'team').map(feedback => (
                <FeedbackCard key={feedback.id} feedback={feedback} users={users} tasks={tasks} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}