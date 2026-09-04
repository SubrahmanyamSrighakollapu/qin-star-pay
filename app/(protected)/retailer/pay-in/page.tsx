'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui';
import { payInService, PayInPreviewResult, PayInExecutionResult } from '@/services/payInService';
import { adminService } from '@/services/adminService';
import { PAY_IN_SERVICES, PAY_IN_PAYMENT_MODES } from '@/constants/serviceMasters';
import { PayInReceipt } from '@/components/features/retailer/PayInReceipt';
import { formatCurrency } from '@/utils/formatters';
import { normalizeEntityId } from '@/utils/identity';

// Shared Transaction Components
import { TransactionHeader } from '@/components/features/transactions/TransactionHeader';
import { TransactionStepIndicator, StepItem } from '@/components/features/transactions/TransactionStepIndicator';
import { DeveloperTestControls } from '@/components/features/transactions/DeveloperTestControls';
import { TransactionProcessingState } from '@/components/features/transactions/TransactionProcessingState';
import { TransactionSecurityNotice } from '@/components/features/transactions/TransactionSecurityNotice';

import {
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  Percent,
  Wallet,
  User,
  CreditCard,
  Phone,
  FileText,
  Building2,
  Sparkles,
  Check,
} from 'lucide-react';

type PayInStep = 1 | 2 | 3 | 4;

const PAY_IN_STEPS: StepItem[] = [
  { step: 1, label: 'Details', description: 'Customer & Payment' },
  { step: 2, label: 'Review', description: 'Verify & Confirm' },
  { step: 3, label: 'Processing', description: 'Payment Clearance' },
  { step: 4, label: 'Receipt', description: 'Receipt & Summary' },
];

