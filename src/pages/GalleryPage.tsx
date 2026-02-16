/**
 * TheAltText — Gallery Page
 * Blue Ocean: Visual gallery of all processed images with filtering and WCAG scores.
 */
import React, { useState, useEffect } from 'react';
import { Images, Download } from 'lucide-react';
import { galleryAPI } from '../services/api';
import ImageGallery from '../components/gallery/ImageGallery';
import BeforeAfterPreview from '../components/accessibility/BeforeAfterPreview';
import AISuggestions from '../components/ai/AISuggestions';
import type { GalleryItem } from '../types';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await galleryAPI.list();
        setItems(res.data);
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const exportAll = () => {
    const csv = ['Image URL,Alt Text,WCAG Score,Language,Tone,Date'];
    items.forEach((item) => {
      csv.push(`"${item.image_url}","${item.generated_alt || ''}",${item.wcag_score?.score || 0},"${item.language}","${item.tone}","${item.created_at}"`);
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'thealttext_gallery_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-earth-100 flex items-center gap-3">
            <Images size={28} className="text-gold-400" aria-hidden="true" />
            Image Gallery
          </h1>
          <p className="text-earth-400 mt-1">Browse, search, and manage all your processed images.</p>
        </div>
        {items.length > 0 && (
          <button onClick={exportAll} className="btn-primary flex items-center gap-2 text-sm" aria-label="Export all alt text as CSV">
            <Download size={16} /> Export CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12"><p className="text-earth-500">Loading gallery...</p></div>
      ) : (
        <>
          <ImageGallery items={items} onSelect={setSelectedItem} />

          {/* Detail Panel */}
          {selectedItem && (
            <div className="space-y-4">
              <div className="glass-panel p-6">
                <div className="flex items-start gap-6">
                  <img src={selectedItem.image_url} alt={selectedItem.generated_alt || ''} className="w-48 h-48 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <h3 className="font-semibold text-earth-100 text-lg">{selectedItem.file_name || 'Image Details'}</h3>
                    <div>
                      <p className="text-xs text-earth-500 mb-1">Generated Alt Text:</p>
                      <p className="text-sm text-earth-200 bg-charcoal-800/50 rounded-lg p-3">{selectedItem.generated_alt || 'No alt text generated'}</p>
                    </div>
                    <div className="flex gap-4 text-xs text-earth-500">
                      <span>Language: {selectedItem.language.toUpperCase()}</span>
                      <span>Tone: {selectedItem.tone}</span>
                      <span>Created: {new Date(selectedItem.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Before/After Preview */}
              <BeforeAfterPreview
                imageUrl={selectedItem.image_url}
                beforeAlt={selectedItem.original_alt}
                afterAlt={selectedItem.generated_alt || ''}
                beforeScore={selectedItem.original_alt ? 30 : 0}
                afterScore={selectedItem.wcag_score?.score || 85}
              />

              {/* AI Suggestions */}
              <AISuggestions imageUrl={selectedItem.image_url} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
