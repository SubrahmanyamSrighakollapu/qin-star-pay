'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui';
import { payOutService, PayOutPreviewResult, PayOutExecutionResult } from '@/services/payOutService';
import { adminService } from '@/services/adminService';
import { PAY_OUT_SERVICES, PAY_OUT_PAYMENT_MODES } from '@/constants/serviceMasters';
import { PayOutReceipt } from '@/components/features/retailer/PayOutReceipt';
import { formatCurrency } from '@/utils/formatters';
import { DEV_FEATURES } from '@/config/devFeatures';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  Wallet,
  Building2,
  UserCheck,
  CreditCard,
} from 'lucide-react';

import { normalizeEntityId } from '@/utils/identity';

type PayOutStep = 1 | 2 | 3 | 4;

export default function RetailerPayOutPage() {
  const { session } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const retailerId = normalizeEntityId(session?.entityId || 'RET001');

  // Step State
  const [step, setStep] = useState<PayOutStep>(1);

  // Form State
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryMobile, setBeneficiaryMobile] = useState('');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const [confirmAccount, setConfirmAccount] = useState('');
  const [beneficiaryIfsc, setBeneficiaryIfsc] = useState('');
  const [bankName, setBankName] = useState('State Bank of India');
  const [serviceType, setServiceType] = useState('Bank Account Disbursement');
  const [paymentMode, setPaymentMode] = useState('IMPS');
  const [amountStr, setAmountStr] = useState('5000');
  const [beneficiaryReference, setBeneficiaryReference] = useState('');
  const [remarks, setRemarks] = useState('');
  const [mockScenario, setMockScenario] = useState<'AUTO' | 'SUCCESS' | 'PENDING' | 'FAILED'>('SUCCESS');

  // Resolved Limit State
  const [activeLimit, setActiveLimit] = useState<{ minPerTransaction: number; maxPerTransaction: number } | null>(null);

  // Validation State Errors
  const [nameError, setNameError] = useState('');
  const [accountError, setAccountError] = useState('');
  const [confirmAccountError, setConfirmAccountError] = useState('');
  const [ifscError, setIfscError] = useState('');
  const [amountError, setAmountError] = useState('');

  // Calculation & Execution Result State
  const [preview, setPreview] = useState<PayOutPreviewResult | null>(null);
  const [executionResult, setExecutionResult] = useState<PayOutExecutionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resolve active transaction limit dynamically
  useEffect(() => {
    const limit = adminService.resolveEffectiveLimit({
      entityType: 'RETAILER',
      entityId: retailerId,
      transactionType: 'PAY_OUT',
      paymentMode,
    });

    let minAmt = limit.minPerTransaction || 10;
    if (paymentMode === 'RTGS') {
      minAmt = Math.max(minAmt, 200000); // RTGS min 2,00,000 rule
    }

    setActiveLimit({
      minPerTransaction: minAmt,
      maxPerTransaction: limit.maxPerTransaction || 200000,
    });
  }, [retailerId, paymentMode]);

  // Derive Bank Name from IFSC prefix (Mock resolver)
  useEffect(() => {
    const cleanIfsc = beneficiaryIfsc.trim().toUpperCase();
    if (cleanIfsc.startsWith('SBIN')) setBankName('State Bank of India');
    else if (cleanIfsc.startsWith('HDFC')) setBankName('HDFC Bank');
    else if (cleanIfsc.startsWith('ICIC')) setBankName('ICICI Bank');
    else if (cleanIfsc.startsWith('UTIB')) setBankName('Axis Bank');
    else if (cleanIfsc.startsWith('PUNB')) setBankName('Punjab National Bank');
    else if (cleanIfsc.length >= 4) setBankName(`${cleanIfsc.slice(0, 4)} Bank`);
  }, [beneficiaryIfsc]);

  // Live Calculation Preview Update
  useEffect(() => {
    let isMounted = true;
    async function updatePreview() {
      const numAmount = parseFloat(amountStr) || 0;
      if (numAmount > 0) {
        const res = await payOutService.calculatePayOutPreview(retailerId, {
          amount: numAmount,
          paymentMode,
          serviceType,
          beneficiaryAccount,
          beneficiaryIfsc,
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
  }, [retailerId, amountStr, paymentMode, serviceType, beneficiaryAccount, beneficiaryIfsc]);

  // Form Field Validation Helpers
  const validateName = (val: string) => {
    if (!val.trim()) {
      setNameError('Beneficiary name is required.');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateAccount = (val: string) => {
    const clean = val.replace(/\s+/g, '');
    if (!clean) {
      setAccountError('Bank account number is required.');
      return false;
    }
    if (clean.length < 9 || clean.length > 18) {
      setAccountError('Account number must be between 9 and 18 digits.');
      return false;
    }
    setAccountError('');
    return true;
  };

  const validateConfirmAccount = (val: string, originalAcc: string) => {
    if (!val.trim()) {
      setConfirmAccountError('Please confirm the account number.');
      return false;
    }
    if (val.trim() !== originalAcc.trim()) {
      setConfirmAccountError('Account numbers do not match.');
      return false;
    }
    setConfirmAccountError('');
    return true;
  };

  const validateIfsc = (val: string) => {
    const clean = val.trim().toUpperCase();
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!clean) {
      setIfscError('IFSC code is required.');
      return false;
    }
    if (!ifscRegex.test(clean)) {
      setIfscError('Invalid IFSC format (e.g. SBIN0001234: 4 letters, 0, 6 alphanumeric).');
      return false;
    }
    setIfscError('');
    return true;
  };

  const validateAmount = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
      setAmountError('Amount must be a positive number greater than ₹0.');
      return false;
    }

    if (paymentMode === 'RTGS' && num < 200000) {
      setAmountError('RTGS disbursements require a minimum transfer amount of ₹2,00,000.');
      return false;
    }

    const limitValidation = adminService.validateTransactionLimit({
      entityType: 'RETAILER',
      entityId: retailerId,
      transactionType: 'PAY_OUT',
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
    const isNameValid = validateName(beneficiaryName);
    const isAccValid = validateAccount(beneficiaryAccount);
    const isConfirmValid = validateConfirmAccount(confirmAccount, beneficiaryAccount);
    const isIfscValid = validateIfsc(beneficiaryIfsc);
    const isAmtValid = validateAmount(amountStr);

    if (isNameValid && isAccValid && isConfirmValid && isIfscValid && isAmtValid) {
      if (preview && !preview.isWalletSufficient) {
        toastError(`Insufficient wallet balance. Shortfall: ₹${preview.shortfall.toLocaleString('en-IN')}`);
        return;
      }
      setStep(2);
    } else {
      toastError('Please fix the validation errors before proceeding.');
    }
  };

  // Execute Pay-Out (Step 2 -> Step 3 -> Step 4)
  const handleConfirmPayOut = async () => {
    if (isSubmitting) return;

    if (preview && !preview.isWalletSufficient) {
      toastError('Cannot proceed: Insufficient wallet balance.');
      return;
    }

    setIsSubmitting(true);
    setStep(3); // Show Processing state

    try {
      const res = await payOutService.executeMockPayOutTransaction(retailerId, {
        beneficiaryName: beneficiaryName.trim(),
        beneficiaryMobile: beneficiaryMobile.trim() || undefined,
        beneficiaryAccount: beneficiaryAccount.trim(),
        beneficiaryIfsc: beneficiaryIfsc.trim().toUpperCase(),
        bankName,
        paymentMode,
        amount: parseFloat(amountStr),
        serviceType,
        beneficiaryReference: beneficiaryReference.trim() || undefined,
        remarks: remarks.trim() || undefined,
        mockScenario,
      });

      if (res.success && res.data) {
        setExecutionResult(res.data);
        setStep(4); // Move to Result / Receipt screen
        if (res.data.status === 'SUCCESS') {
          toastSuccess('Pay-Out disbursement completed successfully!');
        } else if (res.data.status === 'PENDING') {
          toastSuccess('Pay-Out submitted and pending bank clearance.');
        } else {
          toastError('Pay-Out transaction failed at bank gateway.');
        }
      } else {
        toastError(res.error?.message || 'Failed to process Pay-Out transaction.');
        setStep(2);
      }
    } catch (err) {
      console.error('Pay-Out execution error:', err);
      toastError('An unexpected error occurred during execution.');
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Form for New Pay-Out
  const handleResetForm = () => {
    setBeneficiaryName('');
    setBeneficiaryMobile('');
    setBeneficiaryAccount('');
    setConfirmAccount('');
    setBeneficiaryIfsc('');
    setAmountStr('5000');
    setBeneficiaryReference('');
    setRemarks('');
    setNameError('');
    setAccountError('');
    setConfirmAccountError('');
    setIfscError('');
    setAmountError('');
    setExecutionResult(null);
    setStep(1);
  };

  return (
    <PageContainer
      title="Pay-Out"
      description="Send funds securely to a beneficiary or bank account."
      statusBadge={<StatusBadge status="ACTIVE" label="Approved Retailer" />}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Stepper Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className={`py-2 px-3 rounded-lg font-bold border transition-all ${step === 1 ? 'bg-indigo-50 text-indigo-800 border-indigo-300 shadow-2xs' : step > 1 ? 'bg-slate-50 text-slate-700 border-slate-200' : 'text-slate-400 border-transparent'}`}>
              <span className="font-mono mr-1.5">1.</span> Beneficiary
            </div>
            <div className={`py-2 px-3 rounded-lg font-bold border transition-all ${step === 2 ? 'bg-indigo-50 text-indigo-800 border-indigo-300 shadow-2xs' : step > 2 ? 'bg-slate-50 text-slate-700 border-slate-200' : 'text-slate-400 border-transparent'}`}>
              <span className="font-mono mr-1.5">2.</span> Review
            </div>
            <div className={`py-2 px-3 rounded-lg font-bold border transition-all ${step === 3 ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs animate-pulse' : step > 3 ? 'bg-slate-50 text-slate-700 border-slate-200' : 'text-slate-400 border-transparent'}`}>
              <span className="font-mono mr-1.5">3.</span> Processing
            </div>
            <div className={`py-2 px-3 rounded-lg font-bold border transition-all ${step === 4 ? 'bg-indigo-50 text-indigo-800 border-indigo-300 shadow-2xs' : 'text-slate-400 border-transparent'}`}>
              <span className="font-mono mr-1.5">4.</span> Result
            </div>
          </div>
        </div>

        {/* STEP 1: BENEFICIARY & TRANSFER DETAILS FORM */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card title="Beneficiary & Disbursement Details">
                <form onSubmit={handleProceedToReview} className="space-y-4">
                  {/* Beneficiary Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Beneficiary Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={beneficiaryName}
                      onChange={(e) => {
                        setBeneficiaryName(e.target.value);
                        if (e.target.value.trim()) setNameError('');
                      }}
                      onBlur={() => validateName(beneficiaryName)}
                      placeholder="e.g. Ramesh Chandra"
                      className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-hidden focus:ring-2 ${
                        nameError ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-indigo-200'
                      }`}
                    />
                    {nameError && <p className="text-[11px] text-rose-600 font-medium mt-0.5">{nameError}</p>}
                  </div>

                  {/* Account Number & Confirm Account Number Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Bank Account Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={beneficiaryAccount}
                        onChange={(e) => {
                          setBeneficiaryAccount(e.target.value);
                          if (e.target.value.trim()) setAccountError('');
                        }}
                        onBlur={() => validateAccount(beneficiaryAccount)}
                        placeholder="Enter Account Number"
                        className={`w-full px-3 py-2 text-xs font-mono border rounded-lg focus:outline-hidden focus:ring-2 ${
                          accountError ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-indigo-200'
                        }`}
                      />
                      {accountError && <p className="text-[11px] text-rose-600 font-medium mt-0.5">{accountError}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Confirm Account Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={confirmAccount}
                        onChange={(e) => {
                          setConfirmAccount(e.target.value);
                          if (e.target.value.trim()) setConfirmAccountError('');
                        }}
                        onBlur={() => validateConfirmAccount(confirmAccount, beneficiaryAccount)}
                        placeholder="Re-enter Account Number"
                        className={`w-full px-3 py-2 text-xs font-mono border rounded-lg focus:outline-hidden focus:ring-2 ${
                          confirmAccountError ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-indigo-200'
                        }`}
                      />
                      {confirmAccountError && <p className="text-[11px] text-rose-600 font-medium mt-0.5">{confirmAccountError}</p>}
                    </div>
                  </div>

                  {/* IFSC Code & Bank Name Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        IFSC Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={beneficiaryIfsc}
                        onChange={(e) => {
                          const uppercaseVal = e.target.value.toUpperCase();
                          setBeneficiaryIfsc(uppercaseVal);
                          if (uppercaseVal.trim()) setIfscError('');
                        }}
                        onBlur={() => validateIfsc(beneficiaryIfsc)}
                        placeholder="e.g. SBIN0001234"
                        className={`w-full px-3 py-2 text-xs font-mono uppercase border rounded-lg focus:outline-hidden focus:ring-2 ${
                          ifscError ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-indigo-200'
                        }`}
                      />
                      {ifscError && <p className="text-[11px] text-rose-600 font-medium mt-0.5">{ifscError}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        readOnly
                        className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 font-semibold text-slate-700 rounded-lg cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Disbursement Mode & Amount Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Disbursement Mode <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-200 bg-white font-mono"
                      >
                        {PAY_OUT_PAYMENT_MODES.map((m) => (
                          <option key={m.id} value={m.code}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          Transfer Amount (₹) <span className="text-rose-500">*</span>
                        </label>
                        {activeLimit && (
                          <span className="text-[11px] text-slate-500 font-mono">
                            Limit: ₹{activeLimit.minPerTransaction.toLocaleString('en-IN')} - ₹{activeLimit.maxPerTransaction.toLocaleString('en-IN')}
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
                          placeholder="5000"
                          className={`w-full pl-7 pr-3 py-2 text-sm font-mono font-bold border rounded-lg focus:outline-hidden focus:ring-2 ${
                            amountError
                              ? 'border-rose-400 focus:ring-rose-200'
                              : 'border-slate-300 focus:ring-indigo-200'
                          }`}
                        />
                      </div>
                      {amountError && <p className="text-[11px] text-rose-600 font-medium mt-0.5">{amountError}</p>}
                    </div>
                  </div>

                  {/* Beneficiary Mobile & Reference Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Beneficiary Mobile <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={beneficiaryMobile}
                        onChange={(e) => setBeneficiaryMobile(e.target.value)}
                        placeholder="e.g. 9860066666"
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Beneficiary Ref / Order ID <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={beneficiaryReference}
                        onChange={(e) => setBeneficiaryReference(e.target.value)}
                        placeholder="e.g. DISB_REF_9910"
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Remarks / Purpose <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Vendor payout disbursement"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>

                  {/* Dev QA Result Selector (Centralized Flag Guarded) */}
                  {DEV_FEATURES.showTransactionOutcomeSelector && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Dev Gateway Outcome Simulation
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                          QA Test Mode
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {(['SUCCESS', 'PENDING', 'FAILED', 'AUTO'] as const).map((scen) => (
                          <button
                            key={scen}
                            type="button"
                            onClick={() => setMockScenario(scen)}
                            className={`py-1.5 px-2 rounded-lg font-mono text-[11px] font-bold border transition-all ${
                              mockScenario === scen
                                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {scen}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      size="md"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      disabled={preview ? !preview.isWalletSufficient : false}
                    >
                      Proceed to Review Pay-Out
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Live Financial Breakdown Column */}
            <div className="space-y-6">
              <Card title="Financial Preview">
                {preview ? (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-2">
                      <div className="flex justify-between items-center text-slate-700">
                        <span>Transfer Principal:</span>
                        <span className="font-mono font-bold text-slate-900">{formatCurrency(preview.principalAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Pay-Out Processing Fee:</span>
                        <span className="font-mono">{formatCurrency(preview.customerCharge)}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>GST (18% on Fee):</span>
                        <span className="font-mono">{formatCurrency(preview.gstAmount)}</span>
                      </div>
                      <div className="pt-2 border-t border-indigo-200 flex justify-between items-center font-bold text-slate-900 text-sm">
                        <span>Total Wallet Debit:</span>
                        <span className="font-mono text-rose-700">-{formatCurrency(preview.totalWalletDebit)}</span>
                      </div>
                    </div>

                    {/* Commission & Margin Highlights */}
                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-900 flex items-center gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> Retailer Commission:
                        </span>
                        <span className="font-mono font-bold text-emerald-700 text-sm">+{formatCurrency(preview.retailerCommissionAmount)}</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Rate: <strong>{preview.retailerCommissionRate}</strong> ({preview.planName})
                      </p>
                    </div>

                    {/* Wallet Sufficiency Banner */}
                    <div className="p-3 rounded-xl border space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Available Wallet Balance:</span>
                        <span className="font-mono font-bold text-slate-900">{formatCurrency(preview.availableBalance)}</span>
                      </div>

                      {preview.isWalletSufficient ? (
                        <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Wallet balance is sufficient for this disbursement.
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-900 space-y-1 mt-1">
                          <p className="font-bold text-xs flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4 text-rose-600" /> Insufficient Wallet Balance
                          </p>
                          <div className="flex justify-between font-mono text-[11px]">
                            <span>Required Debit:</span>
                            <span className="font-bold">{formatCurrency(preview.totalWalletDebit)}</span>
                          </div>
                          <div className="flex justify-between font-mono text-[11px] text-rose-700 font-bold">
                            <span>Shortfall Amount:</span>
                            <span>{formatCurrency(preview.shortfall)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Enter disbursement details to view live financial calculation.
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* STEP 2: REVIEW & CONFIRMATION */}
        {step === 2 && preview && (
          <Card title="Review Pay-Out Disbursement">
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Summary Overview */}
              <div className="p-5 rounded-2xl border border-indigo-200 bg-slate-900 text-white space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-800 pb-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Disbursement Summary</h4>
                    <p className="text-xs text-indigo-300">Mode: <strong className="font-mono text-white">{paymentMode}</strong> ({serviceType})</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-900 text-indigo-200 border border-indigo-700">
                    Beneficiary Payout
                  </span>
                </div>

                {/* Beneficiary Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-indigo-300 block text-[11px]">Beneficiary Name</span>
                    <span className="text-sm font-bold text-white">{beneficiaryName}</span>
                  </div>
                  <div>
                    <span className="text-indigo-300 block text-[11px]">Bank Account</span>
                    <span className="text-sm font-bold text-white">{payOutService.maskAccountNumber(beneficiaryAccount)}</span>
                  </div>
                  <div>
                    <span className="text-indigo-300 block text-[11px]">IFSC Code</span>
                    <span className="text-xs font-bold text-indigo-200">{beneficiaryIfsc}</span>
                  </div>
                  <div>
                    <span className="text-indigo-300 block text-[11px]">Bank Name</span>
                    <span className="text-xs font-semibold text-indigo-200">{bankName}</span>
                  </div>
                </div>

                {/* Breakdown Grid */}
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-indigo-800 text-xs">
                  <div>
                    <span className="text-indigo-300 block text-[11px]">Transfer Amount</span>
                    <span className="text-base font-bold font-mono text-white">{formatCurrency(preview.principalAmount)}</span>
                  </div>
                  <div>
                    <span className="text-indigo-300 block text-[11px]">Processing Fee</span>
                    <span className="text-base font-bold font-mono text-indigo-200">{formatCurrency(preview.customerCharge)}</span>
                  </div>
                  <div>
                    <span className="text-indigo-300 block text-[11px]">GST (18%)</span>
                    <span className="text-base font-bold font-mono text-indigo-200">{formatCurrency(preview.gstAmount)}</span>
                  </div>
                  <div>
                    <span className="text-indigo-300 block text-[11px]">Retailer Commission</span>
                    <span className="text-base font-bold font-mono text-emerald-400">+{formatCurrency(preview.retailerCommissionAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-indigo-800 text-xs text-indigo-200">
                  <span>Total Wallet Debit: <strong className="text-rose-400 font-mono text-base ml-2">-{formatCurrency(preview.totalWalletDebit)}</strong></span>
                  <span className="font-mono text-[11px]">Projected Balance After: <strong className="text-emerald-400">{formatCurrency(preview.projectedBalanceAfter)}</strong></span>
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
                  onClick={handleConfirmPayOut}
                  isLoading={isSubmitting}
                  disabled={!preview.isWalletSufficient || isSubmitting}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Confirm & Process Pay-Out
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* STEP 3: PROCESSING STATE */}
        {step === 3 && (
          <Card title="Processing Pay-Out Disbursement">
            <div className="py-12 px-4 text-center space-y-4 max-w-md mx-auto">
              <div className="p-4 rounded-full bg-indigo-50 border border-indigo-200 w-16 h-16 mx-auto flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Processing Pay-Out Transaction...</h3>
                <p className="text-xs text-slate-500">
                  Validating beneficiary parameters and routing disbursement request to simulated bank gateway.
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
                  ? 'bg-gradient-to-r from-indigo-900 to-slate-900 border-indigo-300'
                  : executionResult.status === 'PENDING'
                  ? 'bg-gradient-to-r from-amber-800 to-slate-900 border-amber-300'
                  : 'bg-gradient-to-r from-rose-900 to-slate-900 border-rose-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {executionResult.status === 'SUCCESS' && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                  {executionResult.status === 'PENDING' && <Clock className="w-6 h-6 text-amber-400" />}
                  {executionResult.status === 'FAILED' && <AlertTriangle className="w-6 h-6 text-rose-400" />}
                  <h3 className="text-lg font-extrabold tracking-tight">
                    {executionResult.status === 'SUCCESS'
                      ? 'Pay-Out Disbursed Successfully!'
                      : executionResult.status === 'PENDING'
                      ? 'Pay-Out Submitted & Pending Bank Clearance'
                      : 'Pay-Out Disbursement Failed'}
                  </h3>
                </div>
                <p className="text-xs text-slate-300">{executionResult.message}</p>
                {executionResult.status === 'PENDING' && (
                  <p className="text-[11px] text-amber-200 font-medium">
                    Wallet funds ({formatCurrency(executionResult.preview.totalWalletDebit)}) have been placed on hold until bank clearance.
                  </p>
                )}
                {executionResult.status === 'FAILED' && (
                  <p className="text-[11px] text-rose-200 font-medium">
                    No wallet debited. Any reserved funds have been returned to available balance.
                  </p>
                )}
              </div>

              <div className="text-right space-y-1 font-mono text-xs">
                <p className="text-indigo-200 text-[11px]">Txn Ref: <strong className="text-white">{executionResult.transaction.transactionRef}</strong></p>
                {executionResult.transaction.utr && (
                  <p className="text-emerald-300 text-[11px]">Bank UTR: <strong className="text-white">{executionResult.transaction.utr}</strong></p>
                )}
              </div>
            </div>

            {/* Receipt Component */}
            <PayOutReceipt
              transaction={executionResult.transaction}
              preview={executionResult.preview}
            />

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 max-w-xl mx-auto">
              <Button
                variant="outline"
                size="md"
                onClick={handleResetForm}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                New Pay-Out Disbursement
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
