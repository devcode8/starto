'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ValidationResult {
  marketSize: {
    tam: string;
    sam: string;
    som: string;
  };
  competitors: Array<{
    name: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    marketPosition: string;
  }>;
  painPoints: Array<{
    problem: string;
    severity: string;
    evidence: string;
  }>;
  differentiator: string;
  validationScore: {
    score: number;
    reasoning: string;
    risks: string[];
    opportunities: string[];
  };
  nextSteps: string[];
}

export default function ValidatorPage() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/validate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();
      if (data.validation) {
        setResult(data.validation);
      }
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportResult = () => {
    if (!result) return;
    
    const content = `# Business Idea Validation Report

## Market Size Analysis
- **TAM (Total Addressable Market):** ${result.marketSize.tam}
- **SAM (Serviceable Addressable Market):** ${result.marketSize.sam}
- **SOM (Serviceable Obtainable Market):** ${result.marketSize.som}

## Competitive Analysis
${result.competitors.map(comp => `
### ${comp.name}
- **Description:** ${comp.description}
- **Strengths:** ${comp.strengths.join(', ')}
- **Weaknesses:** ${comp.weaknesses.join(', ')}
- **Market Position:** ${comp.marketPosition}
`).join('')}

## Key Pain Points
${result.painPoints.map(pain => `
- **${pain.problem}** (${pain.severity} severity)
  - Evidence: ${pain.evidence}
`).join('')}

## Differentiator
${result.differentiator}

## Validation Score: ${result.validationScore.score}/10
${result.validationScore.reasoning}

### Risks:
${result.validationScore.risks.map(risk => `- ${risk}`).join('\n')}

### Opportunities:
${result.validationScore.opportunities.map(opp => `- ${opp}`).join('\n')}

## Next Steps
${result.nextSteps.map(step => `1. ${step}`).join('\n')}`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validation-report.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-lg mr-4">
              <Lightbulb className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Idea Validator</h1>
              <p className="text-gray-600">Get comprehensive market validation for your startup idea</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Describe Your Business Idea</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Example: An app that matches fitness coaches with people recovering from injuries, focusing on personalized rehabilitation programs and safe exercise routines..."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button 
                  onClick={handleValidate} 
                  disabled={!idea.trim() || loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Validate Idea'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            {result ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Validation Results</h2>
                  <Button onClick={exportResult} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Validation Score
                      <span className={`text-2xl font-bold ${result.validationScore.score >= 7 ? 'text-green-600' : result.validationScore.score >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {result.validationScore.score}/10
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{result.validationScore.reasoning}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Size</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>TAM:</strong> {result.marketSize.tam}</div>
                    <div><strong>SAM:</strong> {result.marketSize.sam}</div>
                    <div><strong>SOM:</strong> {result.marketSize.som}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Differentiator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{result.differentiator}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Competitors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.competitors.map((comp, i) => (
                      <div key={i} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold">{comp.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{comp.description}</p>
                        <div className="text-sm">
                          <div className="mb-1">
                            <strong>Strengths:</strong> {comp.strengths.join(', ')}
                          </div>
                          <div>
                            <strong>Weaknesses:</strong> {comp.weaknesses.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-1">
                      {result.nextSteps.map((step, i) => (
                        <li key={i} className="text-gray-700">{step}</li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-8 text-center text-gray-500">
                  <Lightbulb className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>Enter your business idea and click &quot;Validate Idea&quot; to get started</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}