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
import { DEV_FEATURES } from '@/config/devFeatures';
import { normalizeEntityId } from '@/utils/identity';
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
  Zap,
  HelpCircle,
} from 'lucide-react';

type PayInStep = 1 | 2 | 3 | 4;

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

  // Resolve active transaction limit dynamically
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

  // 1. Live Calculation Preview Update
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
      setMobileError('Customer mobile number is required.');
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
      setAmountError('Amount must be a positive number greater than ₹0.');
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
      setAmountError(limitValidation.reason || 'Amount exceeds transaction limit.');
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
      toastError('Please fix the validation errors before proceeding.');
    }
  };

  // Execute Pay-In (Step 2 -> Step 3 -> Step 4)
  const handleConfirmPayIn = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStep(3); // Show Processing state

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
    <PageContainer
      title="Retailer Pay-In Collections"
      description="Accept and process customer collection transactions, generate digital receipts, and earn commission."
      statusBadge={<StatusBadge status="ACTIVE" label="Approved Retailer" />}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Stepper Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className={`py-2 px-3 rounded-lg font-bold border transition-all ${step === 1 ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs' : step > 1 ? 'bg-slate-50 text-slate-700 border-slate-200' : 'text-slate-400 border-transparent'}`}>
              <span className="font-mono mr-1.5">1.</span> Details
            </div>
            <div className={`py-2 px-3 rounded-lg font-bold border transition-all ${step === 2 ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs' : step > 2 ? 'bg-slate-50 text-slate-700 border-slate-200' : 'text-slate-400 border-transparent'}`}>
              <span className="font-mono mr-1.5">2.</span> Review
            </div>
            <div className={`py-2 px-3 rounded-lg font-bold border transition-all ${step === 3 ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs animate-pulse' : step > 3 ? 'bg-slate-50 text-slate-700 border-slate-200' : 'text-slate-400 border-transparent'}`}>
              <span className="font-mono mr-1.5">3.</span> Processing
            </div>
            <div className={`py-2 px-3 rounded-lg font-bold border transition-all ${step === 4 ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs' : 'text-slate-400 border-transparent'}`}>
              <span className="font-mono mr-1.5">4.</span> Result / Receipt
            </div>
          </div>
        </div>

        {/* STEP 1: TRANSACTION / CUSTOMER DETAILS */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                    <span>Customer Pay-In Details</span>
                  </div>
                }
                subtitle="Enter customer information and collection amount"
              >
                <form onSubmit={handleProceedToReview} className="space-y-4 pt-1">
                  {/* Customer Mobile */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Customer Mobile Number <span className="text-rose-500">*</span>
                    </label>
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
                      className={`w-full px-3 py-2 text-xs font-mono border rounded-lg focus:outline-hidden focus:ring-2 ${
                        mobileError
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-300 focus:ring-emerald-200'
                      }`}
                    />
                    {mobileError && <p className="text-[11px] text-rose-600 font-medium mt-0.5">{mobileError}</p>}
                  </div>

                  {/* Customer Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Customer Name <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  {/* Customer Reference */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Consumer / Order Reference <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={customerReference}
                      onChange={(e) => setCustomerReference(e.target.value)}
                      placeholder="e.g. BILL_889120"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  {/* Service & Payment Mode Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Service Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-200 bg-white"
                      >
                        {PAY_IN_SERVICES.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Payment Mode <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-200 bg-white font-mono"
                      >
                        {PAY_IN_PAYMENT_MODES.map((m) => (
                          <option key={m.id} value={m.code}>
                            {m.name} ({m.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Collection Amount */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Collection Amount (₹) <span className="text-rose-500">*</span>
                      </label>
                      {activeLimit && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          Limit: ₹{activeLimit.minPerTransaction} - ₹{activeLimit.maxPerTransaction.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
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
                        placeholder="1000"
                        className={`w-full pl-7 pr-3 py-2 text-sm font-mono font-bold border rounded-lg focus:outline-hidden focus:ring-2 ${
                          amountError
                            ? 'border-rose-400 focus:ring-rose-200'
                            : 'border-slate-300 focus:ring-emerald-200'
                        }`}
                      />
                    </div>
                    {amountError && <p className="text-[11px] text-rose-600 font-medium mt-0.5">{amountError}</p>}
                  </div>

                  {/* Remarks */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Remarks / Notes <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Counter deposit collection"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  {/* Dev Scenario Selector (Centralized Flag Guarded) */}
                  {DEV_FEATURES.showTransactionOutcomeSelector && (
                    <div className="p-3 rounded-lg border border-indigo-200 bg-indigo-50/50 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-indigo-600" /> Dev QA Result Selector
                        </span>
                        <span className="text-[10px] text-indigo-600 font-medium">Demo Testing Only</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        {(['AUTO', 'SUCCESS', 'PENDING', 'FAILED'] as const).map((scen) => (
                          <label key={scen} className="flex items-center gap-1 font-semibold cursor-pointer text-indigo-950">
                            <input
                              type="radio"
                              name="mockScenario"
                              value={scen}
                              checked={mockScenario === scen}
                              onChange={() => setMockScenario(scen)}
                              className="text-indigo-600 focus:ring-indigo-400"
                            />
                            <span>{scen}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      size="md"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continue to Review
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Right Column: Live Financial Preview Card */}
            <div className="lg:col-span-1 space-y-4">
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-emerald-600" />
                    <span>Live Financial Preview</span>
                  </div>
                }
                subtitle="Calculated fee, tax & commission breakdown"
              >
                {preview ? (
                  <div className="space-y-4 text-xs pt-1">
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Transaction Amount:</span>
                        <span className="font-mono font-bold text-slate-900">{formatCurrency(preview.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Platform Charges:</span>
                        <span className="font-mono">{formatCurrency(preview.charges)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">GST (18%):</span>
                        <span className="font-mono">{formatCurrency(preview.gst)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                        <span>Total Customer Paid:</span>
                        <span className="font-mono text-indigo-600">{formatCurrency(preview.totalAmount)}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 space-y-1">
                      <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5 text-emerald-600" /> Retailer Commission Margin
                      </p>
                      <div className="flex justify-between items-baseline pt-1">
                        <span className="text-xs text-emerald-700">Rate: {preview.retailerCommissionRate}</span>
                        <span className="font-mono font-bold text-base text-emerald-700">
                          +{formatCurrency(preview.retailerCommissionAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Assigned Plan</p>
                      <p className="font-semibold text-slate-900">{preview.planName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">Code: {preview.planCode}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Enter amount to generate financial preview.
                  </div>
                )}
              </Card>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 text-blue-900 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-blue-950">Pay-In Commercial Rules</span>
                  All collection transactions are governed by your assigned Retailer Plan commission structure and NPCI clearing guidelines.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: REVIEW & CONFIRMATION */}
        {step === 2 && preview && (
          <Card
            title="Review Pay-In Collection Details"
            subtitle="Verify transaction breakdown and customer details before confirming"
          >
            <div className="space-y-6 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Customer Information</h4>
                  <div className="space-y-1 text-slate-900">
                    <p><span className="text-slate-500">Mobile:</span> <strong className="font-mono">{customerMobile}</strong></p>
                    <p><span className="text-slate-500">Name:</span> <strong>{customerName || 'Walk-in Customer'}</strong></p>
                    {customerReference && (
                      <p><span className="text-slate-500">Reference:</span> <strong className="font-mono">{customerReference}</strong></p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Service & Mode</h4>
                  <div className="space-y-1 text-slate-900">
                    <p><span className="text-slate-500">Service:</span> <strong>{serviceType}</strong></p>
                    <p><span className="text-slate-500">Payment Mode:</span> <strong className="font-mono">{paymentMode}</strong></p>
                    {remarks && <p><span className="text-slate-500">Remarks:</span> <span>{remarks}</span></p>}
                  </div>
                </div>
              </div>

              {/* Financial Calculation Review Box */}
              <div className="p-5 rounded-2xl border border-indigo-200 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white space-y-4">
                <h4 className="font-bold text-indigo-300 text-xs uppercase tracking-wider">Financial Breakdown</h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 text-xs">
                  <div>
                    <span className="text-indigo-200 block text-[11px]">Collection Amount</span>
                    <span className="text-2xl font-bold font-mono text-white">{formatCurrency(preview.amount)}</span>
                  </div>

                  <div>
                    <span className="text-indigo-200 block text-[11px]">Platform Charges</span>
                    <span className="text-lg font-bold font-mono text-indigo-200">{formatCurrency(preview.charges)}</span>
                  </div>

                  <div>
                    <span className="text-indigo-200 block text-[11px]">GST (18%)</span>
                    <span className="text-lg font-bold font-mono text-indigo-200">{formatCurrency(preview.gst)}</span>
                  </div>

                  <div>
                    <span className="text-indigo-200 block text-[11px]">Retailer Commission</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">+{formatCurrency(preview.retailerCommissionAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-indigo-800 text-xs text-indigo-200">
                  <span>Total Amount Paid by Customer: <strong className="text-white font-mono text-base ml-2">{formatCurrency(preview.totalAmount)}</strong></span>
                  <span className="font-mono text-[11px]">Plan: {preview.planName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
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
                  onClick={handleConfirmPayIn}
                  isLoading={isSubmitting}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Confirm & Process Pay-In
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* STEP 3: PROCESSING STATE */}
        {step === 3 && (
          <Card title="Processing Pay-In Collection">
            <div className="py-12 px-4 text-center space-y-4 max-w-md mx-auto">
              <div className="p-4 rounded-full bg-emerald-50 border border-emerald-200 w-16 h-16 mx-auto flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Processing Pay-In Transaction...</h3>
                <p className="text-xs text-slate-500">
                  Validating parameters and submitting collection request to simulated payment gateway.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border rounded-lg text-[11px] font-mono text-slate-600">
                Please do not refresh or navigate away from this page.
              </div>
            </div>
          </Card>
        )}

        {/* STEP 4: RESULT / RECEIPT */}
        {step === 4 && executionResult && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div
              className={`p-5 rounded-2xl border text-white shadow-md flex items-start justify-between gap-4 ${
                executionResult.status === 'SUCCESS'
                  ? 'bg-gradient-to-r from-emerald-800 to-slate-900 border-emerald-300'
                  : executionResult.status === 'PENDING'
                  ? 'bg-gradient-to-r from-amber-800 to-slate-900 border-amber-300'
                  : 'bg-gradient-to-r from-rose-900 to-slate-900 border-rose-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 backdrop-blur-xs">
                    Pay-In Collection Status
                  </span>
                  <StatusBadge status={executionResult.status} label={executionResult.status} size="sm" />
                </div>
                <h2 className="text-2xl font-extrabold text-white mt-1">
                  {executionResult.status === 'SUCCESS'
                    ? 'Pay-In Collection Successful!'
                    : executionResult.status === 'PENDING'
                    ? 'Pay-In Collection Submitted & Pending'
                    : 'Pay-In Transaction Failed'}
                </h2>
                <p className="text-xs text-slate-200">{executionResult.message}</p>
              </div>

              {executionResult.status === 'SUCCESS' && (
                <div className="text-right shrink-0">
                  <span className="text-xs text-emerald-300 block">Retailer Margin Earned</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    +{formatCurrency(executionResult.earnedCommission || 0)}
                  </span>
                </div>
              )}
            </div>

            {/* Reusable Pay-In Receipt */}
            <PayInReceipt
              transaction={executionResult.transaction}
              preview={executionResult.preview}
              retailerName={session?.name || 'Metro Store #01'}
              retailerCode={session?.entityId || 'RET001'}
              businessName="Metro Store Retail Solutions"
            />

            {/* Result Bottom Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <Button variant="outline" size="md" onClick={handleResetForm} leftIcon={<RefreshCw className="w-4 h-4" />}>
                New Pay-In Collection
              </Button>

              <Link href="/retailer/transactions">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View All Transactions
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
