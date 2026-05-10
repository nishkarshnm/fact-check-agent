import { OpenAI } from 'openai';

export interface Claim {
  id: string;
  text: string;
  context: string;
  confidence: number;
}

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function extractClaimsFromText(text: string): Promise<Claim[]> {
  try {
    const client = getOpenAIClient();
    const message = await client.messages.create({
      model: 'gpt-4-turbo-preview',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Extract the main factual claims from the following text. Return a JSON array with objects containing: id (unique identifier), text (the claim), context (surrounding context), and confidence (0-1 how confident this is a verifiable claim).

Text:
${text}

Return ONLY valid JSON array, no other text.`,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    try {
      const claims = JSON.parse(responseText);
      return Array.isArray(claims) ? claims : [];
    } catch {
      console.error('[v0] Failed to parse claims JSON:', responseText);
      return [];
    }
  } catch (error) {
    throw new Error(`Failed to extract claims: ${error}`);
  }
}
