/**
 * TheAltText — Billing Page
 * Enhanced with Stripe dual-mode (test/live) toggle.
 * A GlowStarLabs product by Audrey Evans.
 */
import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Crown, Zap, Shield, AlertTriangle } from 'lucide-react';
import { billingAPI, getStripeMode } from '../services/api';
import type { User } from '../types';

interface BillingPageProps {
  user: User | null;
}

export default function BillingPage({ user }: BillingPageProps) {
  const [subscription, setSubscription] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const stripeMode = getStripeMode();

  useEffect(() => {
    const loadSub = async () => {
      try {
        const res = await billingAPI.getSubscription();
        setSubscription(res.data);
      } catch {
        // No subscription
      }
    };
    loadSub();
  }, []);

  const handleUpgrade = async (plan: string) => {
    setLoading(true);
    try {
      const res = await billingAPI.createCheckout({
        plan,
        success_url: window.location.origin + '/billing?success=true',
        cancel_url: window.location.origin + '/billing?canceled=true',
      });
      if (res.data.checkout_url && res.data.checkout_url !== '#demo-checkout') {
        window.location.href = res.data.checkout_url;
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    try {
      await billingAPI.cancel();
      setSubscription((prev) => prev ? { ...prev, status: 'canceled' } : null);
    } catch (err) {
      console.error('Cancel failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-earth-100 flex items-center gap-3">
          <CreditCard size={28} className="text-gold-400" aria-hidden="true" />
          Billing & Plans
        </h1>
        <p className="text-earth-400 mt-1">Manage your subscription and billing preferences.</p>
      </div>

      {/* Stripe Mode Indicator */}
      <div className={`rounded-lg p-3 flex items-center gap-2 text-sm ${stripeMode === 'test' ? 'bg-gold-500/10 border border-gold-500/30 text-gold-400' : 'bg-forest-500/10 border border-forest-500/30 text-forest-400'}`}>
        <AlertTriangle size={16} />
        <span>Stripe is in <strong>{stripeMode.toUpperCase()}</strong> mode. {stripeMode === 'test' ? 'Use test card 4242 4242 4242 4242.' : 'Live payments are enabled.'}</span>
      </div>

      {/* Current Plan */}
      <div className="glass-panel p-6">
        <h2 className="font-semibold text-earth-100 mb-2">Current Plan</h2>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${user?.tier === 'pro' ? 'bg-gold-500/20 text-gold-400' : user?.tier === 'enterprise' ? 'bg-forest-500/20 text-forest-400' : 'bg-charcoal-700 text-earth-400'}`}>
            {user?.tier?.toUpperCase() || 'FREE'}
          </span>
          <span className="text-sm text-earth-400">
            {user?.monthly_usage || 0} / {user?.tier === 'free' ? '50' : 'Unlimited'} images this month
          </span>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Free */}
        <div className={`glass-panel p-6 ${user?.tier === 'free' ? 'border-gold-500/30' : ''}`}>
          <h3 className="font-semibold text-earth-100 text-lg">Free</h3>
          <p className="text-3xl font-bold text-earth-100 mt-2">$0<span className="text-sm text-earth-500 font-normal">/mo</span></p>
          <ul className="mt-4 space-y-2 text-sm text-earth-400">
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> 50 images/month</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> Free AI models</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> Website scanner</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> JSON/CSV export</li>
          </ul>
          {user?.tier === 'free' && <p className="mt-4 text-sm text-gold-400 font-medium">Current Plan</p>}
        </div>

        {/* Pro */}
        <div className={`glass-panel p-6 border-gold-500/30 relative ${user?.tier === 'pro' ? '' : ''}`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-charcoal-950 text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
          <h3 className="font-semibold text-earth-100 text-lg flex items-center gap-2"><Crown size={18} className="text-gold-400" /> Pro</h3>
          <p className="text-3xl font-bold text-earth-100 mt-2">$29<span className="text-sm text-earth-500 font-normal">/mo</span></p>
          <ul className="mt-4 space-y-2 text-sm text-earth-400">
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> Unlimited images</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> Premium AI models</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> Bulk processing (100+)</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> PDF reports</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> E-commerce mode</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> AI suggestions</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> Priority support</li>
          </ul>
          {user?.tier === 'pro' ? (
            <button onClick={handleCancel} className="mt-4 w-full text-sm text-ember-400 hover:text-ember-300">Cancel Subscription</button>
          ) : (
            <button onClick={() => handleUpgrade('pro')} disabled={loading} className="btn-primary w-full mt-4" aria-label="Upgrade to Pro plan">
              {loading ? 'Processing...' : 'Upgrade to Pro'}
            </button>
          )}
        </div>

        {/* Enterprise */}
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-earth-100 text-lg flex items-center gap-2"><Zap size={18} className="text-forest-400" /> Enterprise</h3>
          <p className="text-3xl font-bold text-earth-100 mt-2">$99<span className="text-sm text-earth-500 font-normal">/mo</span></p>
          <ul className="mt-4 space-y-2 text-sm text-earth-400">
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> Everything in Pro</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> API access (B2B)</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> Webhook notifications</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> Multi-language auto-detect</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> Competitor comparison</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> Dedicated support</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-forest-400" /> SLA guarantee</li>
          </ul>
          {user?.tier === 'enterprise' ? (
            <button onClick={handleCancel} className="mt-4 w-full text-sm text-ember-400 hover:text-ember-300">Cancel Subscription</button>
          ) : (
            <button onClick={() => handleUpgrade('enterprise')} disabled={loading} className="btn-primary w-full mt-4" aria-label="Upgrade to Enterprise plan">
              {loading ? 'Processing...' : 'Upgrade to Enterprise'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
