import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/openai';
import { PITCH_PROMPT } from '@/lib/prompts';
import { extractJsonData } from '@/lib/json-parser';

export async function POST(request: NextRequest) {
  try {
    const { idea, context, validationData, conversationHistory } = await request.json();

    if (!idea) {
      return NextResponse.json({ error: 'Business idea is required' }, { status: 400 });
    }

    // Enhanced prompt with validation context
    let enhancedPrompt = PITCH_PROMPT + idea;
    
    // Use validation data from context if available
    const validation = validationData || context?.validationData;
    
    if (validation) {
      enhancedPrompt += `\n\nPrevious Validation Results:\n`;
      enhancedPrompt += `Market Size - TAM: ${validation.marketSize?.tam || 'Not specified'}\n`;
      enhancedPrompt += `Market Size - SAM: ${validation.marketSize?.sam || 'Not specified'}\n`;
      enhancedPrompt += `Market Size - SOM: ${validation.marketSize?.som || 'Not specified'}\n`;
      enhancedPrompt += `Validation Score: ${validation.validationScore?.score || 'Not specified'}/10\n`;
      enhancedPrompt += `Key Differentiator: ${validation.differentiator || 'Not specified'}\n`;
      
      if (validation.competitors) {
        enhancedPrompt += `Main Competitors: ${validation.competitors.map((c: any) => c.name).join(', ')}\n`;
      }
      
      enhancedPrompt += `\n\nIMPORTANT: Use this validation data to create a compelling, data-driven pitch deck that addresses the identified market opportunity and competitive landscape.`;
    }
    
    // Also include recent conversation context
    if (conversationHistory && conversationHistory.length > 0) {
      const recentContext = conversationHistory.slice(-3).map((msg: any) => 
        `${msg.type}: ${msg.content.substring(0, 200)}...`
      ).join('\n');
      enhancedPrompt += `\n\nRecent Conversation Context:\n${recentContext}`;
    }

    const messages = [
      {
        role: 'system' as const,
        content: 'You are an expert pitch deck creator who has helped numerous startups raise funding. Use any provided validation data to create more targeted and compelling pitch decks. Always respond with valid JSON only.',
      },
      {
        role: 'user' as const,
        content: enhancedPrompt,
      },
    ];

    const completion = await generateCompletion(messages, {
      temperature: 0.7,
      max_tokens: 2048,
    });

    const pitchResult = extractJsonData(completion);
    
    console.log('Raw completion:', completion);
    console.log('Extracted pitch result:', JSON.stringify(pitchResult, null, 2));

    // Check if slides are missing and return error
    if (!pitchResult.slides || !Array.isArray(pitchResult.slides) || pitchResult.slides.length === 0) {
      console.log('No slides found, returning technical error');
      return NextResponse.json({ 
        error: 'Technical error occurred while generating pitch deck. Please try again.' 
      }, { status: 500 });
    }


    // Ensure investor email exists
    if (!pitchResult.investorEmail) {
      pitchResult.investorEmail = {
        subject: "Investment Opportunity - Seeking Strategic Partnership",
        body: "Dear Investor,\n\nI hope this message finds you well. I'm reaching out to introduce an exciting investment opportunity that aligns with your portfolio focus.\n\nOur startup addresses a significant market gap with an innovative solution that has strong validation and growth potential. We're seeking strategic partners who can provide not just funding, but valuable expertise and network access.\n\nI would welcome the opportunity to present our pitch deck and discuss how this investment could deliver strong returns while creating meaningful impact.\n\nBest regards,\n[Your Name]"
      };
    }

    return NextResponse.json({ pitch: pitchResult });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}