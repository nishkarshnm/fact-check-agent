'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, XCircle, BarChart3 } from 'lucide-react';

interface Verification {
  status: 'VERIFIED' | 'INACCURATE' | 'FALSE' | 'UNVERIFIABLE';
  confidence: number;
}

interface StatsDisplayProps {
  verifications: Verification[];
  totalClaims: number;
}

export function StatsDisplay({ verifications, totalClaims }: StatsDisplayProps) {
  const verified = verifications.filter(v => v.status === 'VERIFIED').length;
  const inaccurate = verifications.filter(v => v.status === 'INACCURATE').length;
  const false_claims = verifications.filter(v => v.status === 'FALSE').length;
  const unverifiable = verifications.filter(v => v.status === 'UNVERIFIABLE').length;

  const avgConfidence = verifications.length > 0
    ? (verifications.reduce((sum, v) => sum + v.confidence, 0) / verifications.length * 100).toFixed(1)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">Verified</span>
        </div>
        <div className="text-2xl font-bold text-green-900 dark:text-green-100">{verified}</div>
        <p className="text-xs text-green-600 dark:text-green-400 mt-1">{((verified/totalClaims)*100).toFixed(0)}%</p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Inaccurate</span>
        </div>
        <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{inaccurate}</div>
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">{((inaccurate/totalClaims)*100).toFixed(0)}%</p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
        <div className="flex items-center gap-3 mb-2">
          <XCircle className="w-5 h-5 text-red-600" />
          <span className="text-sm font-medium text-red-700 dark:text-red-300">False</span>
        </div>
        <div className="text-2xl font-bold text-red-900 dark:text-red-100">{false_claims}</div>
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{((false_claims/totalClaims)*100).toFixed(0)}%</p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20">
        <div className="flex items-center gap-3 mb-2">
          <AlertCircle className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Unverifiable</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{unverifiable}</div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{((unverifiable/totalClaims)*100).toFixed(0)}%</p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Avg Confidence</span>
        </div>
        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{avgConfidence}%</div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Verification score</p>
      </Card>
    </div>
  );
}
