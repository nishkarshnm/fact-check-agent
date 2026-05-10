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
    const message = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: `You are an expert at identifying factual claims in text. Extract the main verifiable claims (facts, statistics, assertions) from the provided text. 
          
Focus on claims that are:
- Factually verifiable
- Specific and concrete
- Important to the document
- Not just opinions

Return ONLY a JSON array with no markdown code blocks or additional text.`,
        },
        {
          role: 'user',
          content: `Extract the main factual claims from this text:

${text}

Return a JSON array like this (no markdown, no code blocks, just raw JSON):
[
  {"id": "claim-1", "text": "the claim", "context": "surrounding context", "confidence": 0.9},
  {"id": "claim-2", "text": "another claim", "context": "context", "confidence": 0.85}
]`,
        },
      ],
    });

    const responseText = message.choices[0]?.message?.content || '';
    console.log('[v0] Claims extracted:', responseText.substring(0, 200));

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonStr = responseText;
    if (responseText.includes('```json')) {
      jsonStr = responseText.split('```json')[1].split('```')[0];
    } else if (responseText.includes('```')) {
      jsonStr = responseText.split('```')[1].split('```')[0];
    }

    const claims = JSON.parse(jsonStr.trim());
    return Array.isArray(claims) ? claims.slice(0, 10) : [];
  } catch (error) {
    console.error('[v0] Failed to extract claims:', error);
    throw new Error(`Failed to extract claims: ${error}`);
  }
}
