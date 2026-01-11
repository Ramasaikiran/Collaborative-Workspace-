import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginAsGuest } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
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
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-base">
                        Enter your credentials to access the workspace
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="password"
                                    className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {error && <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded">{error}</div>}

                        <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02]" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="flex items-center">Sign In <ArrowRight className="ml-2 w-4 h-4" /></span>}
                        </Button>
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase">Or</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={async () => {
                                setLoading(true);
                                await loginAsGuest();
                                navigate('/dashboard');
                            }}
                            className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                            disabled={loading}
                        >
                            Continue as Guest
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center text-sm text-slate-500 p-6">
                    <div className="w-full pt-4 border-t">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                            Create Account
                        </Link>
                    </div>

                    <div className="text-xs bg-slate-50 p-4 rounded border w-full">
                        <p className="font-semibold mb-2 text-slate-700">Quick Access (Demo):</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-2 bg-white rounded border cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all"
                                onClick={() => { setEmail('manager@example.com'); setPassword('password'); }}>
                                <div className="font-bold text-blue-700 mb-1">Manager</div>
                                <div className="text-slate-500 truncate">manager@example.com</div>
                            </div>
                            <div className="p-2 bg-white rounded border cursor-pointer hover:border-emerald-400 hover:shadow-sm transition-all"
                                onClick={() => { setEmail('member@example.com'); setPassword('password'); }}>
                                <div className="font-bold text-emerald-700 mb-1">Member</div>
                                <div className="text-slate-500 truncate">member@example.com</div>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
