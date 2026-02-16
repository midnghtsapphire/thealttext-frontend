/**
 * TheAltText Frontend — TypeScript Types
 * Standalone frontend types — zero backend dependencies.
 * A GlowStarLabs product by Audrey Evans.
 */

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  organization: string | null;
  tier: 'free' | 'pro' | 'enterprise';
  monthly_usage: number;
  preferred_language: string;
  preferred_tone: string;
  created_at: string;
}

export interface AltTextResult {
  id: number;
  image_id: number;
  generated_text: string;
  language: string;
  tone: string;
  model_used: string | null;
  confidence_score: number | null;
  wcag_level: string;
  character_count: number | null;
  carbon_cost_mg: number | null;
  processing_time_ms: number | null;
  created_at: string;
}

export interface ScanJob {
  id: number;
  target_url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  scan_depth: number;
  pages_scanned: number;
  images_found: number;
  images_missing_alt: number;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Report {
  id: number;
  title: string;
  report_type: string;
  target_url: string | null;
  total_images: number;
  images_with_alt: number;
  images_without_alt: number;
  images_with_poor_alt: number;
  compliance_score: number;
  wcag_level: string;
  summary: string | null;
  carbon_total_mg: number;
  created_at: string;
}

export interface DashboardStats {
  total_images_processed: number;
  total_alt_texts_generated: number;
  total_scans: number;
  monthly_usage: number;
  monthly_limit: number;
  compliance_score_avg: number;
  carbon_saved_mg: number;
  tier: string;
}

export interface APIKeyData {
  id: number;
  key_prefix: string;
  name: string;
  is_active: boolean;
  requests_count: number;
  last_used_at: string | null;
  created_at: string;
  full_key?: string;
}

export interface WCAGComplianceScore {
  score: number;
  level: 'A' | 'AA' | 'AAA';
  status: 'compliant' | 'poor' | 'non_compliant' | 'missing';
  issues: string[];
  recommendation: string;
}

export interface GalleryItem {
  id: number;
  image_url: string;
  thumbnail_url?: string;
  original_alt: string | null;
  generated_alt: string | null;
  wcag_score: WCAGComplianceScore | null;
  language: string;
  tone: string;
  created_at: string;
  file_name?: string;
  file_size?: number;
}

export interface EcommerceProduct {
  id: number;
  sku: string;
  product_name: string;
  category: string;
  images: EcommerceProductImage[];
  seo_score: number;
  created_at: string;
}

export interface EcommerceProductImage {
  id: number;
  image_url: string;
  current_alt: string | null;
  generated_alt: string | null;
  seo_optimized_alt: string | null;
  wcag_score: number;
  seo_score: number;
}

export interface AISuggestion {
  type: 'crop' | 'contrast' | 'color' | 'composition' | 'text_overlay' | 'resolution';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  estimated_improvement: number;
}

export interface AccessibilityPreview {
  image_url: string;
  before: { alt_text: string | null; screen_reader_output: string; wcag_score: number };
  after: { alt_text: string; screen_reader_output: string; wcag_score: number };
}

export interface BulkUploadItem {
  file: File;
  preview_url: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: AltTextResult;
  error?: string;
}

export interface BulkUploadProgress {
  total: number;
  completed: number;
  errors: number;
  items: BulkUploadItem[];
}

export type Tone = 'formal' | 'casual' | 'technical' | 'simple';
export type WCAGLevel = 'A' | 'AA' | 'AAA';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ru', name: 'Russian' },
  { code: 'haw', name: 'Hawaiian' },
];

export const TONES: { value: Tone; label: string; description: string }[] = [
  { value: 'formal', label: 'Formal', description: 'Professional, corporate-ready' },
  { value: 'casual', label: 'Casual', description: 'Friendly, blog-style' },
  { value: 'technical', label: 'Technical', description: 'Precise, detailed' },
  { value: 'simple', label: 'Simple', description: '6th-grade reading level' },
];

export const ECOMMERCE_CATEGORIES = [
  'Apparel & Fashion', 'Electronics', 'Home & Garden', 'Food & Beverage',
  'Health & Beauty', 'Sports & Outdoors', 'Toys & Games', 'Automotive',
  'Books & Media', 'Jewelry & Accessories', 'Other',
];
