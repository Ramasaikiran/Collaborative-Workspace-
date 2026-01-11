import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Github, FileText, Database, CheckCircle, Smartphone } from 'lucide-react';

export default function Integrations() {
    const [connected, setConnected] = useState({});
    const [selectedIntegration, setSelectedIntegration] = useState(null);
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const integrations = [
        {
            id: 'github',
            name: 'GitHub',
            description: 'Link your repositories to track commits and issues directly within tasks.',
            icon: Github,
            color: 'text-gray-900',
            fields: [
                { name: 'apiKey', label: 'Personal Access Token', type: 'password', placeholder: 'ghp_...' },
                { name: 'repo', label: 'Default Repository', type: 'text', placeholder: 'user/repo' }
            ]
        },
        {
            id: 'google-docs',
            name: 'Google Docs',
            description: 'Embed and edit documents for real-time collaboration on project specs.',
            icon: FileText,
            color: 'text-blue-600',
            fields: [
                { name: 'clientId', label: 'OAuth Client ID', type: 'text', placeholder: '...apps.googleusercontent.com' }
            ]
        },
        {
            id: 'notion',
            name: 'Notion',
            description: 'Sync your Notion databases and wiki pages with your workspace projects.',
            icon: Database,
            color: 'text-slate-900',
            fields: [
                { name: 'apiKey', label: 'Integration Token', type: 'password', placeholder: 'secret_...' },
                { name: 'dbId', label: 'Database ID', type: 'text', placeholder: '...' }
            ]
        },
        {
            id: 'slack',
            name: 'Slack',
            description: 'Receive real-time notifications for task updates and comments in your channels.',
            icon: Smartphone, // Using generic icon as placeholder
            color: 'text-purple-600',
            fields: [
                { name: 'webhook', label: 'Webhook URL', type: 'password', placeholder: 'https://hooks.slack.com/...' }
            ]
        }
    ];

    const handleConnect = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setConnected({ ...connected, [selectedIntegration.id]: true });
            setIsLoading(false);
            setSelectedIntegration(null);
            setApiKey('');
        }, 1500);
    };

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Integrations</h1>
                    <p className="text-slate-600 mt-2">Supercharge your workflow by connecting your favorite tools.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {integrations.map((integration) => (
                        <Card key={integration.id} className="hover:shadow-lg transition-shadow border-slate-200">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <integration.icon className={`w-8 h-8 ${integration.color}`} />
                                    {connected[integration.id] && (
                                        <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded-full border border-green-100 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Connected
                                        </span>
                                    )}
                                </div>
                                <CardTitle>{integration.name}</CardTitle>
                                <CardDescription className="mt-2">{integration.description}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                {connected[integration.id] ? (
                                    <Button variant="outline" className="w-full border-green-200 text-green-700 bg-green-50 hover:bg-green-100" onClick={() => setConnected({ ...connected, [integration.id]: false })}>
                                        Manage Connection
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        onClick={() => setSelectedIntegration(integration)}
                                    >
                                        Connect {integration.name}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Configuration Dialog */}
                <Dialog open={!!selectedIntegration} onOpenChange={(open) => !open && setSelectedIntegration(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                Connect {selectedIntegration?.name}
                            </DialogTitle>
                            <DialogDescription>
                                Enter the required credentials to enable this integration.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {selectedIntegration?.fields.map((field) => (
                                <div key={field.name} className="space-y-2">
                                    <Label>{field.label}</Label>
                                    <Input
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        // Mock binding, in real app would store properly
                                        onChange={(e) => setApiKey(e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedIntegration(null)}>Cancel</Button>
                            <Button onClick={handleConnect} disabled={isLoading} className="bg-blue-600">
                                {isLoading ? 'Connecting...' : 'Save & Connect'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
