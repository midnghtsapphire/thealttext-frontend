/**
 * TheAltText — AI-Suggested Image Improvements
 * Blue Ocean: AI analyzes images and suggests accessibility improvements.
 */
import React, { useState } from 'react';
import { Sparkles, AlertTriangle, Info, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import { aiSuggestionsAPI } from '../../services/api';
import type { AISuggestion } from '../../types';

interface AISuggestionsProps {
  imageUrl: string;
  autoLoad?: boolean;
}

export default function AISuggestions({ imageUrl, autoLoad = false }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const res = await aiSuggestionsAPI.getSuggestions(imageUrl);
      setSuggestions(res.data);
      setLoaded(true);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (autoLoad && imageUrl) loadSuggestions();
  }, [autoLoad, imageUrl]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle size={16} className="text-ember-400" aria-hidden="true" />;
      case 'warning': return <AlertTriangle size={16} className="text-gold-400" aria-hidden="true" />;
      default: return <Info size={16} className="text-forest-400" aria-hidden="true" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-ember-500/30 bg-ember-500/5';
      case 'warning': return 'border-gold-500/30 bg-gold-500/5';
      default: return 'border-forest-500/30 bg-forest-500/5';
    }
  };

  if (!loaded && !loading) {
    return (
      <button onClick={loadSuggestions} className="glass-panel p-4 w-full text-left hover:border-gold-500/30 transition-all flex items-center gap-3" aria-label="Get AI suggestions for image improvement">
        <Sparkles size={20} className="text-gold-400" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-earth-200">AI Image Suggestions</p>
          <p className="text-xs text-earth-500">Click to analyze this image for accessibility improvements</p>
        </div>
      </button>
    );
  }

  if (loading) {
    return (
      <div className="glass-panel p-4 flex items-center gap-3">
        <Loader2 size={20} className="text-gold-400 animate-spin" aria-hidden="true" />
        <p className="text-sm text-earth-400">Analyzing image for improvements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-earth-200 flex items-center gap-2">
        <Sparkles size={16} className="text-gold-400" aria-hidden="true" />
        AI Suggestions ({suggestions.length})
      </h4>
      {suggestions.map((suggestion, idx) => (
        <div key={idx} className={`rounded-lg border p-3 ${getSeverityBg(suggestion.severity)}`}>
          <div className="flex items-start gap-2">
            {getSeverityIcon(suggestion.severity)}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-earth-200">{suggestion.title}</p>
                <span className="text-xs text-forest-400 flex items-center gap-0.5">
                  <TrendingUp size={10} /> +{suggestion.estimated_improvement}%
                </span>
              </div>
              <p className="text-xs text-earth-400 mt-1">{suggestion.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
