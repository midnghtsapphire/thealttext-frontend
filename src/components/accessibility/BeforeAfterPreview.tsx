/**
 * TheAltText — Before/After Accessibility Preview
 * Blue Ocean: Side-by-side comparison of accessibility before and after alt text.
 */
import React from 'react';
import { Eye, EyeOff, Volume2 } from 'lucide-react';
import WCAGScoreBadge from './WCAGScoreBadge';

interface BeforeAfterPreviewProps {
  imageUrl: string;
  beforeAlt: string | null;
  afterAlt: string;
  beforeScore?: number;
  afterScore?: number;
}

export default function BeforeAfterPreview({ imageUrl, beforeAlt, afterAlt, beforeScore = 0, afterScore = 92 }: BeforeAfterPreviewProps) {
  return (
    <div className="glass-panel p-6 space-y-4">
      <h3 className="font-semibold text-earth-100 flex items-center gap-2">
        <Eye size={18} className="text-gold-400" aria-hidden="true" />
        Accessibility Preview
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before */}
        <div className="rounded-xl border border-ember-500/30 bg-ember-500/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ember-400 flex items-center gap-1.5">
              <EyeOff size={14} aria-hidden="true" /> Before
            </span>
            <WCAGScoreBadge score={beforeScore} size="sm" showLabel={false} />
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <img src={imageUrl} alt="" className="w-full h-40 object-cover opacity-60" />
            <div className="absolute inset-0 bg-ember-900/40 flex items-center justify-center">
              <span className="text-ember-200 text-xs bg-charcoal-900/80 px-3 py-1.5 rounded-lg">
                {beforeAlt ? `alt="${beforeAlt}"` : 'No alt text'}
              </span>
            </div>
          </div>
          <div className="bg-charcoal-900/60 rounded-lg p-3">
            <p className="text-xs text-earth-500 mb-1 flex items-center gap-1">
              <Volume2 size={12} aria-hidden="true" /> Screen Reader Output:
            </p>
            <p className="text-sm text-ember-300 italic">
              {beforeAlt ? `"${beforeAlt}"` : '"[Image: No description available]"'}
            </p>
          </div>
        </div>
        {/* After */}
        <div className="rounded-xl border border-forest-500/30 bg-forest-500/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-forest-400 flex items-center gap-1.5">
              <Eye size={14} aria-hidden="true" /> After
            </span>
            <WCAGScoreBadge score={afterScore} size="sm" showLabel={false} />
          </div>
          <div className="relative rounded-lg overflow-hidden">
            <img src={imageUrl} alt={afterAlt} className="w-full h-40 object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-charcoal-950/90 to-transparent p-3">
              <span className="text-forest-200 text-xs">alt="{afterAlt.slice(0, 80)}..."</span>
            </div>
          </div>
          <div className="bg-charcoal-900/60 rounded-lg p-3">
            <p className="text-xs text-earth-500 mb-1 flex items-center gap-1">
              <Volume2 size={12} aria-hidden="true" /> Screen Reader Output:
            </p>
            <p className="text-sm text-forest-300 italic">"{afterAlt}"</p>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-earth-400">
          Score improvement: <span className="text-forest-400 font-bold">+{afterScore - beforeScore}%</span>
        </p>
      </div>
    </div>
  );
}
