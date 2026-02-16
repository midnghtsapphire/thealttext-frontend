/**
 * TheAltText Frontend — Mock API Service
 * Provides demo data for all features including Blue Ocean enhancements.
 * A GlowStarLabs product by Audrey Evans.
 */
import type {
  AltTextResult, ScanJob, Report, DashboardStats, APIKeyData,
  GalleryItem, WCAGComplianceScore, AISuggestion, AccessibilityPreview,
  EcommerceProduct, User,
} from '../types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

const DEMO_ALT_TEXTS = [
  'A golden retriever catching a red frisbee mid-air in a sunlit park with green grass and scattered autumn leaves',
  'Modern office workspace with dual monitors displaying code, a mechanical keyboard, and a potted succulent plant',
  'Aerial view of a winding coastal road along turquoise ocean cliffs at sunset with warm orange and purple hues',
  'Close-up of freshly baked sourdough bread with a golden crust on a rustic wooden cutting board',
  'Group of diverse professionals collaborating around a whiteboard covered in colorful sticky notes',
  'Vintage red bicycle leaning against a weathered brick wall with ivy growing along the edges',
  'Minimalist product photo of wireless earbuds in a white charging case on a marble surface',
  'Child painting a rainbow on a large canvas in a bright art studio filled with natural light',
];

async function generateAltTextFromUrl(imageUrl: string, options: Record<string, string> = {}): Promise<string> {
  const lang = options.language || 'en';
  const tone = options.tone || 'formal';
  const langInstruction = lang !== 'en' ? ` Respond in ${lang} language.` : '';
  const toneInstruction = tone === 'simple' ? ' Use 6th-grade reading level.' : tone === 'casual' ? ' Use a friendly, casual tone.' : tone === 'technical' ? ' Be precise and technical.' : '';
  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://meetaudreyevans.com',
      'X-Title': 'TheAltText',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        { role: 'system', content: `You are an expert accessibility consultant. Generate WCAG AAA compliant alt text for images. Be descriptive, concise (under 125 characters when possible), and never start with "Image of" or "Picture of".${langInstruction}${toneInstruction}` },
        { role: 'user', content: [{ type: 'image_url', image_url: { url: imageUrl } }, { type: 'text', text: 'Generate WCAG-compliant alt text for this image.' }] },
      ],
      max_tokens: 300,
      temperature: 0.3,
    }),
  });
  if (!resp.ok) throw new Error(`OpenRouter error: ${resp.status}`);
  const data = await resp.json();
  return data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
}

// ── Demo Data ───────────────────────────────────────────────────────────────
const DEMO_STATS: DashboardStats = {
  total_images_processed: 1247, total_alt_texts_generated: 1189,
  total_scans: 23, monthly_usage: 34, monthly_limit: 50,
  compliance_score_avg: 87.3, carbon_saved_mg: 2.4, tier: 'free',
};

const DEMO_CARBON = {
  tracking_enabled: true, co2_mg: 2.4, co2_grams: 0.0024,
  trees_equivalent_minutes: 0.01, lightbulb_seconds: 0.24,
  message: 'This session used approximately 2.4mg of CO2 — less than a single breath.',
};

const DEMO_SCAN_JOBS: ScanJob[] = [
  { id: 1, target_url: 'https://example.com', status: 'completed', scan_depth: 2, pages_scanned: 8, images_found: 45, images_missing_alt: 12, error_message: null, created_at: new Date(Date.now() - 86400000).toISOString(), completed_at: new Date(Date.now() - 86000000).toISOString() },
  { id: 2, target_url: 'https://demo-shop.example.com', status: 'completed', scan_depth: 1, pages_scanned: 3, images_found: 22, images_missing_alt: 5, error_message: null, created_at: new Date(Date.now() - 172800000).toISOString(), completed_at: new Date(Date.now() - 172400000).toISOString() },
];

const DEMO_REPORTS: Report[] = [
  { id: 1, title: 'example.com Accessibility Audit', report_type: 'site_scan', target_url: 'https://example.com', total_images: 45, images_with_alt: 33, images_without_alt: 12, images_with_poor_alt: 5, compliance_score: 73.3, wcag_level: 'AAA', summary: 'Site has moderate accessibility compliance. 12 images missing alt text.', carbon_total_mg: 1.2, created_at: new Date(Date.now() - 86400000).toISOString() },
];

