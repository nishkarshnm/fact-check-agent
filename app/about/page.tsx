'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Brain, Globe, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

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
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">About FactCheck</h1>
          <p className="text-xl text-muted-foreground">
            An AI-powered fact-checking platform that helps you verify claims
            in documents with real-time web search and advanced analysis.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border border-border space-y-4">
            <Brain className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-bold text-foreground mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Uses OpenAI's GPT-4 to intelligently extract factual claims from
                any document.
              </p>
            </div>
          </Card>

          <Card className="p-6 border border-border space-y-4">
            <Globe className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-bold text-foreground mb-2">Real-Time Web Search</h3>
              <p className="text-sm text-muted-foreground">
                Verifies claims against current information using Exa API for
                comprehensive web search.
              </p>
            </div>
          </Card>

          <Card className="p-6 border border-border space-y-4">
            <Zap className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-bold text-foreground mb-2">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Get comprehensive fact-checking reports with verification
                status and evidence in seconds.
              </p>
            </div>
          </Card>
        </div>

        {/* How It Works */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
          <div className="space-y-4">
            {[
              {
                num: '1',
                title: 'Upload Your Document',
                description:
                  'Start by uploading a PDF document containing claims you want to verify. Our system supports documents of any length.',
              },
              {
                num: '2',
                title: 'AI Claim Extraction',
                description:
                  'OpenAI GPT-4 analyzes the document text and automatically extracts verifiable factual claims with context.',
              },
              {
                num: '3',
                title: 'Real-Time Verification',
                description:
                  'Each claim is verified using real-time web search (Exa API) and advanced AI analysis to determine accuracy.',
              },
              {
                num: '4',
                title: 'Comprehensive Report',
                description:
                  'View detailed results for each claim including verification status, confidence level, and supporting evidence.',
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="space-y-6 bg-card border border-border rounded-lg p-8">
          <h2 className="text-3xl font-bold text-foreground">Technology</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-foreground mb-3">APIs & Services</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>OpenAI GPT-4 Turbo</strong> - Claim extraction & verification</li>
                <li>• <strong>Exa API</strong> - Real-time web search</li>
                <li>• <strong>PDF.js</strong> - PDF text extraction</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-3">Frontend Stack</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Next.js 15</strong> - React framework</li>
                <li>• <strong>Tailwind CSS</strong> - Styling</li>
                <li>• <strong>TypeScript</strong> - Type safety</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Verification Status Levels */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Verification Status Levels</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                status: 'VERIFIED',
                color: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
                description: 'Claim is supported by reliable sources',
              },
              {
                status: 'INACCURATE',
                color: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
                description: 'Claim is partially accurate or missing context',
              },
              {
                status: 'FALSE',
                color: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
                description: 'Claim is contradicted by reliable sources',
              },
              {
                status: 'UNVERIFIABLE',
                color: 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800',
                description: 'Insufficient information to verify the claim',
              },
            ].map((item) => (
              <Card
                key={item.status}
                className={`border p-4 ${item.color}`}
              >
                <h3 className="font-bold mb-1 text-foreground">{item.status}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-3xl font-bold text-foreground">Ready to verify?</h2>
          <Link href="/">
            <Button size="lg" className="text-lg">
              Start Fact-Checking
            </Button>
          </Link>
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
