'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, BookOpen, Landmark, Wallet, AlertTriangle, Activity } from 'lucide-react';

export const AdminReportNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/reports/transactions', label: 'Transaction Report', icon: <Layers className="w-3.5 h-3.5" /> },
    { href: '/admin/reports/ledger', label: 'Ledger Report', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { href: '/admin/reports/settlements', label: 'Settlement Report', icon: <Landmark className="w-3.5 h-3.5" /> },
    { href: '/admin/reports/balance', label: 'Balance Report', icon: <Wallet className="w-3.5 h-3.5" /> },
    { href: '/admin/reports/chargebacks', label: 'Chargeback Report', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { href: '/admin/reports/api-performance', label: 'API Performance', icon: <Activity className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex items-center gap-1 border-b border-[var(--border)] bg-white p-1 rounded-lg min-w-max">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-md transition-colors ${
                  isActive
                    ? 'bg-[var(--primary)] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