let demoKeys: APIKeyData[] = [
  { id: 1, key_prefix: 'tat_demo1', name: 'Production App', is_active: true, requests_count: 342, last_used_at: new Date(Date.now() - 3600000).toISOString(), created_at: new Date(Date.now() - 2592000000).toISOString() },
];

const DEMO_GALLERY: GalleryItem[] = [
  { id: 1, image_url: 'https://picsum.photos/seed/alt1/400/300', original_alt: null, generated_alt: DEMO_ALT_TEXTS[0], wcag_score: { score: 92, level: 'AAA', status: 'compliant', issues: [], recommendation: 'Alt text is acceptable' }, language: 'en', tone: 'formal', created_at: new Date(Date.now() - 3600000).toISOString(), file_name: 'park-photo.jpg', file_size: 245000 },
  { id: 2, image_url: 'https://picsum.photos/seed/alt2/400/300', original_alt: 'image', generated_alt: DEMO_ALT_TEXTS[1], wcag_score: { score: 45, level: 'AAA', status: 'poor', issues: ['Generic/non-descriptive alt text'], recommendation: 'Consider improving alt text' }, language: 'en', tone: 'formal', created_at: new Date(Date.now() - 7200000).toISOString(), file_name: 'workspace.png', file_size: 512000 },
  { id: 3, image_url: 'https://picsum.photos/seed/alt3/400/300', original_alt: null, generated_alt: DEMO_ALT_TEXTS[2], wcag_score: { score: 88, level: 'AAA', status: 'compliant', issues: [], recommendation: 'Alt text is acceptable' }, language: 'en', tone: 'casual', created_at: new Date(Date.now() - 10800000).toISOString(), file_name: 'coastal-road.jpg', file_size: 890000 },
];

const DEMO_ECOMMERCE: EcommerceProduct[] = [
  { id: 1, sku: 'WE-001', product_name: 'Wireless Earbuds Pro', category: 'Electronics', seo_score: 78, created_at: new Date().toISOString(), images: [{ id: 1, image_url: 'https://picsum.photos/seed/prod1/400/400', current_alt: 'earbuds', generated_alt: 'White wireless earbuds in open charging case on marble surface', seo_optimized_alt: 'Wireless Earbuds Pro - Premium Bluetooth earbuds with charging case, noise cancellation', wcag_score: 85, seo_score: 92 }] },
];

// ── Mock Auth ───────────────────────────────────────────────────────────────
export const mockAuthAPI = {
  login: async (_data: { email: string; password: string }) => {
    await delay(500);
    const user: User = { id: 1, email: _data.email, full_name: 'Demo User', organization: 'GlowStarLabs', tier: 'free', monthly_usage: 34, preferred_language: 'en', preferred_tone: 'formal', created_at: new Date().toISOString() };
    return { data: { access_token: 'demo_token_' + Date.now(), token_type: 'bearer', user } };
  },
  register: async (data: { email: string; password: string; full_name?: string }) => {
    await delay(800);
    const user: User = { id: 1, email: data.email, full_name: data.full_name || null, organization: null, tier: 'free', monthly_usage: 0, preferred_language: 'en', preferred_tone: 'formal', created_at: new Date().toISOString() };
    return { data: { access_token: 'demo_token_' + Date.now(), token_type: 'bearer', user } };
  },
  me: async () => {
    await delay(200);
    return { data: { id: 1, email: 'demo@thealttext.com', full_name: 'Demo User', organization: 'GlowStarLabs', tier: 'free', monthly_usage: 34, preferred_language: 'en', preferred_tone: 'formal', created_at: new Date().toISOString() } };
  },
  updateProfile: async (_data: Record<string, unknown>) => { await delay(300); return { data: { success: true } }; },
};

