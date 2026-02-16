/**
 * TheAltText Frontend — Layout Component
 * Navigation, sidebar, and main content area.
 * A GlowStarLabs product by Audrey Evans.
 */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Image, Upload, Globe, FileText, Code, CreditCard,
  Settings, LogOut, Menu, X, ShoppingBag, Images, Sparkles,
} from 'lucide-react';
import type { User } from '../../types';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analyze', label: 'Analyze', icon: Image },
  { path: '/bulk', label: 'Bulk Upload', icon: Upload },
  { path: '/gallery', label: 'Gallery', icon: Images },
  { path: '/ecommerce', label: 'E-commerce', icon: ShoppingBag },
  { path: '/scanner', label: 'Scanner', icon: Globe },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/developer', label: 'Developer', icon: Code },
  { path: '/billing', label: 'Billing', icon: CreditCard },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout({ user, onLogout, children }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-charcoal-950 bg-mesh">
      {/* Skip to content */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Mobile header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-charcoal-800" role="banner">
        <Link to="/dashboard" className="font-display text-xl font-bold text-gradient-gold" aria-label="TheAltText Home">
          TheAltText
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-earth-400" aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-charcoal-900/95 backdrop-blur-sm border-r border-charcoal-800 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} role="navigation" aria-label="Main navigation">
          <div className="p-6 border-b border-charcoal-800">
            <Link to="/dashboard" className="font-display text-2xl font-bold text-gradient-gold" aria-label="TheAltText Home">
              TheAltText
            </Link>
            <p className="text-xs text-earth-600 mt-1">by GlowStarLabs</p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-gold-500/15 text-gold-400 font-medium'
                      : 'text-earth-400 hover:text-earth-200 hover:bg-charcoal-800/50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon size={18} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-charcoal-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-sm font-bold" aria-hidden="true">
                {user?.full_name?.[0] || user?.email?.[0] || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-earth-200 truncate">{user?.full_name || user?.email}</p>
                <p className="text-xs text-earth-500 capitalize">{user?.tier} tier</p>
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 text-sm text-earth-500 hover:text-ember-400 transition-colors w-full" aria-label="Log out">
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
        )}

        {/* Main content */}
        <main id="main-content" className="flex-1 p-6 lg:p-8 min-h-screen" role="main">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-charcoal-800 p-4 text-center text-xs text-earth-600" role="contentinfo">
        <p>TheAltText — AI-powered alt text provided by free sources and API.</p>
        <p>A <a href="https://meetaudreyevans.com" className="text-gold-500 hover:text-gold-400">GlowStarLabs</a> product by Audrey Evans.</p>
      </footer>
    </div>
  );
}
