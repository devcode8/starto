'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Code, Download, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ComponentCode {
  name: string;
  purpose: string;
  code: string;
  dependencies: string[];
}

interface ApiEndpoint {
  method: string;
  path: string;
  purpose: string;
  code: string;
}

interface Model {
  name: string;
  fields: Record<string, string>;
  relationships: string[];
}

interface PrototypeResult {
  architecture: {
    overview: string;
    components: string[];
    techStack: {
      frontend: string;
      backend: string;
      database: string;
      deployment: string;
    };
  };
  frontend: {
    components: ComponentCode[];
    pages: Array<{
      route: string;
      component: string;
      purpose: string;
    }>;
  };
  backend: {
    endpoints: ApiEndpoint[];
    models: Model[];
  };
  database: {
    schema: string;
    seedData: string;
  };
  setup: string[];
}

const platforms = [
  { value: 'web', label: 'Web Application (React/Next.js)' },
  { value: 'mobile', label: 'Mobile App (React Native)' },
  { value: 'api', label: 'API/Backend Service' },
  { value: 'fullstack', label: 'Full-Stack Application' },
];

export default function PrototypePage() {
  const [idea, setIdea] = useState('');
  const [platform, setPlatform] = useState('web');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PrototypeResult | null>(null);
  const [activeTab, setActiveTab] = useState('architecture');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleGeneratePrototype = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/create-prototype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, platform }),
      });

      const data = await response.json();
      if (data.prototype) {
        setResult(data.prototype);
      }
    } catch (error) {
      console.error('Prototype generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async (code: string, identifier: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(identifier);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const exportPrototype = () => {
    if (!result) return;
    
    const content = `# Technical Prototype

## Architecture Overview
${result.architecture.overview}

### Tech Stack
- **Frontend:** ${result.architecture.techStack.frontend}
- **Backend:** ${result.architecture.techStack.backend}
- **Database:** ${result.architecture.techStack.database}
- **Deployment:** ${result.architecture.techStack.deployment}

### Components
${result.architecture.components.map(comp => `- ${comp}`).join('\n')}

## Frontend Components

${result.frontend.components.map(comp => `
### ${comp.name}
**Purpose:** ${comp.purpose}

**Dependencies:** ${comp.dependencies.join(', ')}

\`\`\`javascript
${comp.code}
\`\`\`
`).join('')}

## Backend Endpoints

${result.backend.endpoints.map(endpoint => `
### ${endpoint.method} ${endpoint.path}
**Purpose:** ${endpoint.purpose}

\`\`\`javascript
${endpoint.code}
\`\`\`
`).join('')}

## Database Schema

\`\`\`sql
${result.database.schema}
\`\`\`

## Setup Instructions

${result.setup.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prototype-scaffold.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'architecture', label: 'Architecture' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'database', label: 'Database' },
    { id: 'setup', label: 'Setup' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center mb-4">
            <div className="bg-orange-100 p-2 rounded-lg mr-4">
              <Code className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Prototype Scaffolder</h1>
              <p className="text-gray-600">Generate technical architecture and code scaffolds</p>
            </div>
          </div>
        </div>

        {!result ? (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Technical Prototype</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Type
                  </label>
                  <Select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full"
                  >
                    {platforms.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Idea Description
                  </label>
                  <Textarea
                    placeholder="Example: An app that matches fitness coaches with people recovering from injuries, focusing on personalized rehabilitation programs and safe exercise routines..."
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>

                <Button 
                  onClick={handleGeneratePrototype} 
                  disabled={!idea.trim() || loading}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Prototype...
                    </>
                  ) : (
                    'Generate Prototype'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <Button onClick={exportPrototype} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Prototype
              </Button>
            </div>

            {activeTab === 'architecture' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {result.architecture.overview}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Tech Stack</h4>
                        <div className="space-y-2 text-sm">
                          <div><strong>Frontend:</strong> {result.architecture.techStack.frontend}</div>
                          <div><strong>Backend:</strong> {result.architecture.techStack.backend}</div>
                          <div><strong>Database:</strong> {result.architecture.techStack.database}</div>
                          <div><strong>Deployment:</strong> {result.architecture.techStack.deployment}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Key Components</h4>
                        <ul className="space-y-1 text-sm">
                          {result.architecture.components.map((comp, i) => (
                            <li key={i} className="flex items-start">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              {comp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'frontend' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Page Routes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.frontend.pages.map((page, i) => (
                        <div key={i} className="border-l-4 border-orange-500 pl-4">
                          <div className="font-medium">{page.route}</div>
                          <div className="text-sm text-gray-600">{page.purpose}</div>
                          <div className="text-sm text-gray-500">Component: {page.component}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {result.frontend.components.map((component, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {component.name}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyCode(component.code, `component-${i}`)}
                        >
                          {copiedCode === `component-${i}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{component.purpose}</p>
                      <div className="mb-3">
                        <strong>Dependencies:</strong> {component.dependencies.join(', ')}
                      </div>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm">
                          <code>{component.code}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'backend' && (
              <div className="space-y-6">
                {result.backend.endpoints.map((endpoint, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-bold mr-2 ${
                            endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {endpoint.method}
                          </span>
                          {endpoint.path}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyCode(endpoint.code, `endpoint-${i}`)}
                        >
                          {copiedCode === `endpoint-${i}` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{endpoint.purpose}</p>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm">
                          <code>{endpoint.code}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card>
                  <CardHeader>
                    <CardTitle>Data Models</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.backend.models.map((model, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">{model.name}</h4>
                          <div className="mb-3">
                            <strong>Fields:</strong>
                            <div className="mt-1 space-y-1">
                              {Object.entries(model.fields).map(([field, type]) => (
                                <div key={field} className="text-sm ml-2">
                                  <code className="bg-gray-100 px-1 rounded">{field}</code>: {type}
                                </div>
                              ))}
                            </div>
                          </div>
                          {model.relationships.length > 0 && (
                            <div>
                              <strong>Relationships:</strong>
                              <ul className="mt-1 space-y-1">
                                {model.relationships.map((rel, j) => (
                                  <li key={j} className="text-sm ml-2">- {rel}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Database Schema
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCode(result.database.schema, 'schema')}
                      >
                        {copiedCode === 'schema' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm">
                        <code>{result.database.schema}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Sample Data
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCode(result.database.seedData, 'seed')}
                      >
                        {copiedCode === 'seed' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm">
                        <code>{result.database.seedData}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'setup' && (
              <Card>
                <CardHeader>
                  <CardTitle>Setup Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {result.setup.map((step, i) => (
                      <li key={i} className="flex items-start">
                        <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                          {i + 1}
                        </span>
                        <div className="text-gray-700">{step}</div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}