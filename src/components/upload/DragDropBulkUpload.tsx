/**
 * TheAltText — Drag-and-Drop Bulk Upload Component
 * Blue Ocean: Enhanced bulk upload with drag-and-drop, progress tracking, and gallery preview.
 */
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { imageAPI } from '../../services/api';
import type { BulkUploadItem } from '../../types';

interface DragDropBulkUploadProps {
  language?: string;
  tone?: string;
  wcagLevel?: string;
  onComplete?: (results: BulkUploadItem[]) => void;
}

export default function DragDropBulkUpload({ language = 'en', tone = 'formal', wcagLevel = 'AAA', onComplete }: DragDropBulkUploadProps) {
  const [items, setItems] = useState<BulkUploadItem[]>([]);
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newItems: BulkUploadItem[] = acceptedFiles.map((file) => ({
      file,
      preview_url: URL.createObjectURL(file),
      status: 'pending' as const,
      progress: 0,
    }));
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.bmp', '.tiff'] },
    maxFiles: 100,
    maxSize: 50 * 1024 * 1024,
  });

  const removeItem = (index: number) => {
    setItems((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview_url);
      updated.splice(index, 1);
      return updated;
    });
  };

  const processAll = async () => {
    setProcessing(true);
    const updatedItems = [...items];
    for (let i = 0; i < updatedItems.length; i++) {
      if (updatedItems[i].status !== 'pending') continue;
      updatedItems[i] = { ...updatedItems[i], status: 'processing', progress: 50 };
      setItems([...updatedItems]);
      try {
        const res = await imageAPI.analyzeFile(updatedItems[i].file, { language, tone, wcag_level: wcagLevel });
        updatedItems[i] = { ...updatedItems[i], status: 'completed', progress: 100, result: res.data };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Processing failed';
        updatedItems[i] = { ...updatedItems[i], status: 'error', progress: 100, error: errorMsg };
      }
      setItems([...updatedItems]);
    }
    setProcessing(false);
    onComplete?.(updatedItems);
  };

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const errorCount = items.filter((i) => i.status === 'error').length;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-gold-400 bg-gold-500/10'
            : 'border-charcoal-600 hover:border-gold-500/50 hover:bg-charcoal-800/30'
        }`}
        role="button"
        aria-label="Drop images here or click to browse. Supports up to 100 images."
      >
        <input {...getInputProps()} />
        <Upload size={40} className={`mx-auto mb-3 ${isDragActive ? 'text-gold-400' : 'text-earth-500'}`} aria-hidden="true" />
        {isDragActive ? (
          <p className="text-gold-400 font-medium">Drop images here...</p>
        ) : (
          <>
            <p className="text-earth-200 font-medium">Drag & drop images here</p>
            <p className="text-earth-500 text-sm mt-1">or click to browse — up to 100 images at once</p>
            <p className="text-earth-600 text-xs mt-2">JPEG, PNG, WebP, GIF, SVG, BMP, TIFF — max 50MB each</p>
          </>
        )}
      </div>

      {/* File List */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-earth-300">
              {items.length} image{items.length !== 1 ? 's' : ''} queued
              {completedCount > 0 && <span className="text-forest-400"> — {completedCount} done</span>}
              {errorCount > 0 && <span className="text-ember-400"> — {errorCount} errors</span>}
            </p>
            <div className="flex gap-2">
              {!processing && items.some((i) => i.status === 'pending') && (
                <button onClick={processAll} className="btn-primary text-sm px-4 py-1.5" aria-label="Generate alt text for all queued images">
                  Generate All
                </button>
              )}
              {!processing && (
                <button onClick={() => { items.forEach((i) => URL.revokeObjectURL(i.preview_url)); setItems([]); }} className="text-sm text-earth-500 hover:text-ember-400 transition-colors" aria-label="Clear all images">
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map((item, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-charcoal-700 bg-charcoal-800/50">
                <img src={item.preview_url} alt={item.result?.generated_text || item.file.name} className="w-full h-28 object-cover" />
                {/* Status Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                  item.status === 'pending' ? 'opacity-0 group-hover:opacity-100 bg-charcoal-950/60' :
                  item.status === 'processing' ? 'bg-charcoal-950/70' :
                  item.status === 'completed' ? 'opacity-0 group-hover:opacity-100 bg-forest-950/60' :
                  'bg-ember-950/60'
                }`}>
                  {item.status === 'processing' && <Loader2 size={24} className="text-gold-400 animate-spin" aria-hidden="true" />}
                  {item.status === 'completed' && <CheckCircle size={24} className="text-forest-400" aria-hidden="true" />}
                  {item.status === 'error' && <AlertCircle size={24} className="text-ember-400" aria-hidden="true" />}
                </div>
                {/* Remove Button */}
                {item.status === 'pending' && (
                  <button onClick={() => removeItem(idx)} className="absolute top-1 right-1 p-1 rounded-full bg-charcoal-900/80 text-earth-400 hover:text-ember-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Remove ${item.file.name}`}>
                    <X size={14} />
                  </button>
                )}
                {/* File Name */}
                <div className="p-1.5">
                  <p className="text-xs text-earth-400 truncate">{item.file.name}</p>
                  {item.result && (
                    <p className="text-xs text-forest-400 truncate mt-0.5" title={item.result.generated_text}>
                      {item.result.generated_text}
                    </p>
                  )}
                  {item.error && <p className="text-xs text-ember-400 truncate mt-0.5">{item.error}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon size={48} className="mx-auto text-earth-700 mb-3" aria-hidden="true" />
          <p className="text-earth-500">No images uploaded yet</p>
          <p className="text-earth-600 text-sm">Drag and drop or click the area above to get started</p>
        </div>
      )}
    </div>
  );
}
