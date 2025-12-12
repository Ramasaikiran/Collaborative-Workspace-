import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Video, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const meetingTypeColors = {
    standup: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    review: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    milestone: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    planning: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    retrospective: "bg-pink-100 text-pink-700 hover:bg-pink-200"
};

export default function MeetingCard({ meeting, onAddToCalendar, onMarkAttendance }) {
    const isPast = new Date(meeting.scheduled_date) < new Date();

    return (
        <Card className={`mb-3 overflow-hidden transition-all hover:shadow-md ${isPast ? 'bg-slate-50 opacity-80' : 'bg-white border-blue-100'}`}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className={`font-semibold ${isPast ? 'text-slate-600' : 'text-slate-900'}`}>{meeting.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(meeting.scheduled_date), 'MMM d, yyyy')}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(meeting.scheduled_date), 'h:mm a')}</span>
                            {meeting.duration_minutes && <span>• {meeting.duration_minutes} min</span>}
                        </div>
                    </div>
                    {meeting.meeting_type && (
                        <Badge className={`${meetingTypeColors[meeting.meeting_type]} capitalize border-0`}>
                            {meeting.meeting_type}
                        </Badge>
                    )}
                </div>

                {meeting.description && (
                    <p className="text-sm text-slate-600 mt-2 mb-3 line-clamp-2">{meeting.description}</p>
                )}

                <div className="flex justify-between items-center pt-2 border-t mt-2">
                    <div className="flex -space-x-2">
                        {meeting.attendees && meeting.attendees.map((userId, i) => (
                            <Avatar key={i} className="w-6 h-6 border-2 border-white">
                                <AvatarFallback className="text-[10px] bg-slate-200">{typeof userId === 'string' ? 'U' : userId}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>

                    {!isPast && onAddToCalendar && (
                        <a
                            href={onAddToCalendar(meeting)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                            <Video className="w-3 h-3" /> Join/Add
                        </a>
                    )}

                    {isPast && (
                        <div className="flex items-center gap-2">
                            {meeting.attendance_status ? (
                                <Badge variant={meeting.attendance_status === 'present' ? 'success' : 'destructive'} className="uppercase text-[10px]">
                                    {meeting.attendance_status}
                                </Badge>
                            ) : (
                                <>
                                    <button
                                        className="text-xs text-green-600 hover:text-green-700 font-medium border border-green-200 hover:bg-green-50 px-2 py-1 rounded transition-colors"
                                        onClick={() => onMarkAttendance && onMarkAttendance('present')}
                                        title="Mark as Attended"
                                    >
                                        Present
                                    </button>
                                    <button
                                        className="text-xs text-red-600 hover:text-red-700 font-medium border border-red-200 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                                        onClick={() => onMarkAttendance && onMarkAttendance('absent')}
                                        title="Mark as Absent"
                                    >
                                        Absent
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
