'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Lightbulb, Presentation, Code, Download, Copy, Check, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

type Mode = 'validator' | 'pitch' | 'prototype' | 'qa';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  mode?: Mode;
  data?: unknown;
  timestamp: Date;
  suggestions?: string[];
}

interface ValidationData {
  marketSize?: {
    tam?: string;
    sam?: string;
    som?: string;
  };
  validationScore?: {
    score?: number;
  };
  differentiator?: string;
  competitors?: Competitor[];
  [key: string]: unknown;
}

interface PitchData {
  slides?: Slide[];
  investorEmail?: {
    subject?: string;
    body?: string;
  };
  [key: string]: unknown;
}

interface PrototypeData {
  architecture?: {
    overview?: string;
    techStack?: {
      frontend?: string;
      backend?: string;
      database?: string;
    };
  };
  comparisons?: TechComparison[];
  [key: string]: unknown;
}

interface Competitor {
  name: string;
  [key: string]: unknown;
}

interface Slide {
  title: string;
  content: string;
  [key: string]: unknown;
}

interface TechComparison {
  name: string;
  [key: string]: unknown;
}

interface ConversationContext {
  businessIdea?: string;
  validationData?: ValidationData;
  pitchData?: PitchData;
  prototypeData?: PrototypeData;
  conversationHistory: Message[];
}

