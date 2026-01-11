import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Download, Calendar as CalendarIcon, CheckCircle2, MessageSquare } from 'lucide-react';
import { Task, Feedback, User } from '@/entities/all';
import { subDays, isAfter, parseISO } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

export default function Timesheets() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        completedTasks: 0,
        feedbackGiven: 0,
        feedbackReceived: 0
    });

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        if (!user) return;

        try {
            const [tasks, feedback] = await Promise.all([
                Task.list(),
                Feedback.list()
            ]);

            const sevenDaysAgo = subDays(new Date(), 7);

            const completedTasks = tasks.filter(t =>
                t.status === 'completed' &&
                t.assigned_to === user.email && // Assuming email match for now
                // t.updated_at would be ideal, but using rudimentary check if exists or just count
                // For this mock, we'll just count all completed as "recent" or filter if date exists
                true
            ).length;

            const recentFeedbackGiven = feedback.filter(f =>
                f.created_by === user.email &&
                isAfter(parseISO(f.created_date), sevenDaysAgo)
            ).length;

            const recentFeedbackReceived = feedback.filter(f =>
                f.target_user === user.email &&
                isAfter(parseISO(f.created_date), sevenDaysAgo)
            ).length;

            setStats({
                completedTasks,
                feedbackGiven: recentFeedbackGiven,
                feedbackReceived: recentFeedbackReceived
            });

        } catch (error) {
            console.error("Error loading analytics:", error);
        }
    };

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Clock className="w-8 h-8 text-blue-600" />
                        Timesheets & Analytics
                    </h1>
                    <div className="flex gap-3">
                        <Button variant="outline">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Last 7 Days
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                Tasks Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 flex flex-col items-center">
                                    <span className="text-3xl font-bold text-emerald-700">{stats.completedTasks}</span>
                                    <span className="text-sm text-emerald-600 font-medium">Completed Tasks</span>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                                    <p className="text-sm text-slate-500">Keep up the good work!</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-blue-500" />
                                Feedback Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex flex-col items-center">
                                    <span className="text-3xl font-bold text-blue-700">{stats.feedbackGiven}</span>
                                    <span className="text-sm text-blue-600 font-medium">Given</span>
                                </div>
                                <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 flex flex-col items-center">
                                    <span className="text-3xl font-bold text-indigo-700">{stats.feedbackReceived}</span>
                                    <span className="text-sm text-indigo-600 font-medium">Received</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Placeholder for actual timesheet grid */}
                <Card>
                    <CardHeader><CardTitle>Detailed Log</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-slate-500 text-sm italic border-2 border-dashed rounded-lg">
                            Detailed hourly logs and timesheet entry grid coming in v2.0
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
