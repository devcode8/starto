                               import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/openai';
import { VALIDATION_PROMPT } from '@/lib/prompts';
import { extractJsonData } from '@/lib/json-parser';

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json();

    if (!idea) {
      return NextResponse.json({ error: 'Business idea is required' }, { status: 400 });
    }

    const messages = [
      {
        role: 'system' as const,
        content: 'You are an expert business analyst and market researcher. Always respond with valid JSON only.',
      },
      {
        role: 'user' as const,
        content: VALIDATION_PROMPT + idea,
      },
    ];

    const completion = await generateCompletion(messages, {
      temperature: 0.7,
      max_tokens: 2048,
    });

    const validationResult = extractJsonData(completion);

    return NextResponse.json({ validation: validationResult });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}