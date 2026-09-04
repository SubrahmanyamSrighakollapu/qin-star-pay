'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { ledgerService } from '@/services/ledgerService';
import { reportService } from '@/services/reportService';
import { LedgerEntry, LedgerFilters } from '@/types/domain';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { LedgerDetailsDrawer } from '@/components/features/wallet/LedgerDetailsDrawer';
import {
  BookOpen,
  Search,
  Download,
  Eye,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

export default function RetailerLedgerPage() {
  const { session } = useAuth();

  const retailerId = session?.entityId || 'ret_001';

  // State
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');
  const [movementFilter, setMovementFilter] = useState('ALL');

  // Detail Drawer State
  const [selectedLedger, setSelectedLedger] = useState<LedgerEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const filters: LedgerFilters = {
        direction: directionFilter !== 'ALL' ? directionFilter : undefined,
        entryType: movementFilter !== 'ALL' ? (movementFilter as any) : undefined,
        searchQuery: searchQuery.trim() || undefined,
      };

      const res = await ledgerService.getRetailerLedger(retailerId, filters, page, pageSize);
      if (res.success && res.data) {
        setEntries(res.data.items);
        setTotalPages(res.data.pagination.totalPages);
        setTotalItems(res.data.pagination.totalItems);
      }
    } catch (err) {
      console.error('Failed to load ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [retailerId, directionFilter, movementFilter, page, searchQuery]);

  // CSV Export
  const handleExportCsv = () => {
    const exportRows = entries.map((e) => ({
      'Ledger ID': e.id,
      'Wallet ID': e.walletId,
      'Reference ID': e.referenceId || e.transactionId || 'SYSTEM',
      'Movement Type': e.entryType,
      Direction: e.direction,
      'Opening Balance (₹)': e.openingBalance,
      'Amount (₹)': e.amount,
      'Closing Balance (₹)': e.closingBalance,
      Description: e.description,
      'Created At': formatDateTime(e.createdAt),
    }));

    reportService.exportToCsv(`Retailer_Ledger_${retailerId}`, exportRows);
  };

  return (
    <PageContainer
      title="Wallet Ledger Audit History"
      description="Inspect your immutable financial ledger postings for complete auditability."
      statusBadge={<StatusBadge status="ACTIVE" label="Approved Retailer" />}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCsv}
          leftIcon={<Download className="w-4 h-4" />}
          disabled={entries.length === 0}
        >
          Export CSV
        </Button>
      }
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        <Card>
          {/* Controls Bar */}
          <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative min-w-[240px] flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search Ledger ID, Ref, Description..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              {/* Direction Filter */}
              <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
                {(['ALL', 'CREDIT', 'DEBIT'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDirectionFilter(d);
                      setPage(1);
                    }}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${
                      directionFilter === d
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {d === 'ALL' ? 'All Directions' : d}
                  </button>
                ))}
              </div>

              {/* Movement Type Filter */}
              <select
                value={movementFilter}
                onChange={(e) => {
                  setMovementFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="ALL">All Movement Types</option>
                <option value="PAY_IN">PAY_IN</option>
                <option value="PAY_OUT">PAY_OUT</option>
                <option value="WALLET_CREDIT">WALLET_CREDIT</option>
                <option value="CHARGE">CHARGE</option>
                <option value="TAX">TAX</option>
                <option value="HOLD">HOLD</option>
                <option value="RELEASE">RELEASE</option>
              </select>
            </div>

            <Button variant="ghost" size="sm" onClick={fetchLedger} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              Refresh
            </Button>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Ledger ID / Date</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Movement Type</th>
                  <th className="px-4 py-3 text-right">Credit (₹)</th>
                  <th className="px-4 py-3 text-right">Debit (₹)</th>
                  <th className="px-4 py-3 text-right">Balance After (₹)</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                      Loading ledger entries...
                    </td>
                  </tr>
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No ledger entries found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
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

                      <td className="px-4 py-3 text-right font-bold text-emerald-700">
                        {entry.direction === 'CREDIT' ? `+${formatCurrency(entry.amount)}` : '—'}
                      </td>

                      <td className="px-4 py-3 text-right font-bold text-rose-700">
                        {entry.direction === 'DEBIT' ? `-${formatCurrency(entry.amount)}` : '—'}
                      </td>

                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {formatCurrency(entry.closingBalance)}
                      </td>

                      <td className="px-4 py-3 font-sans text-slate-700 max-w-xs truncate">
                        {entry.description}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLedger(entry);
                            setIsDrawerOpen(true);
                          }}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-mono">
              Page {page} of {totalPages} ({totalItems} records)
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </Card>

        {/* Ledger Details Drawer */}
        <LedgerDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          entry={selectedLedger}
        />
      </div>
    </PageContainer>
  );
}
