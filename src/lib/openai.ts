import { OpenAI } from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.aimlapi.com/v1',
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
  } = {}
) {
  const {
    temperature = 0.7,
    max_tokens = 2048,
    top_p = 0.7,
    frequency_penalty = 1,
  } = options;

  try {
    const result = await openai.chat.completions.create({
      model: 'openai/gpt-5-chat-latest',
      messages,
      temperature,
      top_p,
      frequency_penalty,
      max_tokens,
    });

    return result.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI response');
  }
}

export { openai };