/**
 * TheAltText — E-commerce Product Listing Mode
 * Blue Ocean: Manage product images with SEO-optimized alt text generation.
 */
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Sparkles, TrendingUp, Package } from 'lucide-react';
import { ecommerceAPI } from '../../services/api';
import WCAGScoreBadge from '../accessibility/WCAGScoreBadge';
import type { EcommerceProduct } from '../../types';
import { ECOMMERCE_CATEGORIES } from '../../types';

export default function EcommerceProductMode() {
  const [products, setProducts] = useState<EcommerceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ sku: '', product_name: '', category: 'Electronics', image_urls: '' });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await ecommerceAPI.listProducts();
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.sku || !newProduct.product_name) return;
    try {
      const urls = newProduct.image_urls.split('\n').filter((u) => u.trim());
      const res = await ecommerceAPI.addProduct({ ...newProduct, image_urls: urls });
      setProducts((prev) => [res.data, ...prev]);
      setShowAdd(false);
      setNewProduct({ sku: '', product_name: '', category: 'Electronics', image_urls: '' });
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const generateSeoAlt = async (productId: number) => {
    try {
      await ecommerceAPI.generateSeoAlt(productId);
      await loadProducts();
    } catch (err) {
      console.error('Failed to generate SEO alt:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-earth-100 flex items-center gap-2">
            <ShoppingBag size={24} className="text-gold-400" aria-hidden="true" />
            E-commerce Product Mode
          </h2>
          <p className="text-earth-400 text-sm mt-1">Manage product images with SEO-optimized alt text</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2 text-sm" aria-label="Add new product">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showAdd && (
        <div className="glass-panel p-6 space-y-4">
          <h3 className="font-semibold text-earth-100">Add New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="ecom-sku" className="block text-sm text-earth-400 mb-1">SKU</label>
              <input id="ecom-sku" type="text" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} className="input-field" placeholder="WE-001" />
            </div>
            <div>
              <label htmlFor="ecom-name" className="block text-sm text-earth-400 mb-1">Product Name</label>
              <input id="ecom-name" type="text" value={newProduct.product_name} onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })} className="input-field" placeholder="Wireless Earbuds Pro" />
            </div>
            <div>
              <label htmlFor="ecom-cat" className="block text-sm text-earth-400 mb-1">Category</label>
              <select id="ecom-cat" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="input-field">
                {ECOMMERCE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="ecom-urls" className="block text-sm text-earth-400 mb-1">Image URLs (one per line)</label>
            <textarea id="ecom-urls" value={newProduct.image_urls} onChange={(e) => setNewProduct({ ...newProduct, image_urls: e.target.value })} className="input-field h-24" placeholder="https://example.com/product1.jpg&#10;https://example.com/product2.jpg" />
          </div>
          <div className="flex gap-2">
            <button onClick={addProduct} className="btn-primary text-sm" aria-label="Save product">Save Product</button>
            <button onClick={() => setShowAdd(false)} className="text-sm text-earth-500 hover:text-earth-300" aria-label="Cancel adding product">Cancel</button>
          </div>
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <div className="text-center py-12"><p className="text-earth-500">Loading products...</p></div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-earth-700 mb-3" aria-hidden="true" />
          <p className="text-earth-500">No products added yet</p>
          <p className="text-earth-600 text-sm">Add your first product to generate SEO-optimized alt text</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="glass-panel p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-earth-100">{product.product_name}</h3>
                  <p className="text-sm text-earth-500">SKU: {product.sku} · {product.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-earth-500">SEO Score</p>
                    <p className="text-lg font-bold text-gold-400">{product.seo_score}%</p>
                  </div>
                  <button onClick={() => generateSeoAlt(product.id)} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1" aria-label={`Generate SEO alt text for ${product.product_name}`}>
                    <Sparkles size={14} /> SEO Optimize
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {product.images.map((img) => (
                  <div key={img.id} className="rounded-lg border border-charcoal-700 overflow-hidden">
                    <img src={img.image_url} alt={img.seo_optimized_alt || img.generated_alt || ''} className="w-full h-24 object-cover" />
                    <div className="p-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <WCAGScoreBadge score={img.wcag_score} size="sm" showLabel={false} />
                        <span className="text-xs text-earth-500 flex items-center gap-0.5">
                          <TrendingUp size={10} /> SEO {img.seo_score}%
                        </span>
                      </div>
                      <p className="text-xs text-earth-400 truncate" title={img.seo_optimized_alt || img.generated_alt || ''}>
                        {img.seo_optimized_alt || img.generated_alt || 'No alt text'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
