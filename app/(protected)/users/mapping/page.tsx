'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { ColumnDefinition } from '@/types/common';
import { EntityMapping } from '@/types/domain';
import { userService } from '@/services/userService';
import { formatDate } from '@/utils/formatters';
import { Edit2 } from 'lucide-react';

export default function UserMappingPage() {
  const [mappings, setMappings] = useState<EntityMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMapping, setSelectedMapping] = useState<EntityMapping | null>(null);
  const [newParentId, setNewParentId] = useState('ent_dist_01');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchMappings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await userService.getMappings();
      if (res.success && res.data) {
        setMappings(res.data.items);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    userService.getMappings().then((res) => {
      if (!isCancelled && res.success && res.data) {
        setMappings(res.data.items);
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleOpenRemapModal = (m: EntityMapping) => {
    setSelectedMapping(m);
    setNewParentId(m.mappedParentId);
  };

  const handleConfirmRemap = async () => {
    if (!selectedMapping) return;
    setIsUpdating(true);
    try {
      const parentName =
        newParentId === 'ent_dist_01'
          ? 'North Zone Dist'
          : newParentId === 'ent_dist_02'
          ? 'West Coast Agency'
          : 'South Region Hub';
      const res = await userService.updateMapping(selectedMapping.id, newParentId, parentName);
      if (res.success) {
        fetchMappings();
        setSelectedMapping(null);
      }
    } catch {
      // Fallback
    } finally {
      setIsUpdating(false);
    }
  };

  const columns: ColumnDefinition<EntityMapping>[] = [
    {
      key: 'entityName',
      header: 'Child Entity',
      render: (row) => (
        <div>
          <span className="font-bold text-xs text-[var(--primary)] block">{row.entityName}</span>
          <span className="text-[10px] text-slate-500 font-semibold uppercase">{row.entityType}</span>
        </div>
      ),
    },
    {
      key: 'mappedParentName',
      header: 'Mapped Parent Entity',
      render: (row) => (
        <div>
          <span className="font-semibold text-xs text-slate-900 block">{row.mappedParentName}</span>
          <span className="text-[10px] text-slate-500 font-semibold uppercase">{row.parentType}</span>
        </div>
      ),
    },
    {
      key: 'effectiveDate',
      header: 'Effective Date',
      render: (row) => (
        <span className="text-xs text-[var(--text-secondary)]">{formatDate(row.effectiveDate)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <PageContainer
      title="User & Entity Mapping"
      description="Manage commercial parent-child entity relationships."
      className="space-y-6"
    >
      <Card title="Entity Hierarchy Structure" subtitle="Current commercial parent-child matrix">
        <div className="overflow-x-auto border border-[var(--border)] rounded-[var(--radius-xl)] bg-white shadow-xs">
          <Table
            columns={columns}
            data={mappings}
            keyExtractor={(row) => row.id}
            isLoading={isLoading}
            renderActions={(row) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenRemapModal(row)}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Change Parent Mapping
              </Button>
            )}
          />
        </div>
      </Card>

      {/* Remap Parent Entity Modal */}
      <Modal
        isOpen={!!selectedMapping}
        onClose={() => setSelectedMapping(null)}
        title="Change Parent Entity Mapping"
        description={selectedMapping ? `Remap ${selectedMapping.entityName} to a new parent entity` : ''}
        size="sm"
      >
        {selectedMapping && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Child Entity:</span>
                <span className="font-bold">{selectedMapping.entityName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Mapped Parent:</span>
                <span className="font-semibold">{selectedMapping.mappedParentName}</span>
              </div>
            </div>

            <Select
              label="Select New Parent Entity *"
              value={newParentId}
              onChange={(e) => setNewParentId(e.target.value)}
              options={[
                { value: 'ent_dist_01', label: 'North Zone Dist (DISTRIBUTOR)' },
                { value: 'ent_dist_02', label: 'West Coast Agency (DISTRIBUTOR)' },
                { value: 'ent_dist_03', label: 'South Region Hub (DISTRIBUTOR)' },
              ]}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <Button variant="outline" size="sm" onClick={() => setSelectedMapping(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmRemap} isLoading={isUpdating}>
                Confirm Remap
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
