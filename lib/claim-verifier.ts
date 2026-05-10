import { OpenAI } from 'openai';
import axios from 'axios';

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

async function searchWeb(query: string): Promise<string[]> {
  try {
    // Using Exa API for web search
    const response = await axios.post(
      'https://api.exa.ai/search',
      {
        query,
        numResults: 5,
        useAutoprompt: true,
      },
      {
        headers: {
          'x-api-key': process.env.EXA_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.results
      .map((r: any) => `${r.title}: ${r.text}`)
      .slice(0, 3);
  } catch (error) {
    console.warn('[v0] Web search failed:', error);
    return [];
  }
}

export async function verifyClaimWithAI(
  claim: string,
  context: string
): Promise<VerificationResult> {
  try {
    const client = getOpenAIClient();
    // Search the web for evidence
    const searchResults = await searchWeb(claim);
    const evidenceText = searchResults.join('\n\n');

    const message = await client.messages.create({
      model: 'gpt-4-turbo-preview',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `You are a fact-checking AI. Verify the following claim based on the search results provided.

CLAIM: "${claim}"

CONTEXT: "${context}"

SEARCH RESULTS:
${evidenceText || 'No search results found'}

Respond with a JSON object containing:
{
  "status": "VERIFIED" | "INACCURATE" | "FALSE" | "UNVERIFIABLE",
  "confidence": 0-1,
  "summary": "2-3 sentence explanation",
  "evidence": ["key evidence points"]
}

Return ONLY valid JSON, no other text.`,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    try {
      const result = JSON.parse(responseText);
      return {
        claimId: '',
        status: result.status || 'UNVERIFIABLE',
        confidence: result.confidence || 0.5,
        evidence: result.evidence || searchResults,
        summary: result.summary || 'Unable to verify claim',
      };
    } catch {
      console.error('[v0] Failed to parse verification JSON:', responseText);
      return {
        claimId: '',
        status: 'UNVERIFIABLE',
        confidence: 0,
        evidence: searchResults,
        summary: 'Failed to process verification',
      };
    }
  } catch (error) {
    throw new Error(`Failed to verify claim: ${error}`);
  }
}
