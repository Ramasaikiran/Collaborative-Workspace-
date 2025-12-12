import React from 'react';
import { Blocks, Github, Code, FileText } from 'lucide-react'; // Assuming valid imports, check icons availability or use Lucide generic
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function IntegrationsPage() {
  const integrations = [
    {
      id: 'github',
      title: 'GitHub',
      description: 'Link pull requests to tasks and update status automatically.',
      icon: <Github className="w-10 h-10 text-slate-900" />,
      color: 'bg-slate-900/10'
    },
    {
      id: 'gdocs',
      title: 'Google Docs',
      description: 'Embed documents directly into your task descriptions.',
      icon: <FileText className="w-10 h-10 text-blue-500" />,
      color: 'bg-blue-100'
    },
    {
      id: 'notion',
      title: 'Notion',
      description: 'Sync your workspace pages and databases two-way.',
      icon: <Blocks className="w-10 h-10 text-slate-800" />,
      color: 'bg-slate-100'
    }
  ];

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Blocks className="w-8 h-8 text-blue-600" />
            Integrations
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {integrations.map((tool) => (
            <Card key={tool.id} className="shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${tool.color}`}>
                  {tool.icon}
                </div>
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>Coming Soon</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}