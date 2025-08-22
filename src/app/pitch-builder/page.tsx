'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Presentation, Download, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface PitchSlide {
  slideNumber: number;
  title: string;
  content: string;
  keyPoints: string[];
  notes: string;
}

interface PitchResult {
  slides: PitchSlide[];
  investorEmail: {
    subject: string;
    body: string;
  };
  onePager: string;
}

export default function PitchBuilderPage() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PitchResult | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleGeneratePitch = async () => {
    if (!idea.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();
      if (data.pitch) {
        setResult(data.pitch);
      }
    } catch (error) {
      console.error('Pitch generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportPitch = () => {
    if (!result) return;
    
    const content = `# Pitch Deck

${result.slides.map(slide => `
## Slide ${slide.slideNumber}: ${slide.title}

${slide.content}

### Key Points:
${slide.keyPoints.map(point => `- ${point}`).join('\n')}

### Speaker Notes:
${slide.notes}

---
`).join('')}

## Investor Email Template

**Subject:** ${result.investorEmail.subject}

${result.investorEmail.body}

## One-Pager Summary

${result.onePager}`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pitch-deck.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportInvestorEmail = () => {
    if (!result) return;
    
    const content = `Subject: ${result.investorEmail.subject}

${result.investorEmail.body}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investor-email.txt';
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
            <div className="bg-purple-100 p-2 rounded-lg mr-4">
              <Presentation className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pitch Builder</h1>
              <p className="text-gray-600">Generate professional pitch decks and investor materials</p>
            </div>
          </div>
        </div>

        {!result ? (
          <div className="max-w-2xl mx-auto">
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
                  onClick={handleGeneratePitch} 
                  disabled={!idea.trim() || loading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Pitch...
                    </>
                  ) : (
                    'Generate Pitch Deck'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Slides</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-2">
                    {result.slides.map((slide, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                          activeSlide === index
                            ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div className="font-medium">Slide {slide.slideNumber}</div>
                        <div className="text-gray-600">{slide.title}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 space-y-2">
                <Button onClick={exportPitch} className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Pitch Deck
                </Button>
                <Button onClick={exportInvestorEmail} className="w-full" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Export Email Template
                </Button>
              </div>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {result.slides[activeSlide]?.title}
                    <span className="text-sm text-gray-500">
                      Slide {result.slides[activeSlide]?.slideNumber} of {result.slides.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-8 min-h-[400px]">
                    <h3 className="text-2xl font-bold mb-4 text-center">
                      {result.slides[activeSlide]?.title}
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {result.slides[activeSlide]?.content}
                      </p>
                      <ul className="space-y-2">
                        {result.slides[activeSlide]?.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Speaker Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {result.slides[activeSlide]?.notes}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                      disabled={activeSlide === 0}
                    >
                      Previous Slide
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveSlide(Math.min(result.slides.length - 1, activeSlide + 1))}
                      disabled={activeSlide === result.slides.length - 1}
                    >
                      Next Slide
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}