export default function RetailerPayInPage() {
  const { session } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const retailerId = normalizeEntityId(session?.entityId || 'RET001');

  // Step State
  const [step, setStep] = useState<PayInStep>(1);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerReference, setCustomerReference] = useState('');
  const [serviceType, setServiceType] = useState('UPI Pay-In Collection');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [amountStr, setAmountStr] = useState('1000');
  const [remarks, setRemarks] = useState('');
  const [mockScenario, setMockScenario] = useState<'AUTO' | 'SUCCESS' | 'PENDING' | 'FAILED'>('SUCCESS');

  // Resolved Limit State
  const [activeLimit, setActiveLimit] = useState<{ minPerTransaction: number; maxPerTransaction: number } | null>(null);

  // Validation State
  const [mobileError, setMobileError] = useState('');
  const [amountError, setAmountError] = useState('');

  // Calculation & Execution Result State
  const [preview, setPreview] = useState<PayInPreviewResult | null>(null);
  const [executionResult, setExecutionResult] = useState<PayInExecutionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resolve active transaction limit dynamically from adminService
  useEffect(() => {
    const limit = adminService.resolveEffectiveLimit({
      entityType: 'RETAILER',
      entityId: retailerId,
      transactionType: 'PAY_IN',
      paymentMode,
    });
    setActiveLimit({
      minPerTransaction: limit.minPerTransaction || 10,
      maxPerTransaction: limit.maxPerTransaction || 200000,
    });
  }, [retailerId, paymentMode]);

  // Live Calculation Preview Update
  useEffect(() => {
    let isMounted = true;
    async function updatePreview() {
      const numAmount = parseFloat(amountStr) || 0;
      if (numAmount > 0) {
        const res = await payInService.calculatePayInPreview(retailerId, {
          amount: numAmount,
          serviceType,
          paymentMode,
        });
        if (isMounted && res.success && res.data) {
          setPreview(res.data);
        }
      } else {
        if (isMounted) setPreview(null);
      }
    }
    updatePreview();
    return () => {
      isMounted = false;
    };
  }, [retailerId, amountStr, serviceType, paymentMode]);

  // Mobile Validation Helper
  const validateMobile = (val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      setMobileError('Enter a valid 10-digit customer mobile number.');
      return false;
    }
    if (clean.length !== 10) {
      setMobileError('Mobile number must be exactly 10 digits.');
      return false;
    }
    setMobileError('');
    return true;
  };

  // Amount Validation Helper (Centralized Admin Limit Resolution)
  const validateAmount = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
      setAmountError('Enter a valid collection amount greater than ₹0.');
      return false;
    }

    const limitValidation = adminService.validateTransactionLimit({
      entityType: 'RETAILER',
      entityId: retailerId,
      transactionType: 'PAY_IN',
      paymentMode,
      amount: num,
    });

    if (!limitValidation.allowed) {
      setAmountError(limitValidation.reason || 'Amount exceeds allowed transaction limit.');
      return false;
    }

    setAmountError('');
    return true;
  };

  // Proceed to Step 2 (Review)
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    const isMobValid = validateMobile(customerMobile);
    const isAmtValid = validateAmount(amountStr);

    if (isMobValid && isAmtValid) {
      setStep(2);
    } else {
      toastError('Please fix validation errors before proceeding.');
    }
  };

  // Execute Pay-In (Step 2 -> Step 3 -> Step 4)
  const handleConfirmPayIn = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStep(3); // Move to Processing screen

    try {
      const res = await payInService.executeMockPayInTransaction(retailerId, {
        customerName: customerName.trim() || undefined,
        customerMobile: customerMobile.trim(),
        customerReference: customerReference.trim() || undefined,
        serviceType,
        paymentMode,
        amount: parseFloat(amountStr),
        remarks: remarks.trim() || undefined,
        mockScenario,
      });

      if (res.success && res.data) {
        setExecutionResult(res.data);
        setStep(4); // Move to Result / Receipt screen
        if (res.data.status === 'SUCCESS') {
          toastSuccess('Pay-In collection completed successfully!');
        } else if (res.data.status === 'PENDING') {
          toastSuccess('Pay-In submitted and pending clearance.');
        } else {
          toastError('Pay-In transaction failed at provider switch.');
        }
      } else {
        toastError(res.error?.message || 'Failed to process transaction.');
        setStep(2);
      }
    } catch (err) {
      console.error('Pay-In execution error:', err);
      toastError('An unexpected error occurred during execution.');
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Form for New Pay-In
  const handleResetForm = () => {
    setCustomerName('');
    setCustomerMobile('');
    setCustomerReference('');
    setAmountStr('1000');
    setRemarks('');
    setMobileError('');
    setAmountError('');
    setExecutionResult(null);
    setStep(1);
  };

  return (
    <PageContainer>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Page Header */}
        <TransactionHeader
          type="PAY_IN"
          title="Retailer Pay-In"
          subtitle="Collect customer payments securely"
          retailerId={retailerId}
          walletBalance={45350}
          assignedPlan={preview?.planName || 'Standard Retailer Plan'}
        />

        {/* Reusable Visual Stepper */}
        <TransactionStepIndicator currentStep={step} steps={PAY_IN_STEPS} type="PAY_IN" />

        {/* STEP 1: TRANSACTION ENTRY & LIVE PREVIEW */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Column (~68% on Desktop) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
                <form onSubmit={handleProceedToReview} className="space-y-6">
                  {/* SECTION 1: Customer Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#0F4C81] flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Customer Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Customer Mobile */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Customer Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            maxLength={10}
                            value={customerMobile}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setCustomerMobile(val);
                              if (val.length === 10) setMobileError('');
                            }}
                            onBlur={() => validateMobile(customerMobile)}
                            placeholder="e.g. 9876543210"
                            className={`w-full pl-10 pr-3.5 py-2.5 text-xs font-mono h-11 border rounded-xl focus:outline-hidden focus:ring-2 transition-all ${
                              mobileError
                                ? 'border-rose-400 focus:ring-rose-100 bg-rose-50/20'
                                : 'border-slate-300 focus:border-[#0F4C81] focus:ring-indigo-100 bg-white'
                            }`}
                          />
                        </div>
                        {mobileError && (
                          <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {mobileError}
                          </p>
                        )}
                      </div>

                      {/* Customer Name */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Customer Name <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="e.g. Rajesh Kumar"
                            className="w-full pl-10 pr-3.5 py-2.5 text-xs h-11 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0F4C81] focus:ring-2 focus:ring-indigo-100 bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Payment Parameters */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#0F4C81] flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Payment & Service
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Service Category */}
                      <div className="space-y-1.5 sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-700">
                          Service Category <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs h-11 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0F4C81] focus:ring-2 focus:ring-indigo-100 bg-white transition-all"
                        >
                          {PAY_IN_SERVICES.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Payment Mode */}
                      <div className="space-y-1.5 sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-700">
                          Payment Mode <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={paymentMode}
                          onChange={(e) => setPaymentMode(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs font-mono h-11 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0F4C81] focus:ring-2 focus:ring-indigo-100 bg-white transition-all"
                        >
                          {PAY_IN_PAYMENT_MODES.map((m) => (
                            <option key={m.id} value={m.code}>
                              {m.name} ({m.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Consumer / Order Reference */}
                      <div className="space-y-1.5 sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-700">
                          Order / Bill Ref <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            value={customerReference}
                            onChange={(e) => setCustomerReference(e.target.value)}
                            placeholder="e.g. BILL_8891"
                            className="w-full pl-10 pr-3.5 py-2.5 text-xs font-mono h-11 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0F4C81] focus:ring-2 focus:ring-indigo-100 bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Prominent Amount Field */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#0F4C81] flex items-center justify-center font-bold text-xs">
                          3
                        </div>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                          Collection Amount
                        </h2>
                      </div>
                      {activeLimit && (
                        <span className="text-[11px] font-mono font-medium text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-lg">
                          Allowed range: ₹{activeLimit.minPerTransaction} — ₹{activeLimit.maxPerTransaction.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-slate-400 font-extrabold text-xl font-mono">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={amountStr}
                          onChange={(e) => {
                            setAmountStr(e.target.value);
                            if (parseFloat(e.target.value) > 0) setAmountError('');
                          }}
                          onBlur={() => validateAmount(amountStr)}
                          placeholder="10,000.00"
                          className={`w-full pl-10 pr-4 h-14 text-2xl font-bold font-mono border rounded-xl focus:outline-hidden focus:ring-2 transition-all ${
                            amountError
                              ? 'border-rose-400 focus:ring-rose-100 bg-rose-50/20 text-rose-900'
                              : 'border-slate-300 focus:border-[#0F4C81] focus:ring-indigo-100 bg-slate-50/30 text-slate-900'
                          }`}
                        />
                      </div>
                      {amountError && (
                        <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 pt-1">
                          <AlertTriangle className="w-3 h-3" /> {amountError}
                        </p>
                      )}
                    </div>

                    {/* Remarks / Notes */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Remarks / Transaction Notes <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="e.g. Over-the-counter customer payment collection"
                        className="w-full px-3.5 py-2.5 text-xs h-11 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#0F4C81] focus:ring-2 focus:ring-indigo-100 bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Primary CTA Button */}
                  <div className="pt-4 space-y-3">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      className="h-12 text-sm font-bold bg-[#0F4C81] hover:bg-indigo-900 text-white shadow-sm"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continue to Review
                    </Button>
                    <TransactionSecurityNotice />
                  </div>
                </form>

                {/* Gated Dev QA Outcome Panel */}
                <DeveloperTestControls mockScenario={mockScenario} onScenarioChange={setMockScenario} />
              </div>
            </div>

            {/* Right Column: Sticky Live Financial Preview (~32% on Desktop) */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#0F4C81] flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Payment Summary</h3>
                      <p className="text-[11px] text-slate-500">Live commercial preview</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {paymentMode}
                  </span>
                </div>

                {preview ? (
                  <div className="space-y-4 text-xs">
                    {/* Collection Breakdown */}
                    <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono">
                      <div className="flex justify-between text-slate-600">
                        <span>Collection Amount:</span>
                        <span className="font-bold text-slate-900">{formatCurrency(preview.amount)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Platform Charges:</span>
                        <span>{formatCurrency(preview.charges)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>GST (18%):</span>
                        <span>{formatCurrency(preview.gst)}</span>
                      </div>

                      <div className="pt-2.5 border-t border-slate-200/80 flex justify-between items-center text-slate-900 font-sans">
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-700">Customer Pays</span>
                        <span className="font-mono text-base font-extrabold text-[#0F4C81]">
                          {formatCurrency(preview.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Distinct Retailer Earnings Box */}
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Your Commission
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700">{preview.retailerCommissionRate}</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-1">
                        <span className="text-xs text-emerald-800 font-medium">Retailer earnings</span>
                        <span className="font-mono font-extrabold text-lg text-emerald-700">
                          +{formatCurrency(preview.retailerCommissionAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Assigned Plan Context */}
                    <div className="p-3 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Commercial Plan</span>
                        <span className="font-bold text-slate-800">{preview.planName}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {preview.planCode}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                    <p>Enter collection amount to view breakdown.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: REVIEW & CONFIRMATION SCREEN */}
        {step === 2 && preview && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Review Pay-In Collection</h2>
                  <p className="text-xs text-slate-500">Please verify customer details and financial totals before confirming.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-[#0F4C81] border border-indigo-200">
                  {paymentMode} Collection
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Customer Details Box */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#0F4C81]" /> Customer & Transaction Details
                  </h3>
                  <div className="space-y-2 text-slate-800 font-mono text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500 font-sans">Mobile:</span>
                      <span className="font-bold text-slate-900">{customerMobile}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500 font-sans">Customer Name:</span>
                      <span className="font-semibold font-sans">{customerName || 'Walk-in Customer'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500 font-sans">Service Category:</span>
                      <span className="font-semibold font-sans">{serviceType}</span>
                    </div>
                    {customerReference && (
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500 font-sans">Order Ref:</span>
                        <span className="font-bold text-[#0F4C81]">{customerReference}</span>
                      </div>
                    )}
                    {remarks && (
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500 font-sans">Remarks:</span>
                        <span className="font-sans text-slate-700">{remarks}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Breakdown Box */}
                <div className="p-4 rounded-xl border border-indigo-200 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white space-y-3">
                  <h3 className="font-bold text-indigo-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-indigo-400" /> Commercial Summary
                  </h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-indigo-800/80">
                      <span className="text-indigo-200 font-sans">Collection Principal:</span>
                      <span className="font-bold text-white">{formatCurrency(preview.amount)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-indigo-800/80">
                      <span className="text-indigo-200 font-sans">Platform Charges:</span>
                      <span>{formatCurrency(preview.charges)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-indigo-800/80">
                      <span className="text-indigo-200 font-sans">GST (18%):</span>
                      <span>{formatCurrency(preview.gst)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 text-sm font-bold text-white border-b border-indigo-800">
                      <span className="font-sans">Total Customer Paid:</span>
                      <span className="text-indigo-300 font-mono text-base">{formatCurrency(preview.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-emerald-400 font-bold">
                      <span className="font-sans">Your Retailer Commission:</span>
                      <span>+{formatCurrency(preview.retailerCommissionAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setStep(1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  disabled={isSubmitting}
                >
                  Back to Edit
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  className="bg-[#0F4C81] hover:bg-indigo-900 text-white font-bold px-6 shadow-sm"
                  onClick={handleConfirmPayIn}
                  isLoading={isSubmitting}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Confirm Pay-In
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PROCESSING STATE */}
        {step === 3 && (
          <TransactionProcessingState
            type="PAY_IN"
            amount={parseFloat(amountStr) || 1000}
            paymentMode={paymentMode}
            serviceType={serviceType}
            reference={customerReference}
            customerMobile={customerMobile}
          />
        )}

        {/* STEP 4: RESULT / RECEIPT */}
        {step === 4 && executionResult && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Status Banner */}
            <div
              className={`p-6 rounded-2xl border text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                executionResult.status === 'SUCCESS'
                  ? 'bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 border-emerald-300/40'
                  : executionResult.status === 'PENDING'
                  ? 'bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 border-amber-300/40'
                  : 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-900 border-rose-300/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {executionResult.status === 'SUCCESS' && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                  {executionResult.status === 'PENDING' && <Clock className="w-6 h-6 text-amber-400" />}
                  {executionResult.status === 'FAILED' && <AlertTriangle className="w-6 h-6 text-rose-400" />}
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 backdrop-blur-xs">
                    Pay-In Collection Status
                  </span>
                  <StatusBadge status={executionResult.status} label={executionResult.status} size="sm" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
                  {executionResult.status === 'SUCCESS'
                    ? 'Payment Successful'
                    : executionResult.status === 'PENDING'
                    ? 'Payment Processing / Pending'
                    : 'Payment Failed'}
                </h2>
                <p className="text-xs text-slate-300">{executionResult.message}</p>
              </div>

              {executionResult.status === 'SUCCESS' && (
                <div className="text-left sm:text-right shrink-0 font-mono border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
                  <span className="text-xs text-emerald-300 block font-sans">Retailer Margin Earned</span>
                  <span className="text-2xl font-extrabold text-emerald-400">
                    +{formatCurrency(executionResult.earnedCommission || 0)}
                  </span>
                </div>
              )}
            </div>

            {/* Customer Safe Printable Receipt */}
            <PayInReceipt
              transaction={executionResult.transaction}
              preview={executionResult.preview}
              retailerName={session?.name || 'Metro Store #01'}
              retailerCode={session?.entityId || 'RET001'}
              businessName="Metro Store Retail Solutions"
            />

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/90 bg-white shadow-xs">
              <Button variant="outline" size="md" onClick={handleResetForm} leftIcon={<RefreshCw className="w-4 h-4" />}>
                New Pay-In Collection
              </Button>

              <Link href="/retailer/transactions">
                <Button variant="primary" size="md" className="bg-[#0F4C81] text-white" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View Transactions
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
