import { TaxMode } from '@/types/domain';

export interface InvoiceCalculationInput {
  taxableAmount: number;
  gstRate?: number;
  tdsApplicable?: boolean;
  tdsRate?: number;
  taxMode?: TaxMode;
}

export interface InvoiceCalculationResult {
  taxableAmount: number;
  gstRate: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  tdsApplicable: boolean;
  tdsRate: number;
  tdsAmount: number;
  grossAmount: number;
  netReceivable: number;
}

const roundCurrency = (val: number): number => {
  return Math.round((val + Number.EPSILON) * 100) / 100;
};

export const calculateGst = (taxableAmount: number, rate = 18): number => {
  if (taxableAmount <= 0) return 0;
  return roundCurrency((taxableAmount * rate) / 100);
};

export const calculateTds = (taxableAmount: number, tdsApplicable = false, rate = 10): number => {
  if (!tdsApplicable || taxableAmount <= 0) return 0;
  return roundCurrency((taxableAmount * rate) / 100);
};

export const calculateTaxSplit = (gstAmount: number, mode: TaxMode = 'INTRA_STATE') => {
  const roundedGst = roundCurrency(gstAmount);
  if (mode === 'INTER_STATE') {
    return {
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: roundedGst,
    };
  }
  const halfGst = roundCurrency(roundedGst / 2);
  return {
    cgstAmount: halfGst,
    sgstAmount: halfGst,
    igstAmount: 0,
  };
};

export const calculateInvoiceBreakdown = (
  input: InvoiceCalculationInput
): InvoiceCalculationResult => {
  const taxableAmount = roundCurrency(Math.max(0, input.taxableAmount));
  const gstRate = input.gstRate !== undefined ? input.gstRate : 18;
  const tdsApplicable = !!input.tdsApplicable;
  const tdsRate = input.tdsRate !== undefined ? input.tdsRate : 10;
  const taxMode = input.taxMode || 'INTRA_STATE';

  const gstAmount = calculateGst(taxableAmount, gstRate);
  const tdsAmount = calculateTds(taxableAmount, tdsApplicable, tdsRate);
  const taxSplit = calculateTaxSplit(gstAmount, taxMode);

  const grossAmount = roundCurrency(taxableAmount + gstAmount);
  const netReceivable = roundCurrency(grossAmount - tdsAmount);

  return {
    taxableAmount,
    gstRate,
    gstAmount,
    cgstAmount: taxSplit.cgstAmount,
    sgstAmount: taxSplit.sgstAmount,
    igstAmount: taxSplit.igstAmount,
    tdsApplicable,
    tdsRate,
    tdsAmount,
    grossAmount,
    netReceivable,
  };
};
