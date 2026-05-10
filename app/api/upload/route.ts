import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/pdf-parser';
import { extractClaimsFromText } from '@/lib/claim-extractor';
import { verifyClaimWithAI } from '@/lib/claim-verifier';

export const maxDuration = 60;

// Demo mode - returns mock data when API keys are not configured
const DEMO_MODE = !process.env.OPENAI_API_KEY || !process.env.EXA_API_KEY;

const DEMO_RESULTS = [
  {
    claimId: 'claim-1',
    status: 'VERIFIED',
    confidence: 0.95,
    evidence: [
      'Multiple scientific studies confirm this finding',
      'Data from WHO supports this claim'
    ],
    summary: 'This claim has been verified by multiple reliable sources'
  },
  {
    claimId: 'claim-2',
    status: 'INACCURATE',
    confidence: 0.85,
    evidence: [
      'Recent data shows different statistics',
      'Official sources contradict this claim'
    ],
    summary: 'This claim appears to be partially inaccurate based on current data'
  },
  {
    claimId: 'claim-3',
    status: 'FALSE',
    confidence: 0.92,
    evidence: [
      'Fact-checkers have debunked this',
      'No credible sources support this claim'
    ],
    summary: 'This claim has been identified as false'
  }
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    let extraction;
    
    try {
      extraction = await extractTextFromPDF(buffer);
    } catch (error) {
      console.error('[v0] PDF extraction error:', error);
      return NextResponse.json(
        { error: 'Failed to extract text from PDF' },
        { status: 400 }
      );
    }

    if (DEMO_MODE) {
      // Return demo results without API calls
      console.log('[v0] Running in DEMO MODE - no API keys configured');
      return NextResponse.json({
        fileName: file.name,
        pageCount: 5,
        textLength: extraction.text.length,
        claims: [
          {
            id: 'claim-1',
            text: 'Climate change is caused by human activities',
            context: 'Found in introduction section',
            confidence: 0.9
          },
          {
            id: 'claim-2',
            text: 'Global temperatures have risen 1.5 degrees',
            context: 'Found in data section',
            confidence: 0.85
          },
          {
            id: 'claim-3',
            text: 'Renewable energy can replace fossil fuels',
            context: 'Found in conclusion section',
            confidence: 0.8
          }
        ],
        verifications: DEMO_RESULTS,
        demoMode: true,
        message: 'Demo results shown. Add OPENAI_API_KEY and EXA_API_KEY to .env.local for real verification'
      });
    }

    // Real mode - requires API keys
    try {
      const claims = await extractClaimsFromText(extraction.text);

      const verificationPromises = claims.map((claim) =>
        verifyClaimWithAI(claim.text, claim.context)
          .then((result) => ({
            ...result,
            claimId: claim.id,
          }))
          .catch(() => ({
            claimId: claim.id,
            status: 'UNVERIFIABLE' as const,
            confidence: 0,
            evidence: [],
            summary: 'Verification failed',
          }))
      );

      const verifications = await Promise.all(verificationPromises);

      return NextResponse.json({
        success: true,
        claims,
        verifications,
        documentInfo: {
          pageCount: extraction.pageCount,
          claimCount: claims.length,
        },
      });
    } catch (error) {
      console.error('[v0] API Error:', error);
      return NextResponse.json(
        { error: `Processing failed: ${error}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[v0] Upload Error:', error);
    return NextResponse.json(
      { error: 'Upload processing failed' },
      { status: 500 }
    );
  }
}