// ── Mock Image ──────────────────────────────────────────────────────────────
export const mockImageAPI = {
  analyzeUrl: async (data: { image_url: string; language?: string; tone?: string; wcag_level?: string; context?: string }) => {
    const startTime = Date.now();
    let generatedText: string;
    let modelUsed: string;
    if (OPENROUTER_API_KEY) {
      try {
        generatedText = await generateAltTextFromUrl(data.image_url, data as Record<string, string>);
        modelUsed = 'google/gemini-2.0-flash-exp:free';
      } catch {
        generatedText = DEMO_ALT_TEXTS[Math.floor(Math.random() * DEMO_ALT_TEXTS.length)];
        modelUsed = 'demo/fallback';
      }
    } else {
      await delay(1500);
      generatedText = DEMO_ALT_TEXTS[Math.floor(Math.random() * DEMO_ALT_TEXTS.length)];
      modelUsed = 'demo/sample';
    }
    const result: AltTextResult = { id: Date.now(), image_id: Date.now(), generated_text: generatedText, language: data.language || 'en', tone: data.tone || 'formal', model_used: modelUsed, confidence_score: 0.91, wcag_level: data.wcag_level || 'AAA', character_count: generatedText.length, carbon_cost_mg: Math.round(Math.random() * 5 + 2), processing_time_ms: Date.now() - startTime, created_at: new Date().toISOString() };
    return { data: result };
  },
  analyzeFile: async (file: File, _options: Record<string, string> = {}) => {
    await delay(2000);
    const text = DEMO_ALT_TEXTS[Math.floor(Math.random() * DEMO_ALT_TEXTS.length)];
    return { data: { id: Date.now(), image_id: Date.now(), generated_text: text, language: 'en', tone: 'formal', model_used: 'demo/sample', confidence_score: 0.89, wcag_level: 'AAA', character_count: text.length, carbon_cost_mg: 3, processing_time_ms: 2000, created_at: new Date().toISOString() } as AltTextResult };
  },
  bulkUpload: async (files: File[]) => {
    await delay(2000);
    return { data: { status: 'completed', message: `Successfully generated alt text for ${files.length} images.`, total_images: files.length, job_id: 'demo_bulk_' + Date.now() } };
  },
  getHistory: async () => { await delay(300); return { data: [] }; },
};

// ── Mock Scanner ────────────────────────────────────────────────────────────
export const mockScannerAPI = {
  scan: async (data: { url: string; scan_depth?: number }) => {
    await delay(2500);
    const imagesFound = Math.floor(Math.random() * 30) + 10;
    const missingAlt = Math.floor(Math.random() * Math.ceil(imagesFound * 0.3));
    const job: ScanJob = { id: Date.now(), target_url: data.url, status: 'completed', scan_depth: data.scan_depth || 1, pages_scanned: Math.floor(Math.random() * 8) + 1, images_found: imagesFound, images_missing_alt: missingAlt, error_message: null, created_at: new Date().toISOString(), completed_at: new Date().toISOString() };
    DEMO_SCAN_JOBS.unshift(job);
    return { data: job };
  },
  listJobs: async () => { await delay(300); return { data: DEMO_SCAN_JOBS }; },
  getJob: async (jobId: number) => { await delay(200); return { data: DEMO_SCAN_JOBS.find((j) => j.id === jobId) || DEMO_SCAN_JOBS[0] }; },
};

// ── Mock Reports ────────────────────────────────────────────────────────────
export const mockReportAPI = {
  list: async () => { await delay(400); return { data: DEMO_REPORTS }; },
  get: async (reportId: number) => { await delay(200); return { data: DEMO_REPORTS.find((r) => r.id === reportId) || DEMO_REPORTS[0] }; },
  export: async (reportId: number, format: string) => {
    await delay(300);
    const report = DEMO_REPORTS.find((r) => r.id === reportId) || DEMO_REPORTS[0];
    if (format === 'csv') return { data: `title,score\n"${report.title}",${report.compliance_score}` };
    return { data: report };
  },
};

// ── Mock Dashboard ──────────────────────────────────────────────────────────
export const mockDashboardAPI = {
  getStats: async () => { await delay(500); return { data: DEMO_STATS }; },
  getCarbon: async () => { await delay(300); return { data: DEMO_CARBON }; },
};

// ── Mock Billing ────────────────────────────────────────────────────────────
export const mockBillingAPI = {
  createCheckout: async () => { await delay(500); return { data: { checkout_url: '#demo-checkout', session_id: 'demo_session' } }; },
  getSubscription: async () => { await delay(300); return { data: { status: 'active', plan: 'pro', current_period_end: new Date(Date.now() + 30 * 86400000).toISOString() } }; },
  cancel: async () => { await delay(500); return { data: { status: 'canceled' } }; },
};

