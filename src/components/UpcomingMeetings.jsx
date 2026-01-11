import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, Clock, Users, Video, ArrowRight } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const meetingTypeColors = {
  standup: "bg-blue-100 text-blue-700",
  review: "bg-emerald-100 text-emerald-700",
  milestone: "bg-purple-100 text-purple-700", 
  planning: "bg-amber-100 text-amber-700",
  retrospective: "bg-pink-100 text-pink-700"
};

export default function UpcomingMeetings({ meetings, isLoading }) {
  const upcomingMeetings = meetings.filter(meeting => 
    new Date(meeting.scheduled_date) >= new Date() && meeting.status === 'scheduled'
  ).slice(0, 4);

  const getDateLabel = (date) => {
    if (isToday(new Date(date))) return "Today";
    if (isTomorrow(new Date(date))) return "Tomorrow"; 
    return format(new Date(date), "MMM d");
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Meetings
        </CardTitle>
        <Link to={createPageUrl("Calendar")}>
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingMeetings.map((meeting) => (
            <div key={meeting.id} className="p-3 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 mb-1">{meeting.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(meeting.scheduled_date), "h:mm a")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {meeting.attendees?.length || 0} attendees
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={meetingTypeColors[meeting.meeting_type]}>
                    {meeting.meeting_type}
                  </Badge>
                  <span className="text-xs font-medium text-slate-600">
                    {getDateLabel(meeting.scheduled_date)}
                  </span>
                </div>
              </div>
              
              {meeting.description && (
                <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                  {meeting.description}
                </p>
              )}
            </div>
          ))}

          {upcomingMeetings.length === 0 && (
            <div className="text-center py-6 text-slate-500">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium mb-1">No upcoming meetings</p>
              <p className="text-xs">Schedule meetings in your calendar</p>
              <Link to={createPageUrl("Calendar")}>
                <Button size="sm" variant="outline" className="mt-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  Open Calendar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}