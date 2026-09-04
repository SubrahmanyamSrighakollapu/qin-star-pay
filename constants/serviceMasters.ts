/**
 * Centralized Service Categories & Payment Modes Master
 */

export interface PayInServiceCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface PayInPaymentMode {
  id: string;
  code: string;
  name: string;
  category: 'DIGITAL' | 'CASH' | 'BANK' | 'CARD';
  status: 'ACTIVE' | 'INACTIVE';
}

export const PAY_IN_SERVICES: PayInServiceCategory[] = [
  {
    id: 'SRV_PAYIN_UPI',
    code: 'UPI_COLLECTION',
    name: 'UPI Pay-In Collection',
    description: 'Collect digital payments directly via customer UPI apps & QR',
    status: 'ACTIVE',
  },
  {
    id: 'SRV_PAYIN_MERCHANT',
    code: 'STORE_PAYIN',
    name: 'Merchant Store Pay-In',
    description: 'Over-the-counter merchant walk-in collection',
    status: 'ACTIVE',
  },
  {
    id: 'SRV_PAYIN_BILL',
    code: 'BILL_COLLECTION',
    name: 'Bill Payment Collection',
    description: 'Utility & bill collection counter services',
    status: 'ACTIVE',
  },
  {
    id: 'SRV_PAYIN_UTILITY',
    code: 'UTILITY_PAYIN',
    name: 'Utility Collection',
    description: 'Water, electricity, and municipal tax collection',
    status: 'ACTIVE',
  },
];

export const PAY_IN_PAYMENT_MODES: PayInPaymentMode[] = [
  {
    id: 'MODE_UPI',
    code: 'UPI',
    name: 'UPI / QR',
    category: 'DIGITAL',
    status: 'ACTIVE',
  },
  {
    id: 'MODE_CASH',
    code: 'CASH',
    name: 'Cash Collection',
    category: 'CASH',
    status: 'ACTIVE',
  },
  {
    id: 'MODE_CARD',
    code: 'CARD',
    name: 'Debit / Credit Card',
    category: 'CARD',
    status: 'ACTIVE',
  },
  {
    id: 'MODE_NET_BANKING',
    code: 'NET_BANKING',
    name: 'Net Banking',
    category: 'BANK',
    status: 'ACTIVE',
  },
];

export const PAY_OUT_SERVICES = [
  {
    id: 'SRV_PAYOUT_DISBURSE',
    code: 'BANK_DISBURSEMENT',
    name: 'Bank Account Disbursement',
    description: 'Instant transfer to beneficiary bank account via IMPS/NEFT/RTGS',
    status: 'ACTIVE',
  },
  {
    id: 'SRV_PAYOUT_UPI',
    code: 'UPI_PAYOUT',
    name: 'UPI Beneficiary Payout',
    description: 'Direct payout to beneficiary VPA / UPI ID',
    status: 'ACTIVE',
  },
  {
    id: 'SRV_PAYOUT_VENDOR',
    code: 'VENDOR_PAYOUT',
    name: 'Vendor Settlement Payout',
    description: 'B2B commercial vendor payment settlement',
    status: 'ACTIVE',
  },
];

export const PAY_OUT_PAYMENT_MODES = [
  {
    id: 'MODE_IMPS',
    code: 'IMPS',
    name: 'IMPS (Immediate Transfer)',
    category: 'BANK',
    minAmount: 1,
    maxAmount: 500000,
    status: 'ACTIVE',
  },
  {
    id: 'MODE_NEFT',
    code: 'NEFT',
    name: 'NEFT (Batch Transfer)',
    category: 'BANK',
    minAmount: 1,
    maxAmount: 1000000,
    status: 'ACTIVE',
  },
  {
    id: 'MODE_RTGS',
    code: 'RTGS',
    name: 'RTGS (Real Time Gross - Min ₹2,00,000)',
    category: 'BANK',
    minAmount: 200000,
    maxAmount: 25000000,
    status: 'ACTIVE',
  },
  {
    id: 'MODE_UPI_OUT',
    code: 'UPI',
    name: 'UPI Payout',
    category: 'DIGITAL',
    minAmount: 1,
    maxAmount: 100000,
    status: 'ACTIVE',
  },
];
