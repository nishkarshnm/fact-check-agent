'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { VerificationCard } from '@/components/upload-ui';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { StatsDisplay } from '@/components/stats-display';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ResultsData {
  claims: any[];
  verifications: any[];
  documentInfo: {
    pageCount: number;
    claimCount: number;
  };
}

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultsData | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('verificationResults');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (error) {
        console.error('[v0] Failed to parse results:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const exportToJSON = () => {
    if (!data) return;
    setIsExporting(true);
    try {
      const element = document.createElement('a');
      element.href = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      element.download = `fact-check-results-${Date.now()}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } finally {
      setIsExporting(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const verifiedCount = data.verifications.filter(
    (v) => v.status === 'VERIFIED'
  ).length;
  const inaccurateCount = data.verifications.filter(
    (v) => v.status === 'INACCURATE'
  ).length;
  const falseCount = data.verifications.filter(
    (v) => v.status === 'FALSE'
  ).length;
  const unverifiableCount = data.verifications.filter(
    (v) => v.status === 'UNVERIFIABLE'
  ).length;

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
            Back to Upload
          </Button>
          <ThemeToggle />
        </div>
      </nav>

      {/* Results Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Fact-Check Results
            </h1>
            <p className="text-muted-foreground">
              Document analysis complete. Review the verification results below.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="p-4 bg-card border border-border">
              <div className="text-sm text-muted-foreground">Pages</div>
              <div className="text-2xl font-bold text-foreground">
                {data.documentInfo.pageCount}
              </div>
            </Card>
            <Card className="p-4 bg-card border border-border">
              <div className="text-sm text-muted-foreground">Claims</div>
              <div className="text-2xl font-bold text-foreground">
                {data.documentInfo.claimCount}
              </div>
            </Card>
            <Card className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="text-sm text-green-700 dark:text-green-300">
                Verified
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {verifiedCount}
              </div>
            </Card>
            <Card className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                Inaccurate
              </div>
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                {inaccurateCount}
              </div>
            </Card>
            <Card className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <div className="text-sm text-red-700 dark:text-red-300">False</div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {falseCount}
              </div>
            </Card>
          </div>

          {/* Export Button */}
          <Button
            onClick={exportToJSON}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export as JSON'}
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Verification Results
            </h2>
            <p className="text-sm text-muted-foreground">
              {data.verifications.length} claims analyzed
            </p>
          </div>

          <div className="space-y-3">
            {data.verifications.map((verification, index) => {
              const claim = data.claims.find((c) => c.id === verification.claimId);
              return (
                <VerificationCard
                  key={index}
                  claim={claim?.text || 'Unknown claim'}
                  status={verification.status}
                  confidence={verification.confidence}
                  summary={verification.summary}
                  evidence={verification.evidence}
                />
              );
            })}
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
