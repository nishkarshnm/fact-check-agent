# FactCheck - Quick Reference Guide

## What is FactCheck?

FactCheck is a full-stack, AI-powered fact-checking application that:
1. Accepts PDF uploads from users
2. Extracts verifiable claims using OpenAI's GPT-4
3. Verifies each claim against real-time web information using Exa API
4. Displays comprehensive verification results with confidence scores

## Key Features

✅ **Drag-and-drop PDF upload** - Simple, intuitive interface  
✅ **AI-powered claim extraction** - Automatically identifies verifiable statements  
✅ **Real-time web verification** - Searches current information for evidence  
✅ **Confidence scoring** - Shows how confident the verification is  
✅ **Color-coded results** - Green (verified), Yellow (inaccurate), Red (false), Gray (unverifiable)  
✅ **Export functionality** - Save results as JSON for further analysis  
✅ **Responsive design** - Works on desktop, tablet, and mobile  

## Getting Started (5 minutes)

### 1. Get API Keys (Free tier available)

**OpenAI:**
- Go to https://platform.openai.com
- Sign up for free
- Create API key in dashboard
- Add credits to your account

**Exa API:**
- Go to https://exa.ai
- Sign up for free
- Get API key from dashboard

### 2. Configure Environment

```bash
# Create env file
cp .env.example .env.local

# Edit .env.local and add your keys
OPENAI_API_KEY=sk_your_key_here
EXA_API_KEY=your_exa_key_here
```

### 3. Install & Run

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000

## Architecture

```
┌─────────────────────────────────────────┐
│     User Interface (React + Next.js)    │
│  - Landing page with upload             │
│  - Results dashboard                    │
│  - About/feature page                   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      Backend API Routes                 │
│  - POST /api/upload                     │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌────────┐  ┌─────────┐  ┌──────────┐
│ Extract│  │ Extract │  │ Verify  │
│PDF Text│  │ Claims  │  │ Claims  │
├────────┤  ├─────────┤  ├──────────┤
│pdf-    │  │ OpenAI  │  │ OpenAI  │
│parse   │  │ GPT-4   │  │ GPT-4 + │
│        │  │         │  │ Exa API │
└────────┘  └─────────┘  └──────────┘
```

## File Structure

```
├── app/
│   ├── page.tsx              ← Home/upload page
│   ├── results/page.tsx      ← Results dashboard
│   ├── about/page.tsx        ← About page
│   ├── api/upload/route.ts   ← Main processing API
│   ├── layout.tsx            ← Root layout
│   └── globals.css           ← Styling
├── components/
│   └── upload-ui.tsx         ← Upload and result components
├── lib/
│   ├── pdf-parser.ts         ← PDF text extraction
│   ├── claim-extractor.ts    ← AI claim extraction
│   └── claim-verifier.ts     ← Web search + AI verification
├── public/                   ← Static assets
├── .env.example              ← Environment template
├── README.md                 ← Full documentation
└── SETUP.md                  ← Detailed setup guide
```

## Common Tasks

### Upload a PDF
1. Click upload area or drag-drop a PDF
2. Wait for processing (shows "Processing PDF...")
3. Results appear automatically on results page

### View Results
- See verification status for each claim
- Check confidence percentage
- Read summary of findings
- Review supporting evidence

### Export Results
- Click "Export as JSON" button
- Download JSON file with all verification data
- Use for further analysis or integration

### Deploy to Vercel
```bash
# Push to GitHub
git push origin main

# In Vercel dashboard:
# 1. Connect GitHub repo
# 2. Add environment variables
# 3. Deploy
```

## Verification Status Meanings

| Status | Meaning | Example |
|--------|---------|---------|
| ✅ VERIFIED | Confirmed by reliable sources | "Earth orbits the sun" |
| ⚠️ INACCURATE | Partially correct or lacks context | "COVID vaccine side effects are rare" |
| ❌ FALSE | Contradicted by reliable sources | "The Moon is made of cheese" |
| ❓ UNVERIFIABLE | No sufficient info to verify | "Product X is better than Y" |

## Cost Estimates

**Per document (typical 5-page PDF, 3 claims):**
- OpenAI API: ~$0.05-0.15
- Exa API: Free (with reasonable limits)
- **Total: ~$0.05-0.15 per document**

**Monthly estimate (1000 documents):**
- ~$50-150/month with OpenAI
- Highly variable based on document complexity

## Troubleshooting

### "API key not found"
→ Check `.env.local` exists with correct keys
→ Restart dev server after editing env file

### "Failed to extract PDF"
→ PDF must be text-based (not scanned images)
→ Try with a smaller PDF first
→ Check file isn't corrupted

### "Web search failed"
→ Check Exa API key is valid
→ Verify internet connection
→ Check API rate limits

### Timeout errors
→ Large PDFs may exceed 60-second limit
→ Split large documents into smaller files
→ Check API service status

## Performance Tips

1. **Optimize PDFs** - Remove unnecessary images/content
2. **Use modern browser** - Chrome/Firefox/Safari for best experience
3. **Check connection** - Stable internet required for web search
4. **Monitor API usage** - Watch OpenAI/Exa dashboard for quotas

## Advanced Configuration

### Change Model
Edit `lib/claim-extractor.ts` and `lib/claim-verifier.ts`:
```typescript
const message = await client.messages.create({
  model: 'gpt-4-turbo',  // Change here
  ...
});
```

### Customize Colors
Edit `app/globals.css`:
```css
:root {
  --primary: oklch(0.45 0.218 258);    /* Change color */
  ...
}
```

### Add Custom Fields
Edit `components/upload-ui.tsx` to add new result fields

## API Reference

### POST /api/upload

**Request:**
```
Content-Type: multipart/form-data
file: [PDF file]
```

**Response (200):**
```json
{
  "success": true,
  "claims": [...],
  "verifications": [...],
  "documentInfo": {
    "pageCount": 5,
    "claimCount": 3
  }
}
```

**Error Response (400/500):**
```json
{
  "error": "Description of what went wrong"
}
```

## Browser Support

✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
⚠️ Mobile browsers (limited by PDF support)

## Security Notes

- API keys are sensitive - never commit to Git
- Use `.env.local` for local development
- Use Vercel secrets for production
- Implement rate limiting in production
- Validate all file uploads
- Consider adding authentication for production

## Support & Resources

- **Documentation**: See README.md and SETUP.md
- **OpenAI Docs**: https://platform.openai.com/docs
- **Exa API**: https://api.exa.ai/docs
- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com/docs

## What's Next?

Ideas for extending FactCheck:

1. **Authentication** - Add user accounts and saved searches
2. **Database** - Store verification history
3. **Batch Processing** - Process multiple PDFs at once
4. **Webhooks** - Notify users when processing completes
5. **API** - Create public API for integrations
6. **Mobile App** - React Native or Flutter version
7. **Advanced Analytics** - Track verification patterns
8. **Custom Models** - Fine-tune models for specific domains

---

**Questions?** Check README.md or SETUP.md for more details.

**Ready to deploy?** Run `vercel` to push to production!
