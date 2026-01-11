import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Lock, Mail, User, Loader2, ArrowRight, Briefcase } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Signup() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'member'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData.email, formData.password, formData.full_name, formData.role, formData.invite_code);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />

            <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur border-0 z-10">
                <CardHeader className="space-y-1 text-center pb-8 border-b bg-slate-50/50 rounded-t-lg">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        CodeHustlers
                    </CardTitle>
                    <CardDescription className="text-base">
                        Create your workspace account
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <div className="relative group">
                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    placeholder="Full Name"
                                    className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                    value={formData.full_name}
                                    onChange={(e) => handleChange('full_name', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative group">
                                <Briefcase className="absolute z-10 left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Select value={formData.role} onValueChange={(v) => handleChange('role', v)}>
                                    <SelectTrigger className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="member">Team Member</SelectItem>
                                        <SelectItem value="manager">Project Manager</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500 ml-1">Have an invite code? (Optional)</Label>
                            <Input
                                placeholder="Paste Invite Code to join a team"
                                className="h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                value={formData.invite_code || ''}
                                onChange={(e) => handleChange('invite_code', e.target.value)}
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded">{error}</div>}

                        <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02]" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="flex items-center">Create Account <ArrowRight className="ml-2 w-4 h-4" /></span>}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                    <div className="text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
