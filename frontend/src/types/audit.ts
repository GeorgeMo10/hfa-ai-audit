// src/types/audit.ts

export type AuditContext = 'manufacturing' | 'hr' | 'general';

export type DimensionKey =
  | 'safety'
  | 'hallucination'
  | 'bias'
  | 'reliability'
  | 'compliance';

export interface DimensionScores {
  safety: number;
  hallucination: number;
  bias: number;
  reliability: number;
  compliance: number;
}

export type IssueSeverity = 'low' | 'medium' | 'high';

export interface AuditIssue {
  id: string;
  type: DimensionKey;
  severity: IssueSeverity;
  description: string;
  snippet?: string;
}

export interface AuditResult {
  id: string;
  createdAt: string;
  context: AuditContext;
  originalText: string;
  overallScore: number;
  dimensionScores: DimensionScores;
  issues: AuditIssue[];
  improvedText?: string; // Optional improved version
}

export interface ImproveResult {
  improvedText: string;
}

export interface ModelComparison {
  id: string;
  prompt: string;
  context: AuditContext;
  models: {
    modelName: string;
    auditResult: AuditResult;
  }[];
  createdAt: string;
}
