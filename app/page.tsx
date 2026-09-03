import Link from 'next/link';
import {
  ArrowRight,
  LayoutDashboard,
  Layers,
  Lock,
  Palette,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex flex-col">
      {/* Top Header */}
      <header className="h-[64px] bg-white border-b border-[var(--border)] px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary)] text-white font-bold flex items-center justify-center tracking-tighter shadow-xs">
            QSP
          </div>
          <div>
            <span className="font-bold text-lg text-[var(--text-primary)] tracking-tight">
              QIN STAR PAY
            </span>
            <span className="ml-2 text-[10px] font-semibold bg-[var(--primary-light)] text-[var(--primary)] px-2 py-0.5 rounded-full uppercase">
              Operations Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dev-showcase">
            <Button variant="outline" size="sm">
              Component Showcase
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Enter Admin Portal
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-[1280px] mx-auto w-full space-y-8">
        {/* Hero Banner */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-xl)] p-8 md:p-12 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <StatusBadge status="SUCCESS" label="Application Shell Active" />
            <span className="text-xs text-[var(--text-muted)]">Role-Based Access Control • Responsive Tablet & Desktop Shell</span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Qin Star Pay — Enterprise Application Shell & Navigation Engine
            </h1>
            <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
              Authenticated application layout featuring a responsive fintech dark sidebar with collapsible accordions, 300px tablet drawer overlay, header with wallet balance feed, dynamic route breadcrumbs, notifications popover, and role-based module navigation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/dashboard">
              <Button variant="primary" size="lg" leftIcon={<LayoutDashboard className="w-5 h-5" />} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Operations Portal (/dashboard)
              </Button>
            </Link>
            <Link href="/dev-showcase">
              <Button variant="outline" size="lg" leftIcon={<Palette className="w-5 h-5" />}>
                View UI Component Showcase
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Responsive Application Shell" subtitle="Sidebar & Header System">
            <div className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Desktop (1024px+): Persistent 260px/72px dark sidebar with collapse toggle</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tablet (&lt; 1024px): 300px slide-over overlay drawer with backdrop</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Prioritized header controls &amp; 100% full content width on tablet</span>
              </div>
            </div>
          </Card>

          <Card title="Centralized Navigation & RBAC" subtitle="Config-Driven Navigation">
            <div className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span>Role checking architecture (`canAccessRoute`, `filterNavigationByRole`)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Supports 9 roles (Super Admin, Operations, Accounts, KYC, Support, Sales, etc.)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Interactive Dev Role Switcher inside profile popover</span>
              </div>
            </div>
          </Card>

          <Card title="Dynamic Breadcrumbs & Routing" subtitle="44 Active Route Endpoints">
            <div className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Automatic route-derived breadcrumb resolution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Exact &amp; deep nested active route highlighting</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Protected App Router layout wrapper `(protected)/layout.tsx`</span>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[var(--border)] bg-white text-center text-xs text-[var(--text-muted)]">
        Qin Star Pay — Payment Administration &amp; Operations Platform
      </footer>
    </div>
  );
}
