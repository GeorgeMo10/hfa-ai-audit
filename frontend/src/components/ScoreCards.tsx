// src/components/ScoreCards.tsx
import React from 'react';
import type { DimensionScores } from '../types/audit';

interface ScoreCardsProps {
  overallScore: number;
  scores: DimensionScores;
}

const getScoreLabel = (score: number): string => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Review';
  return 'High Risk';
};

const ScoreCards: React.FC<ScoreCardsProps> = ({ overallScore, scores }) => {
  return (
    <div className="scorecards">
      <div className="scorecard overall">
        <h3>Overall Trust Score</h3>
        <p className="score">{overallScore}</p>
        <p className="label">{getScoreLabel(overallScore)}</p>
      </div>

      <div className="scorecards-grid">
        <div className="scorecard">
          <h4>Safety</h4>
          <p className="score">{scores.safety}</p>
          <p className="label">{getScoreLabel(scores.safety)}</p>
        </div>
        <div className="scorecard">
          <h4>Hallucination</h4>
          <p className="score">{scores.hallucination}</p>
          <p className="label">{getScoreLabel(scores.hallucination)}</p>
        </div>
        <div className="scorecard">
          <h4>Bias / Fairness</h4>
          <p className="score">{scores.bias}</p>
          <p className="label">{getScoreLabel(scores.bias)}</p>
        </div>
        <div className="scorecard">
          <h4>Reliability</h4>
          <p className="score">{scores.reliability}</p>
          <p className="label">{getScoreLabel(scores.reliability)}</p>
        </div>
        <div className="scorecard">
          <h4>Compliance</h4>
          <p className="score">{scores.compliance}</p>
          <p className="label">{getScoreLabel(scores.compliance)}</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreCards;

