import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Paperclip, Mic, Play, Square, Pause, Trash2, Calendar as CalendarIcon, Clock, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function TaskDetailsModal({ task, isOpen, onClose, onUpdate, users }) {
    const [activeTab, setActiveTab] = useState('details');
    const [subtasks, setSubtasks] = useState(task?.subtasks || []); // Mock subtasks if not in entity
    const [newSubtask, setNewSubtask] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(task?.voice_note || null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    // Temporary local state for editing details
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            // In a real app, fetch subtasks/attachments here
            setSubtasks([
                { id: 1, text: 'Review requirements', completed: true },
                { id: 2, text: 'Create initial draft', completed: false }
            ]);
        }
    }, [task]);

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (!newSubtask.trim()) return;
        setSubtasks([...subtasks, { id: Date.now(), text: newSubtask, completed: false }]);
        setNewSubtask('');
    };

    const toggleSubtask = (id) => {
        setSubtasks(subtasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteSubtask = (id) => {
        setSubtasks(subtasks.filter(t => t.id !== id));
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            const tracks = mediaRecorderRef.current.stream.getTracks();
            tracks.forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const handleSave = () => {
        // Mock save
        onUpdate({
            ...task,
            title,
            description,
            subtasks,
            voice_note: audioUrl
        });
        onClose();
    };

    if (!task) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'warning' : 'secondary'}>
                            {task.priority.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-slate-500 uppercase tracking-wider">{task.status.replace('_', ' ')}</span>
                    </div>
                    <DialogTitle className="text-xl">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-xl font-bold border-none shadow-none px-0 focus-visible:ring-0"
                        />
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="checklist">Checklist</TabsTrigger>
                        <TabsTrigger value="attachments">Files</TabsTrigger>
                        <TabsTrigger value="voice">Voice Note</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Description</label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[120px]"
                                placeholder="Task description..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Due Date</label>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    {task.due_date ? format(new Date(task.due_date), 'PPP') : <span>Pick a date</span>}
                                </Button>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><UserIcon className="w-4 h-4" /> Assignee</label>
                                <div className="flex items-center gap-2 p-2 border rounded-md">
                                    <Avatar className="w-6 h-6">
                                        <AvatarFallback>{task.assigned_to?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm truncate">{task.assigned_to}</span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="checklist" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            {subtasks.map(subtask => (
                                <div key={subtask.id} className="flex items-center gap-2 group">
                                    <button onClick={() => toggleSubtask(subtask.id)} className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${subtask.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 hover:border-blue-500'}`}>
                                        {subtask.completed && <Check className="w-3 h-3" />}
                                    </button>
                                    <span className={`flex-grow text-sm ${subtask.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{subtask.text}</span>
                                    <button onClick={() => deleteSubtask(subtask.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleAddSubtask} className="flex gap-2">
                            <Input
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                placeholder="Add a subtask..."
                                className="flex-grow"
                            />
                            <Button type="submit" size="sm" variant="secondary"><Check className="w-4 h-4" /></Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="attachments" className="mt-4">
                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                            <Paperclip className="w-8 h-8 mb-2 text-slate-400" />
                            <p className="text-sm font-medium">Drag & drop files here, or click to browse</p>
                            <p className="text-xs text-slate-400 mt-1">Supports PDF, PNG, JPG (Max 5MB)</p>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between p-3 border rounded bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded flex items-center justify-center font-bold text-xs">PDF</div>
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-700">Project_Specs.pdf</p>
                                        <p className="text-xs text-slate-400">2.4 MB</p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="voice" className="mt-4 flex flex-col items-center justify-center p-6 space-y-4">
                        {!audioUrl ? (
                            <div className="text-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${isRecording ? 'bg-red-100 animate-pulse' : 'bg-slate-100'}`}>
                                    <Mic className={`w-8 h-8 ${isRecording ? 'text-red-500' : 'text-slate-400'}`} />
                                </div>
                                {isRecording ? (
                                    <Button variant="destructive" onClick={stopRecording}>Stop Recording</Button>
                                ) : (
                                    <Button onClick={startRecording}>Start Recording</Button>
                                )}
                            </div>
                        ) : (
                            <div className="w-full bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Button size="icon" variant="secondary" className="rounded-full" onClick={() => new Audio(audioUrl).play()}>
                                        <Play className="w-4 h-4 fill-slate-700" />
                                    </Button>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-700">Voice Note</p>
                                        <p className="text-xs text-slate-400">0:15 • Just now</p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" onClick={() => setAudioUrl(null)} className="text-slate-400 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <DialogFooter className="mt-6">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
