import React, { useState } from 'react';
import { Feedback } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Send, X } from 'lucide-react';

export default function FeedbackForm({ projects, users, tasks, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        target_user: '',
        task_id: 'none',
        rating: '5',
        content: '',
        visibility: 'team'
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await Feedback.create(formData);
            onSave();
        } catch (error) {
            console.error("Error creating feedback:", error);
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label className="mb-2 block">Recipient (Who is this for?)</Label>
                <Select value={formData.target_user} onValueChange={(v) => setFormData({ ...formData, target_user: v })}>
                    <SelectTrigger><SelectValue placeholder="Select Team Member" /></SelectTrigger>
                    <SelectContent>
                        {users.map(u => (
                            <SelectItem key={u.id} value={u.email}>{u.full_name || u.email}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="mb-2 block">Rating</Label>
                    <Select value={formData.rating} onValueChange={(v) => setFormData({ ...formData, rating: v })}>
                        <SelectTrigger><SelectValue placeholder="Rating" /></SelectTrigger>
                        <SelectContent>
                            {[5, 4, 3, 2, 1].map(r => <SelectItem key={r} value={String(r)}>{r} Stars</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="mb-2 block">Visibility</Label>
                    <Select value={formData.visibility} onValueChange={(v) => setFormData({ ...formData, visibility: v })}>
                        <SelectTrigger><SelectValue placeholder="Visibility" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="team">Visible to Team</SelectItem>
                            <SelectItem value="private">Private (Manager Only)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <Label className="mb-2 block">Related Task (Optional)</Label>
                <Select value={formData.task_id} onValueChange={(v) => setFormData({ ...formData, task_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select Task" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">General Feedback (No specific task)</SelectItem>
                        {tasks.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="mb-2 block">Feedback Message</Label>
                <Textarea
                    placeholder="Constructive feedback, appreciation, or review notes..."
                    className="min-h-[120px]"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !formData.target_user} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    Submit Feedback
                </Button>
            </div>
        </form>
    );
}
