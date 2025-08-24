import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/openai';
import { getTechStackPrompt } from '@/lib/prompts';
import { extractJsonData } from '@/lib/json-parser';

export async function POST(request: NextRequest) {
  try {
    const { idea, platform, validationData, pitchData } = await request.json();

    if (!idea || !platform) {
      return NextResponse.json({ error: 'Business idea and platform are required' }, { status: 400 });
    }

    // Enhanced prompt with previous context
    let enhancedPrompt = getTechStackPrompt(platform, idea);
    
    if (validationData) {
      enhancedPrompt += `\n\nValidation Insights:\n${JSON.stringify(validationData, null, 2)}`;
    }
    
    if (pitchData) {
      enhancedPrompt += `\n\nPitch Deck Data:\n${JSON.stringify(pitchData, null, 2)}`;
    }
    
    if (validationData || pitchData) {
      enhancedPrompt += `\n\nPlease use the above context to create personalized technology stack recommendations that align with the identified market needs, competitive advantages, budget considerations, and business model requirements.`;
    }

    const messages = [
      {
        role: 'system' as const,
        content: 'You are a senior technology consultant and software architect. Use any provided validation data and pitch information to create personalized technology stack recommendations that align with business goals, budget, and technical requirements. Always respond with valid JSON only.',
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

    const techStackResult = extractJsonData(completion);

    return NextResponse.json({ techStack: techStackResult, prototype: techStackResult });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}