'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { RetailerPlan } from '@/types/domain';
import { retailerPlanService } from '@/services/retailerPlanService';
import { RetailerPlanSummaryCards } from '@/components/features/plans/RetailerPlanSummaryCards';
import { RetailerPlanTable } from '@/components/features/plans/RetailerPlanTable';
import { RetailerPlanFormModal } from '@/components/features/plans/RetailerPlanFormModal';
import { RetailerPlanDetailModal } from '@/components/features/plans/RetailerPlanDetailModal';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { FilterBar } from '@/components/ui/FilterBar';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Plus, Layers } from 'lucide-react';

export default function RetailerPlansPage() {
  const [plans, setPlans] = useState<RetailerPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalPlans: 0,
    activePlans: 0,
    inactivePlans: 0,
    assignedRetailers: 0,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals & Drawers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<RetailerPlan | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewingPlan, setViewingPlan] = useState<RetailerPlan | null>(null);

  // Deactivation Confirmation State
  const [deactivatingPlan, setDeactivatingPlan] = useState<RetailerPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toastSuccess, toastError } = useToast();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [plansRes, summaryRes] = await Promise.all([
        retailerPlanService.getPlans(),
        retailerPlanService.getPlanSummary(),
      ]);

      if (plansRes.success && plansRes.data) {
        setPlans(plansRes.data);
      }
      setSummary(summaryRes);
    } catch {
      toastError('Failed to load retailer plans.');
    } finally {
      setIsLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered Plans
  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      searchQuery === '' ||
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plan.description && plan.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || plan.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateNew = () => {
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const handleEditPlan = (plan: RetailerPlan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleViewPlan = (plan: RetailerPlan) => {
    setViewingPlan(plan);
    setIsDetailOpen(true);
  };

  const handleFormSubmit = async (
    planData: Omit<RetailerPlan, 'id' | 'assignedRetailersCount' | 'createdAt'>
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      if (editingPlan) {
        const res = await retailerPlanService.updatePlan(editingPlan.id, planData);
        if (res.success) {
          toastSuccess(`Retailer Plan "${planData.name}" updated successfully.`);
          await loadData();
          return true;
        } else {
          toastError(res.error?.message || 'Failed to update plan.');
          return false;
        }
      } else {
        const res = await retailerPlanService.createPlan(planData);
        if (res.success) {
          toastSuccess(`Retailer Plan "${planData.name}" created successfully.`);
          await loadData();
          return true;
        } else {
          toastError(res.error?.message || 'Failed to create plan.');
          return false;
        }
      }
    } catch {
      toastError('An unexpected error occurred while saving the plan.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatusClick = (plan: RetailerPlan) => {
    if (plan.status === 'ACTIVE') {
      // Deactivating
      setDeactivatingPlan(plan);
    } else {
      // Activating immediately
      confirmStatusToggle(plan);
    }
  };

  const confirmStatusToggle = async (plan: RetailerPlan) => {
    try {
      const res = await retailerPlanService.togglePlanStatus(plan.id);
      if (res.success && res.data) {
        const actionText = res.data.status === 'ACTIVE' ? 'activated' : 'deactivated';
        toastSuccess(`Retailer Plan "${plan.name}" has been ${actionText}.`);
        await loadData();
      } else {
        toastError(res.error?.message || 'Failed to change plan status.');
      }
    } catch {
      toastError('Error toggling plan status.');
    } finally {
      setDeactivatingPlan(null);
    }
  };

  return (
    <PageContainer
      title="Retailer Plans"
      description="Create and manage commercial plans used to determine retailer commission structures."
      actions={
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleCreateNew}
        >
          Create Retailer Plan
        </Button>
      }
    >
      {/* Summary KPI Cards */}
      <RetailerPlanSummaryCards
        totalPlans={summary.totalPlans}
        activePlans={summary.activePlans}
        inactivePlans={summary.inactivePlans}
        assignedRetailers={summary.assignedRetailers}
        isLoading={isLoading}
      />

      {/* Filters & Search */}
      <FilterBar
        searchSlot={
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search plan name, code, description..."
          />
        }
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('ALL');
        }}
        activeFilterCount={statusFilter !== 'ALL' ? 1 : 0}
      >
        <Select
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { label: 'All Statuses', value: 'ALL' },
            { label: 'Active Plans', value: 'ACTIVE' },
            { label: 'Inactive Plans', value: 'INACTIVE' },
          ]}
        />
      </FilterBar>

      {/* Main Plans Data Table */}
      <div className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="font-bold text-sm text-[var(--text-primary)]">Commercial Plans Master</h3>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              ({filteredPlans.length} plans)
            </span>
          </div>
        </div>

        <RetailerPlanTable
          plans={filteredPlans}
          isLoading={isLoading}
          onViewPlan={handleViewPlan}
          onEditPlan={handleEditPlan}
          onToggleStatus={handleToggleStatusClick}
        />
      </div>

      {/* Form Modal (Create / Edit) */}
      <RetailerPlanFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingPlan}
        isSubmitting={isSubmitting}
      />

      {/* View Detail Drawer */}
      <RetailerPlanDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        plan={viewingPlan}
        onEdit={handleEditPlan}
      />

      {/* Deactivation Confirmation Warning Popup */}
      {deactivatingPlan && (
        <ConfirmationDialog
          isOpen={!!deactivatingPlan}
          onConfirm={() => confirmStatusToggle(deactivatingPlan)}
          onCancel={() => setDeactivatingPlan(null)}
          title={`Deactivate Plan "${deactivatingPlan.name}"?`}
          message={
            deactivatingPlan.assignedRetailersCount > 0
              ? `This plan is currently assigned to ${deactivatingPlan.assignedRetailersCount} retailers. Existing retailer assignments will remain unchanged, but this plan will not be available for new retailer assignments.`
              : `Are you sure you want to deactivate "${deactivatingPlan.name}"? It will no longer be selectable for new retailers.`
          }
          confirmText="Deactivate Plan"
          cancelText="Cancel"
          variant="warning"
        />
      )}
    </PageContainer>
  );
}
