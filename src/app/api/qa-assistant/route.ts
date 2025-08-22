import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { question, idea, context, validationData, pitchData, prototypeData, conversationHistory } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Build comprehensive context for Q&A
    let contextPrompt = `You are an expert business consultant and startup advisor. Answer the user's question about their business idea with detailed, actionable insights.

Business Idea: ${idea || 'Not specified'}

Question: ${question}
`;

    // Add validation data context
    if (validationData) {
      contextPrompt += `

Previous Validation Analysis:
- Market Size TAM: ${validationData.marketSize?.tam || 'Not specified'}
- Market Size SAM: ${validationData.marketSize?.sam || 'Not specified'}
- Market Size SOM: ${validationData.marketSize?.som || 'Not specified'}
- Validation Score: ${validationData.validationScore?.score || 'Not specified'}/10
- Key Differentiator: ${validationData.differentiator || 'Not specified'}
- Main Competitors: ${validationData.competitors?.map((c: any) => c.name).join(', ') || 'Not specified'}
`;
    }

    // Add pitch data context
    if (pitchData) {
      contextPrompt += `

Previous Pitch Deck Analysis:
- Pitch deck has been generated with ${pitchData.slides?.length || 'multiple'} slides
- Key business model and value proposition defined
- Investor email template created
`;
    }

    // Add prototype data context
    if (prototypeData) {
      contextPrompt += `

Previous Technical Prototype:
- Architecture: ${prototypeData.architecture?.overview || 'Not specified'}
- Tech Stack: Frontend: ${prototypeData.architecture?.techStack?.frontend || 'Not specified'}, Backend: ${prototypeData.architecture?.techStack?.backend || 'Not specified'}
- Database: ${prototypeData.architecture?.techStack?.database || 'Not specified'}
- Key components and endpoints defined
`;
    }

    // Add recent conversation context
    if (conversationHistory && conversationHistory.length > 0) {
      const recentContext = conversationHistory.slice(-3).map((msg: any) => 
        `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content.substring(0, 300)}...`
      ).join('\n');
      contextPrompt += `

Recent Conversation Context:
${recentContext}
`;
    }

    contextPrompt += `

Please provide a comprehensive, helpful answer that takes into account all the available context about this business idea. Be specific and actionable in your response.`;

    const messages = [
      {
        role: 'system' as const,
        content: 'You are an expert business consultant, startup advisor, and technical architect. Provide detailed, actionable advice that helps users make informed decisions about their business ideas. Use all available context to give comprehensive answers.',
      },
      {
        role: 'user' as const,
        content: contextPrompt,
      },
    ];

    const completion = await generateCompletion(messages, {
      temperature: 0.7,
      max_tokens: 1500,
    });

    return NextResponse.json({ 
      answer: completion,
      suggestions: [
        'Ask about market strategy',
        'Discuss technical challenges',
        'Explore funding options',
        'Review competitive positioning'
      ]
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}