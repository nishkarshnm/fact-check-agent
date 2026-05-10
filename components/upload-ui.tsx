'use client';

import { useState, useCallback } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import clsx from 'clsx';

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export function FileUpload({ onUpload, isLoading = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setError('');

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/pdf') {
          try {
            await onUpload(file);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
          }
        } else {
          setError('Please drop a PDF file');
        }
      }
    },
    [onUpload]
  );

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setError('');
      const files = e.currentTarget.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type === 'application/pdf') {
          try {
            await onUpload(file);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
          }
        } else {
          setError('Please select a PDF file');
        }
      }
    },
    [onUpload]
  );

  return (
    <Card className="w-full">
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          'relative flex flex-col items-center justify-center gap-4 p-12 cursor-pointer rounded-lg border-2 border-dashed transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/30'
        )}
      >
        <div className="flex flex-col items-center gap-2">
          {isLoading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-muted-foreground" />
          )}
          <div className="text-center">
            <p className="font-semibold text-foreground">
              {isLoading ? 'Processing PDF...' : 'Drop your PDF here'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Extracting claims and verifying...' : 'or click to select'}
            </p>
          </div>
        </div>

        <input
          type="file"
          accept=".pdf"
          onChange={handleChange}
          disabled={isLoading}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </Card>
  );
}

export interface VerificationResultProps {
  claim: string;
  status: 'VERIFIED' | 'INACCURATE' | 'FALSE' | 'UNVERIFIABLE' | 'PENDING';
  confidence: number;
  summary: string;
  evidence: string[];
}

export function VerificationCard({
  claim,
  status,
  confidence,
  summary,
  evidence,
}: VerificationResultProps) {
  const statusConfig = {
    VERIFIED: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      label: 'Verified',
    },
    INACCURATE: {
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      label: 'Inaccurate',
    },
    FALSE: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      label: 'False',
    },
    UNVERIFIABLE: {
      icon: AlertCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
      borderColor: 'border-gray-200 dark:border-gray-800',
      label: 'Unverifiable',
    },
    PENDING: {
      icon: Loader2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      label: 'Pending',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className={clsx('border', config.borderColor, config.bgColor, 'p-4')}>
      <div className="flex gap-3">
        <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', config.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-sm break-words">{claim}</h3>
            <span
              className={clsx(
                'text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0',
                config.color,
                config.bgColor
              )}
            >
              {config.label} ({Math.round(confidence * 100)}%)
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{summary}</p>
          {evidence.length > 0 && (
            <div className="text-xs">
              <p className="font-semibold text-foreground mb-1">Evidence:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {evidence.slice(0, 2).map((item, i) => (
                  <li key={i} className="line-clamp-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
