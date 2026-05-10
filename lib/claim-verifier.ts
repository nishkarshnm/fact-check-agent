import { OpenAI } from 'openai';

export type VerificationStatus = 'VERIFIED' | 'INACCURATE' | 'FALSE' | 'UNVERIFIABLE' | 'PENDING';

export interface VerificationResult {
  claimId: string;
  status: VerificationStatus;
  confidence: number;
  evidence: string[];
  summary: string;
}

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function verifyClaimWithAI(
  claim: string,
  context: string
): Promise<VerificationResult> {
  try {
    const client = getOpenAIClient();

    const message = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 1500,
      messages: [
        {
          role: 'system',
          content: `You are an expert fact-checking AI. Your job is to evaluate claims and determine their accuracy based on your knowledge.
          
For each claim, you should:
1. Assess its factual accuracy
2. Provide a confidence score (0-1)
3. Give key evidence or reasoning
4. Provide a clear summary

Return responses ONLY as valid JSON with no additional text.`,
        },
        {
          role: 'user',
          content: `Please verify this claim and return a JSON response.

CLAIM: "${claim}"

CONTEXT/SOURCE: "${context}"

Respond with this JSON structure (no markdown, just raw JSON):
{
  "status": "VERIFIED" | "INACCURATE" | "FALSE" | "UNVERIFIABLE",
  "confidence": 0.0-1.0,
  "summary": "2-3 sentence explanation of the verification result",
  "evidence": ["key point 1", "key point 2", "key point 3"]
}`,
        },
      ],
    });

    const responseText = message.choices[0]?.message?.content || '';
    console.log('[v0] OpenAI Response:', responseText);

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonStr = responseText;
    if (responseText.includes('```json')) {
      jsonStr = responseText.split('```json')[1].split('```')[0];
    } else if (responseText.includes('```')) {
      jsonStr = responseText.split('```')[1].split('```')[0];
    }

    const result = JSON.parse(jsonStr.trim());

    return {
      claimId: '',
      status: result.status || 'UNVERIFIABLE',
      confidence: Math.min(1, Math.max(0, result.confidence || 0.5)),
      evidence: Array.isArray(result.evidence) ? result.evidence : ['Unable to extract evidence'],
      summary: result.summary || 'Verification completed',
    };
  } catch (error) {
    console.error('[v0] Verification Error:', error);
    throw new Error(`Failed to verify claim: ${error}`);
  }
}
