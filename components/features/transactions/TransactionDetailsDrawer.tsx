'use client';

import React from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { TransactionDetailsView } from './TransactionDetailsView';
import { Transaction } from '@/types/domain';

export interface TransactionDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onRefresh?: () => void;
}

export const TransactionDetailsDrawer: React.FC<TransactionDetailsDrawerProps> = ({
  isOpen,
  onClose,
  transaction,
  onRefresh,
}) => {
  if (!transaction) return null;

  const isPayIn = transaction.type === 'PAY_IN';
  const drawerTitle = isPayIn ? 'Pay-In Transaction Details' : 'Pay-Out Transaction Details';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={drawerTitle}
      size="lg"
      className="p-0 bg-[var(--bg-app)] w-full md:w-[880px] md:max-w-[92vw]"
    >
      <TransactionDetailsView transaction={transaction} onRefresh={onRefresh} isInsideDrawer />
    </Drawer>
  );
};