// ── Mock Developer ──────────────────────────────────────────────────────────
export const mockDeveloperAPI = {
  createKey: async (data: { name: string }) => {
    await delay(500);
    const newKey: APIKeyData = { id: Date.now(), key_prefix: 'tat_' + Math.random().toString(36).slice(2, 8), name: data.name, is_active: true, requests_count: 0, last_used_at: null, created_at: new Date().toISOString(), full_key: 'tat_demo_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) };
    demoKeys.unshift(newKey);
    return { data: newKey };
  },
  listKeys: async () => { await delay(300); return { data: demoKeys }; },
  revokeKey: async (keyId: number) => { await delay(300); demoKeys = demoKeys.filter((k) => k.id !== keyId); return { data: { success: true } }; },
};

// ── Blue Ocean: Mock Gallery ────────────────────────────────────────────────
export const mockGalleryAPI = {
  list: async () => { await delay(400); return { data: DEMO_GALLERY }; },
  get: async (id: number) => { await delay(200); return { data: DEMO_GALLERY.find((g) => g.id === id) || DEMO_GALLERY[0] }; },
  delete: async (_id: number) => { await delay(200); return { data: { success: true } }; },
};

// ── Blue Ocean: Mock E-commerce ─────────────────────────────────────────────
export const mockEcommerceAPI = {
  listProducts: async () => { await delay(400); return { data: DEMO_ECOMMERCE }; },
  addProduct: async (data: { sku: string; product_name: string; category: string; image_urls: string[] }) => {
    await delay(800);
    const product: EcommerceProduct = { id: Date.now(), sku: data.sku, product_name: data.product_name, category: data.category, seo_score: Math.floor(Math.random() * 30) + 70, created_at: new Date().toISOString(), images: data.image_urls.map((url, i) => ({ id: Date.now() + i, image_url: url, current_alt: null, generated_alt: DEMO_ALT_TEXTS[i % DEMO_ALT_TEXTS.length], seo_optimized_alt: `${data.product_name} - High quality product image`, wcag_score: Math.floor(Math.random() * 20) + 80, seo_score: Math.floor(Math.random() * 20) + 80 })) };
    return { data: product };
  },
  generateSeoAlt: async (_productId: number) => { await delay(1500); return { data: { success: true, message: 'SEO-optimized alt text generated' } }; },
};

// ── Blue Ocean: Mock AI Suggestions ─────────────────────────────────────────
export const mockAISuggestionsAPI = {
  getSuggestions: async (_imageUrl: string) => {
    await delay(1000);
    const suggestions: AISuggestion[] = [
      { type: 'contrast', severity: 'warning', title: 'Low Contrast Detected', description: 'The image has areas with low contrast that may be difficult for visually impaired users to perceive. Consider increasing contrast by 15-20%.', estimated_improvement: 12 },
      { type: 'resolution', severity: 'info', title: 'Resolution Optimization', description: 'Image resolution is 4000x3000. Consider providing a 1200x900 optimized version for web to improve load times while maintaining quality.', estimated_improvement: 8 },
      { type: 'text_overlay', severity: 'critical', title: 'Text in Image Detected', description: 'Text content detected in the image. Ensure all text is also available in the alt text or surrounding HTML for screen reader accessibility.', estimated_improvement: 25 },
    ];
    return { data: suggestions };
  },
};

// ── Blue Ocean: Mock Accessibility Preview ──────────────────────────────────
export const mockAccessibilityPreviewAPI = {
  getPreview: async (imageUrl: string, altText: string) => {
    await delay(800);
    const preview: AccessibilityPreview = {
      image_url: imageUrl,
      before: { alt_text: null, screen_reader_output: '[Image: No description available]', wcag_score: 0 },
      after: { alt_text: altText, screen_reader_output: `[Image: ${altText}]`, wcag_score: altText.length > 20 ? 92 : 65 },
    };
    return { data: preview };
  },
};

// ── Blue Ocean: Mock Bulk Processing ────────────────────────────────────────
export const mockBulkAPI = {
  startBulkJob: async (files: File[]) => {
    await delay(1000);
    return { data: { job_id: 'bulk_' + Date.now(), total: files.length, status: 'processing' } };
  },
  getBulkJobStatus: async (jobId: string) => {
    await delay(500);
    return { data: { job_id: jobId, total: 5, completed: 5, errors: 0, status: 'completed', results: DEMO_ALT_TEXTS.slice(0, 5).map((text, i) => ({ image_index: i, alt_text: text, confidence: 0.9 })) } };
  },
};
