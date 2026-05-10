# FactCheck - Complete Setup & Deployment Guide

## Quick Start

The FactCheck application is a full-stack fact-checking system that uses AI to extract claims from PDFs and verify them against real-time web sources.

### What You'll Need

1. **OpenAI API Key** - For GPT-4 claim extraction and verification
   - Sign up at [platform.openai.com](https://platform.openai.com)
   - Create an API key in your account dashboard
   - Ensure you have credits available (API calls consume credits)

2. **Exa API Key** - For real-time web search
   - Sign up at [exa.ai](https://exa.ai)
   - Get your API key from the dashboard
   - Free tier available for testing

### Local Development

1. **Install dependencies**
```bash
pnpm install
```

2. **Create `.env.local` file** in the project root:
```bash
cp .env.example .env.local
```

3. **Add your API keys** to `.env.local`:
```env
OPENAI_API_KEY=sk_your_key_here
EXA_API_KEY=your_exa_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start the development server**:
```bash
pnpm dev
```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Project Structure

### Key Files

- **`app/page.tsx`** - Landing/upload page with hero section
- **`app/results/page.tsx`** - Results dashboard showing verification results
- **`app/about/page.tsx`** - About and feature explanation page
- **`app/api/upload/route.ts`** - Backend API for PDF processing
- **`components/upload-ui.tsx`** - Reusable upload and result components
- **`lib/pdf-parser.ts`** - Extracts text from PDF files
- **`lib/claim-extractor.ts`** - Uses GPT-4 to extract claims
- **`lib/claim-verifier.ts`** - Verifies claims with web search + AI

### Styling

- **Color scheme**: Professional blue/indigo theme with trust-building design
- **Framework**: Tailwind CSS + shadcn/ui components
- **Responsive**: Mobile-first design, works on all screen sizes

## How It Works

1. **User uploads PDF** → File validation and extraction
2. **AI extracts claims** → GPT-4 analyzes text and finds verifiable statements
3. **Web search verification** → Exa API searches for evidence
4. **AI verification** → GPT-4 analyzes evidence and determines accuracy
5. **Results display** → Dashboard shows verification status and confidence

### Verification Statuses

- **VERIFIED** - Claim confirmed by reliable sources
- **INACCURATE** - Claim partially correct or missing context
- **FALSE** - Claim contradicted by sources
- **UNVERIFIABLE** - No sufficient information to verify
- **PENDING** - Still processing

## API Endpoints

### POST /api/upload

Processes a PDF and returns verification results.

**Request:**
```
Content-Type: multipart/form-data
file: [PDF file]
```

**Response:**
```json
{
  "success": true,
  "claims": [
    {
      "id": "claim_1",
      "text": "The Earth is round",
      "context": "...",
      "confidence": 0.95
    }
  ],
  "verifications": [
    {
      "claimId": "claim_1",
      "status": "VERIFIED",
      "confidence": 0.98,
      "summary": "Confirmed by NASA...",
      "evidence": ["NASA evidence...", "...]
    }
  ],
  "documentInfo": {
    "pageCount": 5,
    "claimCount": 3
  }
}
```

## Deployment to Vercel

### Option 1: Using Git

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `EXA_API_KEY`
4. Deploy

### Option 2: Direct CLI

```bash
npm install -g vercel
vercel
# Follow prompts and add environment variables when asked
```

### Environment Setup on Vercel

Go to Vercel Dashboard → Project Settings → Environment Variables and add:

```
OPENAI_API_KEY=sk_your_key_here
EXA_API_KEY=your_exa_key_here
```

## Costs & Limits

### OpenAI API
- **Model**: GPT-4 Turbo (~$0.01-0.03 per request)
- **Usage**: ~2-3 API calls per document (extraction + verification per claim)
- **Limit**: 60 second timeout per request

### Exa API
- **Free tier**: Limited searches per month
- **Paid**: Usage-based pricing
- **Per request**: ~1 search per claim verification

## Troubleshooting

### "API key not found"
- Verify `.env.local` file exists
- Check API key format (OpenAI starts with `sk_`)
- Restart dev server after editing `.env.local`

### "Failed to extract PDF"
- PDF must be text-based, not scanned images
- Try with a smaller PDF first
- Check file size isn't corrupted

### "Web search failed"
- Verify Exa API key is valid
- Check internet connection
- Ensure API key has search quota remaining

### Timeout errors
- Large PDFs (100+ pages) may take longer
- API has 60-second limit
- Consider splitting large documents

## Customization

### Change Colors

Edit `app/globals.css` and update the CSS variables:

```css
:root {
  --primary: oklch(0.45 0.218 258);    /* Change to your color */
  --accent: oklch(0.55 0.185 150);
  /* ... */
}
```

### Change API Models

Edit `lib/claim-extractor.ts` and `lib/claim-verifier.ts`:

```typescript
const message = await client.messages.create({
  model: 'gpt-4-turbo',  // Change model here
  // ...
});
```

### Add Features

Common additions:
- Export to PDF
- Batch file upload
- User authentication
- Save results to database
- Email notifications

## Performance Tips

1. **Optimize PDFs** - Remove images/unnecessary content
2. **Use concurrency** - Process multiple claims in parallel
3. **Cache results** - Store verification results
4. **Rate limit** - Implement API call throttling

## Security Notes

- API keys are stored in `.env.local` (local dev) or Vercel secrets (production)
- Never commit `.env.local` to git
- Use HTTPS in production
- Validate all file uploads
- Implement rate limiting for production

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **OpenAI API**: https://platform.openai.com/docs
- **Exa API**: https://api.exa.ai/docs

## License

MIT - Feel free to use this project for personal or commercial use.

---

Built with ❤️ using Next.js 15, React 19, OpenAI, and Exa API
