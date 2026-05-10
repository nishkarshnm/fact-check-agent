import { PDFParse } from 'pdf-parse';

export interface ExtractionResult {
  text: string;
  pageCount: number;
}

export async function extractTextFromPDF(
  buffer: Buffer
): Promise<ExtractionResult> {
  try {
    const pdf = new PDFParse();
    const data = await pdf.parse(buffer);
    return {
      text: data.text,
      pageCount: data.numpages,
    };
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error}`);
  }
}
