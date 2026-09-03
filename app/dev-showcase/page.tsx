'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Activity,
  Eye,
  Plus,
  Trash2,
  Download,
} from 'lucide-react';

import {
  Button,
  Input,
  Select,
  SearchInput,
  Card,
  KPICard,
  StatusBadge,
  Table,
  FilterBar,
  Modal,
  Drawer,
  ConfirmationDialog,
  Tabs,
  Pagination,
  Tooltip,
  EmptyState,
  LoadingSkeleton,
  ErrorState,
  PageHeader,
  SectionHeader,
  MaskedValue,
} from '@/components/ui';

import { ColumnDefinition } from '@/types/common';
import { Transaction } from '@/types/domain';
import { formatCurrency, formatNumber, formatPercentage, formatDateTime } from '@/utils/formatters';
import { mockTransactions } from '@/mocks/mockTransactions';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/components/ui/Toast';

export default function DevShowcasePage() {
  const { toastInfo, toastSuccess } = useToast();
  // Tabs State
  const [activeTab, setActiveTab] = useState('overview');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Drawers
  const demoModal = useModal();
  const demoDrawer = useModal();
  const demoConfirm = useModal();

  // Filtered transactions sample
  const filteredData = mockTransactions.filter((tx) => {
    const matchesStatus = selectedStatus ? tx.status === selectedStatus : true;
    const matchesSearch = searchQuery
      ? tx.transactionRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.merchantName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  // Table Column Definitions
  const columns: ColumnDefinition<Transaction>[] = [
    {
      key: 'transactionRef',
      header: 'Txn Reference',
      render: (row) => (
        <span className="font-mono font-bold text-[var(--primary)]">{row.transactionRef}</span>
      ),
    },
    {
      key: 'merchantName',
      header: 'Merchant / Distributor',
      render: (row) => (
        <div>
          <div className="font-semibold">{row.merchantName}</div>
          <div className="text-[11px] text-[var(--text-muted)]">{row.distributorName || 'Direct'}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (row) => (
        <span className="font-bold text-[var(--text-primary)]">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'paymentMode',
      header: 'Mode',
      align: 'center',
      render: (row) => (
        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-sm text-[11px] font-semibold text-slate-700">
          {row.paymentMode}
        </span>
      ),
    },
    {
      key: 'accountNumberMasked',
      header: 'Account / Card',
      render: (row) => (
        <MaskedValue value={row.accountNumberMasked || '123456784582'} type="bankAccount" canCopy={false} />
      ),
    },
    {
      key: 'createdAt',
      header: 'Date & Time',
      render: (row) => formatDateTime(row.createdAt),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-app)] p-6 md:p-10 max-w-[1440px] mx-auto space-y-10">
      {/* Page Header */}
      <PageHeader
        title="QIN STAR PAY — Reusable Component Showcase"
        description="Phase 1 Design System, UI Components, Central Tokens, Financial Formatting & Security Foundations."
        breadcrumbs={[
          { label: 'Internal Development', href: '#' },
          { label: 'Component Showcase' },
        ]}
        statusBadge={<StatusBadge status="ACTIVE" label="PHASE 1 FOUNDATION" />}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => demoDrawer.open()}>
              Open Side Panel
            </Button>
            <Button variant="primary" size="sm" onClick={() => demoModal.open()} leftIcon={<Plus className="w-4 h-4" />}>
              Test Modal
            </Button>
          </div>
        }
      />

      {/* Financial KPI Cards */}
      <section className="space-y-4">
        <SectionHeader
          title="1. Financial KPI Cards"
          description="Operational KPI metric cards with tabular financial formatting."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Available Balance"
            value={formatCurrency(9953681.66)}
            accentColor="blue"
            icon={<CreditCard className="w-5 h-5" />}
            trend={{ value: '+12.4%', isPositive: true, label: 'vs last week' }}
          />
          <KPICard
            title="Total Pay-In Volume"
            value={formatCurrency(2500000.0)}
            accentColor="gold"
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ value: '+8.1%', isPositive: true, label: 'today' }}
          />
          <KPICard
            title="Successful Transactions"
            value={formatNumber(12480)}
            accentColor="green"
            icon={<ShieldCheck className="w-5 h-5" />}
            subtitle="12,480 total volume"
          />
          <KPICard
            title="Success Rate"
            value={formatPercentage(98.4)}
            accentColor="purple"
            icon={<Activity className="w-5 h-5" />}
            trend={{ value: '+0.3%', isPositive: true }}
          />
        </div>
      </section>

      {/* Status Badges */}
      <section className="space-y-4">
        <SectionHeader
          title="2. Centralized Status Badges"
          description="Status-to-color mapping for Transaction, KYC, and User lifecycle states."
        />
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status="SUCCESS" />
            <StatusBadge status="FAILED" />
            <StatusBadge status="PENDING" />
            <StatusBadge status="PROCESSING" />
            <StatusBadge status="REVERSED" />
            <StatusBadge status="REFUNDED" />
            <StatusBadge status="ACTIVE" />
            <StatusBadge status="INACTIVE" />
            <StatusBadge status="BLOCKED" />
            <StatusBadge status="APPROVED" />
            <StatusBadge status="UNDER_REVIEW" />
            <StatusBadge status="REJECTED" />
          </div>
        </Card>
      </section>

      {/* Buttons & Interactive Elements */}
      <section className="space-y-4">
        <SectionHeader
          title="3. Base Buttons & Variants"
          description="Consistent button sizes, states, icons, and loading states."
        />
        <Card className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger / Delete</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" isLoading>
              Processing
            </Button>
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              Export Report
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Sizes:</span>
            <Button variant="primary" size="sm">
              Small (32px)
            </Button>
            <Button variant="primary" size="md">
              Medium (40px)
            </Button>
            <Button variant="primary" size="lg">
              Large (44px)
            </Button>
          </div>
        </Card>
      </section>

      {/* Security & Financial Formatting Utilities */}
      <section className="space-y-4">
        <SectionHeader
          title="4. Security Masking & Financial Format Utilities"
          description="Protecting sensitive bank accounts, API keys, and phone numbers in UI."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Security Masking Examples">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Bank Account:</span>
                <MaskedValue value="123456784582" type="bankAccount" />
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">API Key:</span>
                <MaskedValue value="qsp_live_9981a2384bcd" type="apiKey" />
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Phone Number:</span>
                <MaskedValue value="+91 9876545678" type="phone" />
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-[var(--text-muted)]">User Email:</span>
                <MaskedValue value="john.doe@qinstarpay.com" type="email" />
              </div>
            </div>
          </Card>

          <Card title="INR Financial Formatting Examples">
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Standard Rupee (9953681.66):</span>
                <span className="font-mono font-bold text-[var(--primary)]">
                  {formatCurrency(9953681.66)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Compact Rupee (2500000):</span>
                <span className="font-mono font-bold text-[var(--accent-hover)]">
                  {formatCurrency(2500000, { compact: true })}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Formatted Count (124580):</span>
                <span className="font-mono font-semibold">{formatNumber(124580)} Txns</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[var(--text-muted)]">Success Rate (98.4):</span>
                <span className="font-mono font-bold text-emerald-700">{formatPercentage(98.4)}</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Input Controls & Filter Bar Container */}
      <section className="space-y-4">
        <SectionHeader
          title="5. Reusable Inputs, Selects & FilterBar Container"
          description="Form inputs, debounced search fields, and multi-criteria filter container."
        />
        <FilterBar
          searchSlot={
            <SearchInput
              placeholder="Search transactions by Ref or Merchant..."
              onDebouncedSearch={(val) => setSearchQuery(val)}
            />
          }
          activeFilterCount={selectedStatus ? 1 : 0}
          onReset={() => {
            setSelectedStatus('');
            setSearchQuery('');
          }}
        >
          <Select
            label="Transaction Status"
            placeholder="All Statuses"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: 'SUCCESS', label: 'Success' },
              { value: 'FAILED', label: 'Failed' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'PROCESSING', label: 'Processing' },
            ]}
          />
          <Input label="Merchant ID" placeholder="e.g. MCH_102" />
          <Input label="Date Range" type="date" />
          <Select
            label="Payment Mode"
            placeholder="All Modes"
            options={[
              { value: 'UPI', label: 'UPI' },
              { value: 'NEFT', label: 'NEFT' },
              { value: 'IMPS', label: 'IMPS' },
              { value: 'CARD', label: 'Card' },
            ]}
          />
        </FilterBar>
      </section>

      {/* Tabs & Data Table Sample */}
      <section className="space-y-4">
        <SectionHeader
          title="6. Data Table Foundation & Pagination"
          description="Scalable table foundation with column definitions, custom renderers, and pagination."
        />

        <Card noPadding>
          <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <Tabs
              activeTab={activeTab}
              onChange={setActiveTab}
              items={[
                { id: 'overview', label: 'All Transactions', badge: mockTransactions.length },
                { id: 'payin', label: 'Pay-In' },
                { id: 'payout', label: 'Pay-Out' },
                { id: 'failed', label: 'Failed / Escalated' },
              ]}
            />
          </div>

          <Table
            columns={columns}
            data={filteredData}
            keyExtractor={(row) => row.id}
            renderActions={(row) => (
              <>
                <Tooltip content="Inspect Details">
                  <Button variant="ghost" size="sm" onClick={() => demoDrawer.open(row)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="Flag / Revoke">
                  <Button variant="ghost" size="sm" onClick={() => demoConfirm.open()} className="text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Tooltip>
              </>
            )}
          />

          <div className="p-4 bg-[var(--bg-secondary)] rounded-b-[var(--radius-lg)]">
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              totalItems={50}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </Card>
      </section>

      {/* Loading Skeletons, Empty & Error States */}
      <section className="space-y-4">
        <SectionHeader
          title="7. Loading Skeletons, Empty & Error States"
          description="Standardized fallback and edge case components."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Loading Skeleton (Table Variant)">
            <LoadingSkeleton variant="table" count={3} />
          </Card>
          <Card title="Error & Empty State Components">
            <div className="space-y-4">
              <ErrorState
                title="API Connection Timeout"
                description="Unable to reach third-party routing engine. Please retry."
                onRetry={() => toastInfo('Retrying request...')}
              />
              <EmptyState
                title="No Chargebacks Logged"
                description="Your account currently has zero disputed or chargebacked transactions."
              />
            </div>
          </Card>
        </div>
      </section>

      {/* Interactive Modals & Drawers */}
      <Modal
        isOpen={demoModal.isOpen}
        onClose={demoModal.close}
        title="Payment Service Configuration"
        description="Internal development showcase modal testing."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={demoModal.close}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={demoModal.close}>
              Save Configuration
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Input label="Gateway Provider Name" placeholder="e.g. Razorpay / Cashfree" />
          <Input label="Webhook Secret URL" placeholder="https://api.qinstarpay.com/v1/webhook" />
          <Select
            label="Environment Mode"
            options={[
              { value: 'sandbox', label: 'Sandbox / Staging' },
              { value: 'production', label: 'Production Live' },
            ]}
          />
        </div>
      </Modal>

      <Drawer
        isOpen={demoDrawer.isOpen}
        onClose={demoDrawer.close}
        title="Transaction Details & Audit Trail"
        description="Inspect complete metadata and raw logs."
        footer={
          <Button variant="secondary" size="sm" onClick={demoDrawer.close}>
            Close Side Panel
          </Button>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-[var(--bg-secondary)] rounded-md border border-[var(--border)] space-y-1">
            <span className="text-[var(--text-muted)]">Reference Number:</span>
            <div className="font-mono font-bold text-sm text-[var(--primary)]">QSP20260903001</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span>Merchant Name:</span>
              <span className="font-semibold">Apex Pay Solutions</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span>Amount:</span>
              <span className="font-bold text-[var(--primary)]">{formatCurrency(15400.0)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span>Status:</span>
              <StatusBadge status="SUCCESS" size="sm" />
            </div>
          </div>
        </div>
      </Drawer>

      <ConfirmationDialog
        isOpen={demoConfirm.isOpen}
        onConfirm={() => {
          toastSuccess('Merchant access blocked successfully.');
          demoConfirm.close();
        }}
        onCancel={demoConfirm.close}
        title="Block Merchant Access?"
        message="Are you sure you want to suspend merchant 'Apex Pay Solutions'? This will stop all incoming Pay-In requests."
        variant="danger"
        confirmText="Block Merchant"
      />
    </div>
  );
}
