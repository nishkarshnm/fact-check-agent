'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/upload-ui';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      // Store results in session storage for the results page
      sessionStorage.setItem('verificationResults', JSON.stringify(data));
      router.push('/results');
    } catch (error) {
      console.error('[v0] Upload error:', error);
      alert(
        error instanceof Error ? error.message : 'Failed to process PDF'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              FC
            </div>
            <span className="font-bold text-foreground">FactCheck</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 space-y-12">
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance text-foreground">
              Verify Claims with AI
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl">
              Upload any PDF document and let our AI-powered system extract
              claims and verify them against real-time web sources. Get
              comprehensive fact-checking reports instantly.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 pt-4">
            {[
              'AI-Powered',
              'Real-Time Verification',
              'Web Search',
              'Instant Results',
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-full"
              >
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div className="space-y-6">
          <FileUpload onUpload={handleUpload} isLoading={isLoading} />

          {/* Instructions */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                step: '1',
                title: 'Upload PDF',
                description: 'Select or drag a PDF document containing claims you want to verify',
              },
              {
                step: '2',
                title: 'AI Extraction',
                description: 'Our AI extracts factual claims from the document text',
              },
              {
                step: '3',
                title: 'Verification',
                description: 'Real-time web search and analysis to verify each claim',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-card border border-border rounded-lg p-6 space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-border">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              How It Works
            </h2>
            <ul className="space-y-3">
              {[
                'Extract claims automatically using GPT-4',
                'Search the web for evidence and context',
                'Verify accuracy with real-time information',
                'Generate comprehensive reports',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Use Cases
            </h2>
            <ul className="space-y-3">
              {[
                'Fact-check research papers and reports',
                'Verify claims in news articles',
                'Validate product documentation',
                'Check academic and scientific claims',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            FactCheck © 2024. Powered by OpenAI and Exa API.
          </p>
        </div>
      </footer>
    </main>
  );
}
