/**
 * TheAltText — WCAG Compliance Score Badge
 * Blue Ocean: Visual compliance score display with color-coded indicator.
 */
import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import clsx from 'clsx';

interface WCAGScoreBadgeProps {
  score: number;
  level?: 'A' | 'AA' | 'AAA';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function WCAGScoreBadge({ score, level = 'AAA', size = 'md', showLabel = true }: WCAGScoreBadgeProps) {
  const getColor = () => {
    if (score >= 80) return { bg: 'bg-forest-500/20', text: 'text-forest-400', border: 'border-forest-500/30' };
    if (score >= 50) return { bg: 'bg-gold-500/20', text: 'text-gold-400', border: 'border-gold-500/30' };
    return { bg: 'bg-ember-500/20', text: 'text-ember-400', border: 'border-ember-500/30' };
  };

  const getIcon = () => {
    if (score >= 80) return <ShieldCheck size={size === 'sm' ? 14 : size === 'md' ? 18 : 22} aria-hidden="true" />;
    if (score >= 50) return <ShieldAlert size={size === 'sm' ? 14 : size === 'md' ? 18 : 22} aria-hidden="true" />;
    if (score > 0) return <Shield size={size === 'sm' ? 14 : size === 'md' ? 18 : 22} aria-hidden="true" />;
    return <ShieldX size={size === 'sm' ? 14 : size === 'md' ? 18 : 22} aria-hidden="true" />;
  };

  const getLabel = () => {
    if (score >= 80) return 'Compliant';
    if (score >= 50) return 'Needs Work';
    if (score > 0) return 'Non-Compliant';
    return 'Missing';
  };

  const colors = getColor();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'md' ? 'px-3 py-1 text-sm' : 'px-4 py-2 text-base';

  return (
    <div
      className={clsx('inline-flex items-center gap-1.5 rounded-full border font-medium', colors.bg, colors.text, colors.border, sizeClasses)}
      role="status"
      aria-label={`WCAG ${level} compliance score: ${score}% — ${getLabel()}`}
    >
      {getIcon()}
      <span className="font-bold">{score}%</span>
      {showLabel && <span className="opacity-80">WCAG {level}</span>}
    </div>
  );
}
