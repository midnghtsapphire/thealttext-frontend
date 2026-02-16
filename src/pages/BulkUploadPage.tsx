/**
 * TheAltText — Enhanced Bulk Upload Page
 * Blue Ocean: Drag-and-drop bulk upload with progress tracking and gallery preview.
 */
import React, { useState } from 'react';
import { Upload, Settings } from 'lucide-react';
import DragDropBulkUpload from '../components/upload/DragDropBulkUpload';
import { LANGUAGES, TONES } from '../types';
import type { BulkUploadItem } from '../types';

export default function BulkUploadPage() {
  const [language, setLanguage] = useState('en');
  const [tone, setTone] = useState('formal');
  const [wcagLevel, setWcagLevel] = useState('AAA');
  const [showSettings, setShowSettings] = useState(false);
  const [completedItems, setCompletedItems] = useState<BulkUploadItem[]>([]);

  const handleComplete = (items: BulkUploadItem[]) => {
    setCompletedItems(items.filter((i) => i.status === 'completed'));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-earth-100 flex items-center gap-3">
            <Upload size={28} className="text-gold-400" aria-hidden="true" />
            Bulk Upload
          </h1>
          <p className="text-earth-400 mt-1">Drag and drop up to 100 images for batch alt text generation.</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-sm text-earth-400 hover:text-gold-400 transition-colors"
          aria-label="Toggle generation settings"
        >
          <Settings size={16} /> Settings
        </button>
      </div>

      {/* Generation Settings */}
      {showSettings && (
        <div className="glass-panel p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bulk-lang" className="block text-sm text-earth-400 mb-1">Language</label>
              <select id="bulk-lang" value={language} onChange={(e) => setLanguage(e.target.value)} className="input-field text-sm">
                {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="bulk-tone" className="block text-sm text-earth-400 mb-1">Tone</label>
              <select id="bulk-tone" value={tone} onChange={(e) => setTone(e.target.value)} className="input-field text-sm">
                {TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="bulk-wcag" className="block text-sm text-earth-400 mb-1">WCAG Level</label>
              <select id="bulk-wcag" value={wcagLevel} onChange={(e) => setWcagLevel(e.target.value)} className="input-field text-sm">
                <option value="A">WCAG A</option>
                <option value="AA">WCAG AA</option>
                <option value="AAA">WCAG AAA</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Drag & Drop Upload */}
      <div className="glass-panel p-6">
        <DragDropBulkUpload
          language={language}
          tone={tone}
          wcagLevel={wcagLevel}
          onComplete={handleComplete}
        />
      </div>

      {/* Completed Summary */}
      {completedItems.length > 0 && (
        <div className="glass-panel p-6">
          <h2 className="font-semibold text-earth-100 mb-3">Completed ({completedItems.length} images)</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {completedItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-charcoal-800/30">
                <img src={item.preview_url} alt={item.result?.generated_text || ''} className="w-10 h-10 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-earth-400 truncate">{item.file.name}</p>
                  <p className="text-xs text-forest-400 truncate">{item.result?.generated_text}</p>
                </div>
                <span className="text-xs text-earth-600">{item.result?.processing_time_ms}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
