import React, { useState, useEffect } from 'react';
import { Meeting, Task, Project, User } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar as CalendarIcon, Download, Clock, Users, Video } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay
} from 'date-fns';

import MeetingForm from "@/components/MeetingForm";
import MeetingCard from "@/components/MeetingCard";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [meetings, setMeetings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadCalendarData();
  }, [currentMonth]);

  const loadCalendarData = async () => {
    try {
      const [meetingData, taskData, projectData, userData] = await Promise.all([
        Meeting.list('-scheduled_date'),
        Task.list(),
        Project.list(),
        User.list()
      ]);

      setMeetings(meetingData);
      setTasks(taskData.filter(t => t.due_date));
      setProjects(projectData);
      setUsers(userData);
    } catch (error) {
      console.error("Error loading calendar data:", error);
    }
  };

  const handleMeetingSaved = () => {
    setIsFormOpen(false);
    setSelectedDate(null);
    loadCalendarData();
  };

  const generateCalendarLink = (meeting) => {
    const startDate = new Date(meeting.scheduled_date);
    const endDate = new Date(startDate.getTime() + (meeting.duration_minutes || 30) * 60000);

    const formatDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meeting.title)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(meeting.description || '')}&location=Online`;

    return googleCalendarUrl;
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center py-4">
      <Button variant="outline" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
        Prev
      </Button>
      <h2 className="text-2xl font-bold text-slate-800">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <Button variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
        Next
      </Button>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 text-center text-sm font-medium text-slate-600 bg-gray-100">
        {days.map(day => <div key={day} className="py-3 font-semibold">{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 border-l border-t">
        {days.map(day => {
          const dayMeetings = meetings.filter(m => isSameDay(new Date(m.scheduled_date), day));
          const dayTasks = tasks.filter(t => isSameDay(new Date(t.due_date), day));

          return (
            <div
              key={day}
              className={`border-r border-b p-2 min-h-[120px] cursor-pointer hover:bg-blue-50 transition-colors ${!isSameMonth(day, monthStart) ? 'bg-gray-50 text-gray-400' : 'bg-white'
                }`}
              onClick={() => {
                setSelectedDate(day);
                setIsFormOpen(true);
              }}
            >
              <div className={`font-semibold text-sm mb-2 ${isToday(day) ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
                }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayMeetings.slice(0, 2).map(meeting => (
                  <div key={`m-${meeting.id}`} className="text-xs bg-purple-100 text-purple-800 p-1 rounded truncate flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(meeting.scheduled_date), 'HH:mm')} {meeting.title}
                  </div>
                ))}
                {dayTasks.slice(0, 1).map(task => (
                  <div key={`t-${task.id}`} className="text-xs bg-amber-100 text-amber-800 p-1 rounded truncate">
                    Due: {task.title}
                  </div>
                ))}
                {(dayMeetings.length + dayTasks.length) > 3 && (
                  <div className="text-xs text-slate-500">+{(dayMeetings.length + dayTasks.length) - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const upcomingMeetings = meetings
    .filter(m => new Date(m.scheduled_date) >= new Date() && m.status === 'scheduled')
    .slice(0, 5);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-blue-600" />
            Calendar
          </h1>
          <Button
            onClick={() => {
              console.log("Opening Meeting Form");
              setIsFormOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[500px] p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold pb-4">Schedule New Meeting</DialogTitle>
              </DialogHeader>
              <MeetingForm
                selectedDate={selectedDate}
                projects={projects}
                users={users}
                onSave={handleMeetingSaved}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur shadow-lg rounded-lg">
              {renderHeader()}
              {renderDays()}
              {renderCells()}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingMeetings.map(meeting => (
                  <MeetingCard key={meeting.id} meeting={meeting} onAddToCalendar={generateCalendarLink} />
                ))}
                {upcomingMeetings.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">No upcoming meetings</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Past Meetings (Attendance)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {meetings
                  .filter(m => new Date(m.scheduled_date) < new Date())
                  .sort((a, b) => new Date(b.scheduled_date) - new Date(a.scheduled_date))
                  .slice(0, 5)
                  .map(meeting => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      onAddToCalendar={generateCalendarLink}
                      onMarkAttendance={async (status) => {
                        const updated = { ...meeting, attendance_status: status };
                        await Meeting.update(meeting.id, updated);
                        loadCalendarData();
                      }}
                    />
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}