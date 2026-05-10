import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/pdf-parser';
import { extractClaimsFromText } from '@/lib/claim-extractor';
import { verifyClaimWithAI } from '@/lib/claim-verifier';

export const maxDuration = 60;

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
    const extraction = await extractTextFromPDF(buffer);

    // Extract claims from text
    const claims = await extractClaimsFromText(extraction.text);

    // Verify each claim
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
}
