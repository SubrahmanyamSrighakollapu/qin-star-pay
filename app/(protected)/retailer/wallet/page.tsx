'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { walletService } from '@/services/walletService';
import { ledgerService } from '@/services/ledgerService';
import { WalletAccount, LedgerEntry } from '@/types/domain';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  BookOpen,
  RefreshCw,
  PlusCircle,
  Send,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export default function RetailerWalletPage() {
  const { session } = useAuth();

  const retailerId = session?.entityId || 'ret_001';

  // State
  const [wallet, setWallet] = useState<WalletAccount | null>(null);
  const [recentEntries, setRecentEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const [wltRes, ledRes] = await Promise.all([
        walletService.getRetailerWallet(retailerId),
        ledgerService.getRetailerLedger(retailerId, {}, 1, 10),
      ]);

      if (wltRes.success && wltRes.data) {
        setWallet(wltRes.data);
      }
      if (ledRes.success && ledRes.data) {
        setRecentEntries(ledRes.data.items);
      }
    } catch (err) {
      console.error('Failed to load wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [retailerId]);

  const availableBalance = wallet?.availableBalance || 0;
  const holdBalance = wallet?.holdBalance || 0;
  const ledgerBalance = wallet?.ledgerBalance || 0;

  // Calculate totals from recent ledger entries
  const totalCredits = recentEntries
    .filter((e) => e.direction === 'CREDIT')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalDebits = recentEntries
    .filter((e) => e.direction === 'DEBIT')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <PageContainer
      title="Retailer Wallet Overview"
      description="Inspect your spendable operational wallet balance, pending holds, and recent balance movements."
      statusBadge={<StatusBadge status={wallet?.status || 'ACTIVE'} label={wallet?.status || 'Active Wallet'} />}
      actions={
        <Button variant="ghost" size="sm" onClick={fetchWalletData} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh
        </Button>
      }
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Available Spendable Balance */}
          <div className="p-5 rounded-2xl border border-indigo-300 bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between text-indigo-200 text-xs">
              <span className="font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-400" /> Available Balance
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-800 border border-indigo-700 text-emerald-300 font-bold">
                Spendable
              </span>
            </div>
            <p className="text-3xl font-extrabold font-mono text-emerald-400">
              {formatCurrency(availableBalance)}
            </p>
            <p className="text-[11px] text-indigo-200">
              Collected principal & credited commission earnings
            </p>
          </div>

          {/* Hold / Lien Balance */}
          <div className="p-5 rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-900 to-slate-900 text-white shadow-md space-y-2">
            <div className="flex items-center justify-between text-amber-200 text-xs">
              <span className="font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" /> Hold / Lien Balance
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-900 border border-amber-700 text-amber-300 font-bold">
                Reserved
              </span>
            </div>
            <p className="text-3xl font-extrabold font-mono text-amber-300">
              {formatCurrency(holdBalance)}
            </p>
            <p className="text-[11px] text-amber-200">
              Temporarily held funds from pending Pay-Out disbursements
            </p>
          </div>

          {/* Ledger Total Balance */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-bold uppercase tracking-wider">Ledger Balance</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                Total
              </span>
            </div>
            <p className="text-2xl font-extrabold font-mono text-slate-900">
              {formatCurrency(ledgerBalance)}
            </p>
            <p className="text-[11px] text-slate-500">
              Available balance + Reserved hold balance
            </p>
          </div>

          {/* Activity Net Movements */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Activity</span>
            <div className="space-y-1 font-mono text-xs pt-1">
              <div className="flex justify-between text-emerald-700">
                <span>Recent Credits:</span>
                <span className="font-bold">+{formatCurrency(totalCredits)}</span>
              </div>
              <div className="flex justify-between text-rose-700">
                <span>Recent Debits:</span>
                <span className="font-bold">-{formatCurrency(totalDebits)}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">Derived from 10 latest entries</p>
          </div>
        </div>

        {/* Quick Actions & Navigation Bar */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mr-2">Counter Actions:</span>
            <Link href="/retailer/pay-in">
              <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Accept Pay-In Collection
              </Button>
            </Link>
            <Link href="/retailer/pay-out">
              <Button variant="outline" size="sm" leftIcon={<Send className="w-4 h-4" />}>
                Send Pay-Out Disbursement
              </Button>
            </Link>
          </div>

          <Link href="/retailer/wallet/ledger">
            <Button variant="secondary" size="sm" leftIcon={<BookOpen className="w-4 h-4" />}>
              View Full Wallet Ledger
            </Button>
          </Link>
        </div>

        {/* Recent Ledger Activity Table */}
        <Card title="Recent Wallet Activity">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Ledger ID / Date</th>
                  <th className="px-4 py-3">Reference / Txn</th>
                  <th className="px-4 py-3">Movement Type</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Credit / Debit (₹)</th>
                  <th className="px-4 py-3 text-right">Balance After (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                      Loading wallet activity...
                    </td>
                  </tr>
                ) : recentEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No recent wallet activity found.
                    </td>
                  </tr>
                ) : (
                  recentEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-indigo-700">
                        <div>{entry.id}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{formatDateTime(entry.createdAt)}</div>
                      </td>

                      <td className="px-4 py-3 text-slate-800">
                        {entry.referenceId || entry.transactionId || 'SYSTEM'}
                      </td>

                      <td className="px-4 py-3 font-sans">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            entry.direction === 'CREDIT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {entry.entryType} ({entry.direction})
                        </span>
                      </td>

                      <td className="px-4 py-3 font-sans text-slate-700 max-w-xs truncate">
                        {entry.description}
                      </td>

                      <td className="px-4 py-3 text-right font-bold">
                        <span className={entry.direction === 'CREDIT' ? 'text-emerald-700' : 'text-rose-700'}>
                          {entry.direction === 'CREDIT' ? '+' : '-'}{formatCurrency(entry.amount)}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {formatCurrency(entry.closingBalance)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
