/**
 * TheAltText — Image Gallery View
 * Blue Ocean: Visual gallery of all processed images with WCAG scores.
 */
import React, { useState } from 'react';
import { Grid, List, Search, Filter, Download, Copy, Check } from 'lucide-react';
import WCAGScoreBadge from '../accessibility/WCAGScoreBadge';
import type { GalleryItem } from '../../types';

interface ImageGalleryProps {
  items: GalleryItem[];
  onSelect?: (item: GalleryItem) => void;
}

export default function ImageGallery({ items, onSelect }: ImageGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = items.filter((item) => {
    const matchesSearch = !searchQuery ||
      item.generated_alt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.file_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'compliant' && item.wcag_score && item.wcag_score.score >= 80) ||
      (filterStatus === 'poor' && item.wcag_score && item.wcag_score.score >= 50 && item.wcag_score.score < 80) ||
      (filterStatus === 'non_compliant' && item.wcag_score && item.wcag_score.score < 50) ||
      (filterStatus === 'missing' && !item.generated_alt);
    return matchesSearch && matchesFilter;
  });

  const copyAltText = (item: GalleryItem) => {
    if (item.generated_alt) {
      navigator.clipboard.writeText(item.generated_alt);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-500" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 text-sm"
              aria-label="Search gallery images"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field text-sm w-40"
            aria-label="Filter by compliance status"
          >
            <option value="all">All Status</option>
            <option value="compliant">Compliant</option>
            <option value="poor">Needs Work</option>
            <option value="non_compliant">Non-Compliant</option>
            <option value="missing">Missing</option>
          </select>
        </div>
        <div className="flex items-center gap-1 bg-charcoal-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gold-500/20 text-gold-400' : 'text-earth-500 hover:text-earth-300'}`}
            aria-label="Grid view"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gold-500/20 text-gold-400' : 'text-earth-500 hover:text-earth-300'}`}
            aria-label="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-earth-500">{filtered.length} of {items.length} images</p>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-panel overflow-hidden cursor-pointer hover:border-gold-500/30 transition-all group"
              onClick={() => onSelect?.(item)}
              role="button"
              tabIndex={0}
              aria-label={`Image: ${item.generated_alt || item.file_name || 'Untitled'}`}
            >
              <div className="relative">
                <img src={item.image_url} alt={item.generated_alt || ''} className="w-full h-36 object-cover" />
                {item.wcag_score && (
                  <div className="absolute top-2 right-2">
                    <WCAGScoreBadge score={item.wcag_score.score} size="sm" showLabel={false} />
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-charcoal-950/90 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); copyAltText(item); }} className="text-xs text-earth-300 hover:text-gold-400 flex items-center gap-1" aria-label="Copy alt text">
                    {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                    {copiedId === item.id ? 'Copied!' : 'Copy Alt'}
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-earth-400 truncate">{item.file_name || 'Image'}</p>
                <p className="text-xs text-earth-300 truncate mt-1">{item.generated_alt || 'No alt text'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-3 flex items-center gap-4 cursor-pointer hover:border-gold-500/30 transition-all"
              onClick={() => onSelect?.(item)}
              role="button"
              tabIndex={0}
              aria-label={`Image: ${item.generated_alt || item.file_name || 'Untitled'}`}
            >
              <img src={item.image_url} alt={item.generated_alt || ''} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-earth-200 truncate">{item.file_name || 'Image'}</p>
                <p className="text-xs text-earth-400 truncate mt-0.5">{item.generated_alt || 'No alt text generated'}</p>
                <p className="text-xs text-earth-600 mt-0.5">{item.language.toUpperCase()} · {item.tone}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {item.wcag_score && <WCAGScoreBadge score={item.wcag_score.score} size="sm" />}
                <button onClick={(e) => { e.stopPropagation(); copyAltText(item); }} className="p-2 text-earth-500 hover:text-gold-400 transition-colors" aria-label="Copy alt text">
                  {copiedId === item.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Filter size={48} className="mx-auto text-earth-700 mb-3" aria-hidden="true" />
          <p className="text-earth-500">No images match your filters</p>
        </div>
      )}
    </div>
  );
}
