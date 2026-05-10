# FactCheck - AI-Powered Fact Verification Platform

A full-stack web application that uses AI and real-time web search to verify claims extracted from PDF documents.

## Features

- 📄 **PDF Upload** - Drag-and-drop PDF uploads with visual feedback
- 🧠 **AI Claim Extraction** - Uses OpenAI GPT-4 to intelligently extract verifiable claims
- 🌐 **Real-Time Web Search** - Verifies claims against current web information using Exa API
- ✅ **Comprehensive Results** - Displays verification status, confidence levels, and evidence
- 📊 **Results Dashboard** - View statistics and detailed analysis for each claim
- 💾 **Export** - Download results as JSON for further analysis

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Lucide Icons** - Beautiful SVG icons

### Backend
- **Next.js API Routes** - Serverless backend
- **OpenAI API** - GPT-4 for claim extraction and verification
- **Exa API** - Real-time web search
- **PDF Parse** - PDF text extraction

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/pnpm
- OpenAI API key ([get one](https://platform.openai.com/api-keys))
- Exa API key ([get one](https://exa.ai))

### Installation

1. **Clone or download the project**

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**

Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```env
# OpenAI API Configuration
OPENAI_API_KEY=sk_your_openai_key_here

# Exa Search API Configuration
EXA_API_KEY=your_exa_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start the development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload a PDF** - Click or drag a PDF document onto the upload area
2. **Wait for processing** - The app will:
   - Extract text from the PDF
   - Identify verifiable claims using AI
   - Search the web for evidence
   - Verify each claim's accuracy
3. **Review results** - See detailed verification status for each claim
4. **Export data** - Download results as JSON

## API Endpoints

### POST /api/upload
Processes a PDF document and returns verification results.

**Request:**
```
Content-Type: multipart/form-data
Body: form data with 'file' field containing PDF
```

**Response:**
```json
{
  "success": true,
  "claims": [
    {
      "id": "claim_1",
      "text": "Earth is round",
      "context": "Scientific consensus shows...",
      "confidence": 0.95
    }
  ],
  "verifications": [
    {
      "claimId": "claim_1",
      "status": "VERIFIED",
      "confidence": 0.98,
      "summary": "Confirmed by NASA and modern science",
      "evidence": ["Scientific evidence...", "Expert sources..."]
    }
  ],
  "documentInfo": {
    "pageCount": 5,
    "claimCount": 3
  }
}
```

## Verification Status Levels

- **VERIFIED** - Claim is supported by reliable sources
- **INACCURATE** - Claim is partially accurate or lacks context
- **FALSE** - Claim is contradicted by reliable sources
- **UNVERIFIABLE** - Insufficient information to verify
- **PENDING** - Still processing the claim

## Project Structure

```
project/
├── app/
│   ├── api/
│   │   └── upload/route.ts       # PDF processing endpoint
│   ├── page.tsx                   # Home page
│   ├── results/page.tsx           # Results dashboard
│   ├── about/page.tsx             # About page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   └── upload-ui.tsx              # Upload and result components
├── lib/
│   ├── pdf-parser.ts              # PDF text extraction
│   ├── claim-extractor.ts         # AI claim extraction
│   └── claim-verifier.ts          # Claim verification logic
├── public/                        # Static assets
└── .env.example                   # Environment variables template
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | Yes |
| `EXA_API_KEY` | Exa API key for web search | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |

## Limitations

- PDF files must be text-based (not scanned images)
- Large documents (100+ pages) may take longer to process
- Requires internet connection for web search verification
- API costs apply for OpenAI and Exa usage

## Troubleshooting

### "API key not set" error
- Verify `.env.local` exists with correct API keys
- Restart the development server after changing environment variables

### "Failed to extract text from PDF"
- Ensure PDF is text-based, not image/scanned
- Try with a smaller PDF file first

### "Web search failed"
- Check Exa API key is valid
- Verify internet connection

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## License

MIT

## Support

For issues or questions, please create an issue or contact support.

---

Built with ❤️ using Next.js, OpenAI, and Exa API
