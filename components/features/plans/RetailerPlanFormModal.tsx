import React, { useState, useEffect } from 'react';
import { RetailerPlan, CommissionType, PlanStatus } from '@/types/domain';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';

export interface RetailerPlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planData: Omit<RetailerPlan, 'id' | 'assignedRetailersCount' | 'createdAt'>) => Promise<boolean>;
  initialData?: RetailerPlan | null;
  isSubmitting?: boolean;
}

export const RetailerPlanFormModal: React.FC<RetailerPlanFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const isEditing = !!initialData;

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<PlanStatus>('ACTIVE');

  // Pay-In Rules
  const [payinType, setPayinType] = useState<CommissionType>('PERCENTAGE');
  const [payinValue, setPayinValue] = useState<string>('0.25');

  // Pay-Out Rules
  const [payoutType, setPayoutType] = useState<CommissionType>('FLAT');
  const [payoutValue, setPayoutValue] = useState<string>('5.00');

  // Effective Dates
  const [effectiveFrom, setEffectiveFrom] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [effectiveTo, setEffectiveTo] = useState<string>('');

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCode(initialData.code);
      setDescription(initialData.description || '');
      setStatus(initialData.status);

      const payinRule = initialData.commissionRules.find((r) => r.serviceType === 'PAY_IN');
      if (payinRule) {
        setPayinType(payinRule.commissionType);
        setPayinValue(payinRule.value.toString());
      }

      const payoutRule = initialData.commissionRules.find((r) => r.serviceType === 'PAY_OUT');
      if (payoutRule) {
        setPayoutType(payoutRule.commissionType);
        setPayoutValue(payoutRule.value.toString());
      }

      setEffectiveFrom(initialData.effectiveFrom ? initialData.effectiveFrom.split('T')[0] : '');
      setEffectiveTo(initialData.effectiveTo ? initialData.effectiveTo.split('T')[0] : '');
    } else {
      setName('');
      setCode('');
      setDescription('');
      setStatus('ACTIVE');
      setPayinType('PERCENTAGE');
      setPayinValue('0.25');
      setPayoutType('FLAT');
      setPayoutValue('5.00');
      setEffectiveFrom(new Date().toISOString().split('T')[0]);
      setEffectiveTo('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Plan Name is required';
    }

    if (!code.trim()) {
      newErrors.code = 'Plan Code is required';
    } else if (!/^[A-Z0-9_]+$/.test(code.trim())) {
      newErrors.code = 'Code must contain only uppercase letters, numbers, and underscores (e.g. PLAN_STD_01)';
    }

    // Pay-In Validation
    const payinValNum = parseFloat(payinValue);
    if (isNaN(payinValNum) || payinValNum < 0) {
      newErrors.payinValue = 'Pay-In commission must be a valid non-negative number';
    } else if (payinType === 'PERCENTAGE' && payinValNum > 100) {
      newErrors.payinValue = 'Percentage commission cannot exceed 100%';
    }

    // Pay-Out Validation
    const payoutValNum = parseFloat(payoutValue);
    if (isNaN(payoutValNum) || payoutValNum < 0) {
      newErrors.payoutValue = 'Pay-Out commission must be a valid non-negative number';
    } else if (payoutType === 'PERCENTAGE' && payoutValNum > 100) {
      newErrors.payoutValue = 'Percentage commission cannot exceed 100%';
    }

    // Date Validation
    if (!effectiveFrom) {
      newErrors.effectiveFrom = 'Effective From date is required';
    } else if (effectiveTo && new Date(effectiveTo) < new Date(effectiveFrom)) {
      newErrors.effectiveTo = 'Effective To date must not be earlier than Effective From date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      status,
      commissionRules: [
        {
          serviceType: 'PAY_IN' as const,
          commissionType: payinType,
          value: parseFloat(payinValue),
        },
        {
          serviceType: 'PAY_OUT' as const,
          commissionType: payoutType,
          value: parseFloat(payoutValue),
        },
      ],
      effectiveFrom: new Date(effectiveFrom).toISOString(),
      effectiveTo: effectiveTo ? new Date(effectiveTo).toISOString() : undefined,
      createdBy: initialData?.createdBy || 'usr_admin_01',
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Retailer Plan (${initialData.code})` : 'Create Retailer Commercial Plan'}
      description="Define commercial structures, pay-in margins, and payout fees for retailer outlets."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Plan Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Plan Name" required error={errors.name}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Standard Retailer Plan"
            />
          </FormField>

          <FormField label="Plan Code" required error={errors.code} helperText="Uppercase identifier">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. PLAN_STANDARD"
              disabled={isEditing}
            />
          </FormField>
        </div>

        <FormField label="Description">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of who this plan applies to and commercial benefits..."
          />
        </FormField>

        {/* Commercial Rules Section */}
        <div className="border border-slate-200 rounded-[var(--radius-lg)] p-4 bg-slate-50/70 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary)] block">
            Commercial Commission Rules
          </span>

          {/* Pay-In Commission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-md border border-slate-200">
            <FormField label="Pay-In Commission Type" required>
              <Select
                value={payinType}
                onChange={(e) => setPayinType(e.target.value as CommissionType)}
                options={[
                  { label: 'Percentage (%)', value: 'PERCENTAGE' },
                  { label: 'Flat Amount (₹)', value: 'FLAT' },
                ]}
              />
            </FormField>

            <FormField
              label={`Pay-In Value (${payinType === 'PERCENTAGE' ? '%' : '₹'})`}
              required
              error={errors.payinValue}
            >
              <Input
                type="number"
                step="0.01"
                min="0"
                max={payinType === 'PERCENTAGE' ? '100' : undefined}
                value={payinValue}
                onChange={(e) => setPayinValue(e.target.value)}
              />
            </FormField>
          </div>

          {/* Pay-Out Commission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-md border border-slate-200">
            <FormField label="Pay-Out Commission Type" required>
              <Select
                value={payoutType}
                onChange={(e) => setPayoutType(e.target.value as CommissionType)}
                options={[
                  { label: 'Flat Amount (₹)', value: 'FLAT' },
                  { label: 'Percentage (%)', value: 'PERCENTAGE' },
                ]}
              />
            </FormField>

            <FormField
              label={`Pay-Out Value (${payoutType === 'PERCENTAGE' ? '%' : '₹'})`}
              required
              error={errors.payoutValue}
            >
              <Input
                type="number"
                step="0.01"
                min="0"
                max={payoutType === 'PERCENTAGE' ? '100' : undefined}
                value={payoutValue}
                onChange={(e) => setPayoutValue(e.target.value)}
              />
            </FormField>
          </div>
        </div>

        {/* Effective Dates & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormField label="Effective From" required error={errors.effectiveFrom}>
            <Input
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
            />
          </FormField>

          <FormField label="Effective To (Optional)" error={errors.effectiveTo}>
            <Input
              type="date"
              value={effectiveTo}
              onChange={(e) => setEffectiveTo(e.target.value)}
            />
          </FormField>

          <FormField label="Initial Status" required>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as PlanStatus)}
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
              ]}
            />
          </FormField>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Update Plan' : 'Save Plan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
