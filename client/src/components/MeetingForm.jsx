import React, { useState } from 'react';
import { format } from 'date-fns';
import { Meeting } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from "lucide-react";

export default function MeetingForm({ meeting, selectedDate, projects, users, onSave, onCancel }) {
    // Default to today's date if no selectedDate
    // Default to today's date if no selectedDate
    // Use format(date, 'yyyy-MM-dd') to keep local date instead of UTC shift
    const defaultDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');

    const [formData, setFormData] = useState(
        meeting || {
            title: '',
            scheduled_date: defaultDate,
            time: '09:00', // Default time
            attendees: [],
        }
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAttendeeChange = (userId) => {
        setFormData(prev => {
            const current = prev.attendees || [];
            if (current.includes(userId)) {
                return { ...prev, attendees: current.filter(id => id !== userId) };
            } else {
                return { ...prev, attendees: [...current, userId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting meeting form", formData);
        setIsLoading(true);
        try {
            // Combine Date and Time into ISO string
            const combinedDateTime = new Date(`${formData.scheduled_date}T${formData.time}`);

            // Process attendees text
            const attendeesList = formData.attendees_text
                ? formData.attendees_text.split(',').map(s => s.trim()).filter(Boolean)
                : [];

            const payload = {
                ...formData,
                attendees: attendeesList,
                scheduled_date: combinedDateTime.toISOString(),
                // Defaulting values not in simplified form
                description: formData.title,
                duration_minutes: 60,
                meeting_type: 'standup',
                status: 'scheduled'
            };

            if (formData.id) {
                await Meeting.update(formData.id, payload);
            } else {
                await Meeting.create(payload);
            }
            onSave();
        } catch (error) {
            console.error("Error saving meeting:", error);
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="h-10"
                    required
                    autoFocus
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                    id="date"
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => handleChange('scheduled_date', e.target.value)}
                    className="h-10 block w-full"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className="h-10 block w-full"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="attendees">Invite Team Members</Label>
                <div className="space-y-2 mt-2">
                    <Input
                        id="attendees"
                        placeholder="Enter team member names or emails (comma separated)"
                        value={formData.attendees_text || ''}
                        onChange={(e) => handleChange('attendees_text', e.target.value)}
                        className="h-10 block w-full"
                        title="Team Members"
                    />
                    <p className="text-xs text-slate-500">Separate multiple members with commas.</p>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
                <Button type="button" variant="outline" onClick={onCancel} className="px-6">
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 px-6">
                    {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
                </Button>
            </div>
        </form>
    );
}