const modes = [
  { 
    id: 'validator' as Mode, 
    label: 'Idea Validator', 
    icon: Lightbulb, 
    color: 'bg-green-100 text-green-700',
    description: 'Validate your business idea with market research'
  },
  { 
    id: 'pitch' as Mode, 
    label: 'Pitch Builder', 
    icon: Presentation, 
    color: 'bg-purple-100 text-purple-700',
    description: 'Generate professional pitch decks'
  },
  { 
    id: 'prototype' as Mode, 
    label: 'Tech Stack Guide', 
    icon: Code, 
    color: 'bg-orange-100 text-orange-700',
    description: 'Get personalized tech stack recommendations'
  },
  { 
    id: 'qa' as Mode, 
    label: 'Q&A Assistant', 
    icon: User, 
    color: 'bg-blue-100 text-blue-700',
    description: 'Ask questions about your business idea'
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Welcome to Starto! 🚀\n\nI'm your AI co-founder ready to transform your idea spark into an investor-ready startup. Let's build something amazing together!\n\nWhat would you like to work on today?",
      timestamp: new Date(),
      suggestions: ['Validate Business Idea', 'Generate Pitch Deck', 'Get Tech Stack Guide', 'Ask Questions']
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedMode, setSelectedMode] = useState<Mode>('validator');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('web');
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    conversationHistory: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const platforms = [
    { value: 'web', label: 'Web App' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'api', label: 'API Service' },
    { value: 'fullstack', label: 'Full-Stack' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionClick = async (suggestion: string, targetMode?: Mode) => {
    // Initial welcome suggestions - just set mode and focus input
    if (suggestion === 'Validate Business Idea') {
      setSelectedMode('validator');
      textareaRef.current?.focus();
      return;
    }
    
    if (suggestion === 'Generate Pitch Deck' && !conversationContext.businessIdea) {
      setSelectedMode('pitch');
      textareaRef.current?.focus();
      return;
    }
    
    if (suggestion === 'Get Tech Stack Guide' && !conversationContext.businessIdea) {
      setSelectedMode('prototype');
      textareaRef.current?.focus();
      return;
    }
    
    if (suggestion === 'Ask Questions') {
      setSelectedMode('qa');
      textareaRef.current?.focus();
      return;
    }
    
    // RAG flow suggestions - automatically generate content
    if (suggestion === 'Generate Pitch Deck' || suggestion.includes('Pitch')) {
      setSelectedMode('pitch');
      await processMessage('AUTO_GENERATE_PITCH', 'pitch', true);
      return;
    }
    
    if (suggestion === 'Get Tech Stack Guide' || suggestion.includes('Tech Stack')) {
      setSelectedMode('prototype');  
      await processMessage('AUTO_GENERATE_TECH_STACK', 'prototype', true);
      return;
    }
    
    // Handle cross-mode suggestions that switch to other modes
    if (suggestion === 'Refine Validation' || suggestion.includes('Refine Validation')) {
      setSelectedMode('validator');
      await processMessage('AUTO_REFINE_VALIDATION', 'validator', true);
      return;
    }
    
    if (suggestion === 'Update Pitch Deck' || suggestion.includes('Update Pitch') || suggestion.includes('Refine Business Model')) {
      setSelectedMode('pitch');
      await processMessage('AUTO_UPDATE_PITCH', 'pitch', true);
      return;
    }
    
    // Handle Q&A specific suggestions
    if (suggestion === 'Ask another question' || 
        suggestion.includes('Ask about') || 
        suggestion.includes('Discuss') || 
        suggestion.includes('Explore') || 
        suggestion.includes('Review') ||
        suggestion === 'Ask about market strategy' ||
        suggestion === 'Discuss technical challenges' ||
        suggestion === 'Explore funding options' ||
        suggestion === 'Review competitive positioning') {
      setSelectedMode('qa');
      // Pass the actual suggestion text instead of a generic auto-generated flag
      await processMessage(suggestion, 'qa', false);
      return;
    }
    
    // Fallback for other suggestions
    if (targetMode) {
      setSelectedMode(targetMode);
      await processMessage(suggestion, targetMode, true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const messageToSend = input;
    setInput(''); // Clear input immediately
    await processMessage(messageToSend, selectedMode, false);
  };

  const processMessage = async (messageContent: string, mode: Mode, isAutoGenerated: boolean) => {
    let displayContent = messageContent;
    
    if (isAutoGenerated) {
      if (messageContent === 'AUTO_GENERATE_PITCH') {
        displayContent = 'Generate pitch deck based on validation data';
      } else if (messageContent === 'AUTO_GENERATE_TECH_STACK') {
        displayContent = 'Generate tech stack recommendations based on previous analysis';
      } else if (messageContent === 'AUTO_REFINE_VALIDATION') {
        displayContent = 'Refine business idea validation with updated analysis';
      } else if (messageContent === 'AUTO_UPDATE_PITCH') {
        displayContent = 'Update pitch deck with latest business insights';
      } else {
        displayContent = `Generate ${mode === 'pitch' ? 'pitch deck' : mode === 'prototype' ? 'tech stack guide' : 'analysis'} based on previous context`;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: displayContent,
      mode: mode,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    // Update conversation context
    const updatedContext = {
      ...conversationContext,
      conversationHistory: [...conversationContext.conversationHistory, userMessage]
    };

    if (mode === 'validator' && !isAutoGenerated) {
      updatedContext.businessIdea = messageContent;
    }

    try {
      let endpoint = '';
      const requestBody: Record<string, unknown> = {
        idea: conversationContext.businessIdea || messageContent,
        context: updatedContext,
        conversationHistory: updatedContext.conversationHistory
      };

      switch (mode) {
        case 'validator':
          endpoint = '/api/validate-idea';
          break;
        case 'pitch':
          endpoint = '/api/generate-pitch';
          if (conversationContext.validationData) {
            requestBody.validationData = conversationContext.validationData;
          }
          break;
        case 'prototype':
          endpoint = '/api/create-prototype';
          requestBody.platform = selectedPlatform;
          if (conversationContext.validationData) {
            requestBody.validationData = conversationContext.validationData;
          }
          if (conversationContext.pitchData) {
            requestBody.pitchData = conversationContext.pitchData;
          }
          break;
        case 'qa':
          endpoint = '/api/qa-assistant';
          requestBody.question = messageContent;
          if (conversationContext.validationData) {
            requestBody.validationData = conversationContext.validationData;
          }
          if (conversationContext.pitchData) {
            requestBody.pitchData = conversationContext.pitchData;
          }
          if (conversationContext.prototypeData) {
            requestBody.prototypeData = conversationContext.prototypeData;
          }
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Determine suggestions based on current mode and available data
        let suggestions: string[] = [];
        if (mode === 'validator') {
          suggestions = ['Generate Pitch Deck', 'Get Tech Stack Guide'];
          updatedContext.validationData = data.validation || data;
        } else if (mode === 'pitch') {
          suggestions = ['Get Tech Stack Guide', 'Refine Business Model'];
          updatedContext.pitchData = data.pitch || data;
        } else if (mode === 'prototype') {
          suggestions = ['Refine Validation', 'Update Pitch Deck'];
          updatedContext.prototypeData = data.techStack || data.prototype || data;
        } else if (mode === 'qa') {
          suggestions = data.suggestions || ['Ask about market strategy', 'Discuss technical challenges', 'Explore funding options', 'Review competitive positioning'];
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: formatResponse(mode, data),
          mode: mode,
          data: data,
          suggestions: suggestions,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
        setConversationContext({
          ...updatedContext,
          conversationHistory: [...updatedContext.conversationHistory, aiMessage]
        });
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `Sorry, I encountered an error: ${data.error || 'Unknown error'}. Please try again.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Network error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Sorry, I encountered an error. Please try again.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (mode: Mode, data: ValidationData | PitchData | PrototypeData | { answer?: string } | unknown): string => {
    switch (mode) {
      case 'validator':
        const validation = (data as { validation?: ValidationData }).validation;
        if (!validation) {
          return 'Validation data not available. Please try again.';
        }
        
        const validationScore = validation.validationScore || { score: 0, reasoning: 'Score not available' };
        const reasoning = (validationScore as { reasoning?: string }).reasoning || 'Score not available';
        const marketSize = validation.marketSize || { tam: 'Not specified', sam: 'Not specified', som: 'Not specified' };
        const competitors = Array.isArray(validation.competitors) ? validation.competitors : [];
        const nextSteps = Array.isArray(validation.nextSteps) ? validation.nextSteps : [];
        
        return `## Idea Validation Results

**Validation Score: ${validationScore.score}/10**

${reasoning}

### Market Size
- **TAM:** ${marketSize.tam}
- **SAM:** ${marketSize.sam}  
- **SOM:** ${marketSize.som}

### Key Differentiator
${validation.differentiator || 'Not specified'}

### Top Competitors
${competitors.length > 0 ? competitors.slice(0, 2).map((comp: Competitor) => 
  `**${comp.name || 'Unknown'}:** ${(comp as { description?: string }).description || 'No description'}`
).join('\n') : 'No competitors identified'}

### Next Steps
${nextSteps.length > 0 ? nextSteps.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n') : '1. Continue with market research'}`;

      case 'pitch':
        const pitch = (data as { pitch?: PitchData }).pitch;
        if (!pitch) {
          return 'Pitch data not available. Please try again.';
        }
        
        const slides = pitch.slides || [];
        const investorEmail = pitch.investorEmail || { subject: 'Investment Opportunity', body: 'Please find our pitch deck attached.' };
        
        return `## Pitch Deck Generated

I've created a professional ${slides.length}-slide pitch deck for your idea:

${slides.map((slide: Slide, index: number) => 
  `### Slide ${(slide as { slideNumber?: number }).slideNumber || index + 1}: ${slide.title || 'Untitled'}
${slide.content || 'Content not available'}

**Key Points:**
${Array.isArray((slide as { keyPoints?: string[] }).keyPoints) ? (slide as { keyPoints?: string[] }).keyPoints?.map((point: string) => `• ${point}`).join('\n') : '• Key points not available'}`
).join('\n\n')}

### Investor Email Template
**Subject:** ${investorEmail.subject}

${investorEmail.body}`;

      case 'prototype':
        const techData = (data as { techStack?: PrototypeData; prototype?: PrototypeData }).techStack || (data as { techStack?: PrototypeData; prototype?: PrototypeData }).prototype;
        if (!techData) {
          return 'Tech stack data not available. Please try again.';
        }
        
        const comparisons = techData.comparisons || [];
        const considerations = techData.considerations || {} as Record<string, unknown>;
        const timeline = techData.timeline || {} as Record<string, unknown>;
        const costs = techData.costs || {} as Record<string, unknown>;
        
        return `## Personalized Tech Stack Recommendations

### Recommended Stack for Your Business

**Primary Recommendation**: ${techData.primaryStack || 'Modern web application stack'}

**Frontend**: ${techData.frontend || 'React.js with Next.js'}
- **Why**: ${techData.frontendReason || 'Excellent for scalable user interfaces with strong ecosystem support'}
- **Alternatives**: ${techData.frontendAlts || 'Vue.js, Angular, Svelte'}

**Backend**: ${techData.backend || 'Node.js with Express'}
- **Why**: ${techData.backendReason || 'JavaScript consistency across stack, large developer pool'}
- **Alternatives**: ${techData.backendAlts || 'Python Flask/Django, Ruby on Rails, Go'}

**Database**: ${techData.database || 'PostgreSQL'}
- **Why**: ${techData.databaseReason || 'Robust relational database with JSON support for flexibility'}
- **Alternatives**: ${techData.databaseAlts || 'MySQL, MongoDB, Firebase'}

**Hosting & Infrastructure**: ${techData.hosting || 'Vercel + Railway'}
- **Why**: ${techData.hostingReason || 'Easy deployment with excellent developer experience'}
- **Alternatives**: ${techData.hostingAlts || 'AWS, Google Cloud, Heroku'}

### Stack Comparison Analysis

${comparisons.length > 0 ? comparisons.map((comp: TechComparison) => 
  `**${comp.name || 'Option'}**: 
  - Pros: ${(comp as { pros?: string[] }).pros?.join(', ') || 'Various benefits'}
  - Cons: ${(comp as { cons?: string[] }).cons?.join(', ') || 'Some limitations'}
  - Best for: ${(comp as { bestFor?: string }).bestFor || 'Specific use cases'}`
).join('\n\n') : `**Performance Stack** (Recommended):
- Pros: Fast development, great ecosystem, scalable
- Cons: Higher learning curve initially
- Best for: MVP to enterprise scaling

**Budget Stack**:
- Pros: Lower costs, simpler deployment
- Cons: Limited scalability options
- Best for: Early validation phase`}

### Implementation Timeline

**Phase 1 (Weeks 1-2)**: ${(timeline as Record<string, string>).phase1 || 'Setup development environment and basic project structure'}
**Phase 2 (Weeks 3-4)**: ${(timeline as Record<string, string>).phase2 || 'Core functionality development and database integration'}
**Phase 3 (Weeks 5-6)**: ${(timeline as Record<string, string>).phase3 || 'UI/UX implementation and testing'}
**Phase 4 (Weeks 7-8)**: ${(timeline as Record<string, string>).phase4 || 'Deployment and production optimization'}

### Cost Breakdown

**Development**: ${(costs as Record<string, string>).development || '$0-500/month for initial development tools'}
**Hosting**: ${(costs as Record<string, string>).hosting || '$0-50/month for MVP, scaling with usage'}
**Third-party Services**: ${(costs as Record<string, string>).services || '$0-200/month for essential integrations'}
**Total Monthly**: ${(costs as Record<string, string>).total || '$50-300/month depending on scale'}

### Key Considerations

**Scalability**: ${(considerations as Record<string, string>).scalability || 'Chosen stack supports growth from MVP to enterprise'}
**Developer Experience**: ${(considerations as Record<string, string>).devExperience || 'Modern tools with excellent debugging and deployment'}
**Community Support**: ${(considerations as Record<string, string>).community || 'Large communities for quick problem resolution'}
**Long-term Viability**: ${(considerations as Record<string, string>).longTerm || 'Technologies with strong future roadmaps'}`;

      case 'qa':
        return (data as { answer?: string; response?: string }).answer || (data as { answer?: string; response?: string }).response || 'Response generated successfully!';

      default:
        return 'Response generated successfully!';
    }
  };

  const copyToClipboard = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportData = (message: Message) => {
    if (!message.data) return;

    const content = message.content;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${message.mode}-${message.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderSuggestions = (message: Message): React.ReactNode => {
    if (!message.suggestions || !Array.isArray(message.suggestions) || message.suggestions.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {message.id !== '1' && <span className="text-sm text-gray-600 font-medium">Continue with:</span>}
        {message.suggestions.map((suggestion: string, index: number) => (
          <Button
            key={index}
            size="sm"
            variant="outline"
            onClick={() => {
              if (suggestion === 'Validate Business Idea' || 
                  suggestion === 'Generate Pitch Deck' || 
                  suggestion === 'Get Tech Stack Guide' ||
                  suggestion === 'Refine Validation' ||
                  suggestion === 'Update Pitch Deck' ||
                  suggestion === 'Refine Business Model') {
                handleSuggestionClick(suggestion);
              } else if (suggestion.includes('Ask about') || 
                       suggestion.includes('Discuss') || 
                       suggestion.includes('Explore') || 
                       suggestion.includes('Review') ||
                       suggestion === 'Ask another question') {
                handleSuggestionClick(suggestion);
              } else {
                const targetMode: Mode = suggestion.includes('Pitch') ? 'pitch' : 'prototype';
                handleSuggestionClick(suggestion, targetMode);
              }
            }}
            className="text-sm bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Starto
            </h1>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pt-24 pb-60">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  message.type === 'user' ? 'bg-blue-600 ml-4' : 'bg-gray-600 mr-4'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                </div>
                <Card className={`shadow-lg border-0 ${message.type === 'user' ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' : 'bg-white/90 backdrop-blur-sm'}`}>
                  <CardContent className="p-6">
                    {message.mode && message.type === 'user' && (
                      <div className="flex items-center space-x-2 mb-2 opacity-80">
                        {(() => {
                          const mode = modes.find(m => m.id === message.mode);
                          const Icon = mode?.icon || Lightbulb;
                          return (
                            <>
                              <Icon className="h-3 w-3" />
                              <span className="text-xs font-medium">{mode?.label}</span>
                            </>
                          );
                        })()}
                      </div>
                    )}
                    <div className="max-w-none">
                      {message.type === 'ai' ? (
                        <div className="prose prose-gray max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                              h1: ({children}) => <h1 className="text-xl font-bold mt-6 mb-3 text-gray-900 first:mt-0">{children}</h1>,
                              h2: ({children}) => <h2 className="text-lg font-bold mt-5 mb-2 text-gray-900 first:mt-0">{children}</h2>,
                              h3: ({children}) => <h3 className="text-base font-semibold mt-4 mb-2 text-gray-900">{children}</h3>,
                              h4: ({children}) => <h4 className="text-sm font-semibold mt-3 mb-1 text-gray-900">{children}</h4>,
                              p: ({children}) => <p className="mb-2 text-sm text-gray-800 leading-relaxed">{children}</p>,
                              ul: ({children}) => <ul className="mb-3 space-y-0.5">{children}</ul>,
                              ol: ({children}) => <ol className="mb-3 space-y-0.5 list-decimal list-inside">{children}</ol>,
                              li: ({children}) => <li className="ml-3 text-sm text-gray-800">{children}</li>,
                              strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                              code: ({children}) => <code className="bg-gray-100 text-gray-900 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                              pre: ({children}) => <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto my-3 text-sm">{children}</pre>,
                              blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-3 italic text-sm text-gray-700 my-3">{children}</blockquote>,
                              table: ({children}) => (
                                <div className="overflow-x-auto my-4">
                                  <table className="min-w-full border border-gray-300 bg-white text-sm">
                                    {children}
                                  </table>
                                </div>
                              ),
                              thead: ({children}) => <thead className="bg-gray-50">{children}</thead>,
                              tbody: ({children}) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
                              tr: ({children}) => <tr className="border-b border-gray-200">{children}</tr>,
                              th: ({children}) => <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-r border-gray-300 last:border-r-0">{children}</th>,
                              td: ({children}) => <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-300 last:border-r-0">{children}</td>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-white font-medium leading-relaxed text-sm">{message.content}</p>
                      )}
                    </div>
                    {message.type === 'ai' && (
                      <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                        {/* Suggestion Buttons */}
                        <div>
                          {renderSuggestions(message) as React.ReactNode}
                        </div>
                        
                        {/* Export Buttons */}
                        {Boolean(message.data) && (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(message.content, message.id)}
                            >
                              {copiedId === message.id ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => exportData(message)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 mr-4 flex items-center justify-center shadow-sm">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                      <span className="text-gray-700 font-medium">Generating response...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-xl">
        <div className="max-w-4xl mx-auto p-6">
          {/* Mode Selection Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Mode:</span>
              <div className="flex space-x-2">
                {modes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedMode === mode.id
                          ? mode.color + ' shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {selectedMode === 'prototype' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Platform:</span>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {platforms.map(platform => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Input Row */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Describe your business idea for ${modes.find(m => m.id === selectedMode)?.label.toLowerCase()}...`}
                className="w-full min-h-[80px] max-h-40 resize-none border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white text-black placeholder-gray-500 text-base leading-relaxed p-4 pr-12 shadow-sm transition-all duration-200"
                disabled={loading}
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <div className="text-xs text-gray-400">
                  {input.length > 0 && `${input.length} chars`}
                </div>
              </div>
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-6 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[80px] flex items-center justify-center"
            >
              <Send className="h-6 w-6" />
            </Button>
          </div>

          {/* Mode Description */}
          <div className="mt-3 text-sm text-gray-600">
            {modes.find(m => m.id === selectedMode)?.description}
          </div>
        </div>
      </div>
    </div>
  );
}