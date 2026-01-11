import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Task } from '@/entities/Task';
import { useAuth } from '@/context/AuthContext';
import { differenceInDays, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

export default function NotificationCenter() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        if (user) {
            checkDeadlines();
            // Poll every minute
            const interval = setInterval(checkDeadlines, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const checkDeadlines = async () => {
        try {
            // Find tasks assigned to user (or all if manager, simplified to assigned for now)
            // Also check for upcoming meetings
            const [tasks, meetings] = await Promise.all([
                Task.list(),
                Meeting.list()
            ]);

            const myTasks = tasks.filter(t => t.assigned_to === user.email || user.role === 'manager');
            // Filter meetings where user is attendee or it's a team meeting
            const myMeetings = meetings.filter(m => {
                // Simplified check: if no attendees listed, assume team. 
                // If attendees listed, check if user ID is in it.
                if (!m.attendees || m.attendees.length === 0) return true;
                return m.attendees.includes(user.id) || m.attendees.includes(user.email);
            });

            const alerts = [];
            const now = new Date();

            // Task Deadline Logic
            myTasks.forEach(task => {
                if (task.status === 'completed') return;
                if (!task.due_date) return;

                const dueDate = new Date(task.due_date);
                const daysLeft = differenceInDays(dueDate, now);

                if (daysLeft >= 0 && daysLeft <= 2) {
                    alerts.push({
                        id: `task-${task.id}`,
                        title: `Task Due Soon: ${task.title}`,
                        message: daysLeft === 0 ? "Due today!" : `Due in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`,
                        type: 'urgent',
                        link: '/tasks'
                    });
                } else if (daysLeft < 0) {
                    alerts.push({
                        id: `task-${task.id}`,
                        title: `Task Overdue: ${task.title}`,
                        message: `Overdue by ${Math.abs(daysLeft)} days`,
                        type: 'critical',
                        link: '/tasks'
                    });
                }
            });

            // Meeting Alert Logic (1 Hour Warning)
            myMeetings.forEach(meeting => {
                if (!meeting.scheduled_date) return;
                const meetingTime = new Date(meeting.scheduled_date);
                const diffMs = meetingTime - now;
                const diffMinutes = Math.floor(diffMs / 60000);

                // Alert if meeting is between 0 and 60 minutes from now
                if (diffMinutes >= 0 && diffMinutes <= 60) {
                    const alertId = `meeting-${meeting.id}`;

                    // Helper helper to avoid spamming alerts if we had state persistence, 
                    // but for now we just show it in the list. 
                    // For "Real-time" effect, we can trigger browser notification

                    alerts.push({
                        id: alertId,
                        title: `Upcoming Meeting: ${meeting.title}`,
                        message: diffMinutes === 0 ? "Starting now!" : `Starts in ${diffMinutes} min`,
                        type: 'info',
                        link: '/calendar' // Or join link
                    });

                    // Browser Notification (Real-time)
                    if (Notification.permission === 'granted' && diffMinutes <= 60 && diffMinutes % 15 === 0) {
                        // Simple throttle: notify at 60, 45, 30, 15, 0 (roughly, depending on poll)
                        // Or just notify once if we tracked "notified" state, but stateless simplification:
                        new Notification(`Meeting: ${meeting.title}`, {
                            body: `Starting in ${diffMinutes} minutes`,
                        });
                    }
                }
            });

            setNotifications(alerts);
            setHasUnread(alerts.length > 0);
        } catch (error) {
            console.error("Error checking notifications:", error);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white hover:bg-slate-800">
                    <Bell className="w-5 h-5" />
                    {hasUnread && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="bg-slate-900 text-white p-3 font-semibold text-sm border-b border-slate-700">
                    Notifications
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No new notifications
                        </div>
                    ) : (
                        notifications.map((notif, i) => (
                            <div key={i} className="p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <div className={`text-sm font-medium ${notif.type === 'critical' ? 'text-red-600' : 'text-amber-600'}`}>
                                    {notif.title}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                    {notif.message}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-2 border-t bg-slate-50 text-center">
                    <Link to="/tasks" className="text-xs text-blue-600 hover:underline">View all tasks</Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
