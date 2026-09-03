'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, Check } from 'lucide-react';

export interface ReportExportMenuProps {
  onExportCsv: () => void;
  reportTitle?: string;
  disabled?: boolean;
}

export const ReportExportMenu: React.FC<ReportExportMenuProps> = ({
  onExportCsv,
  reportTitle = 'Report',
  disabled = false,
}) => {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    onExportCsv();
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled}
      leftIcon={exported ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
      title={`Export ${reportTitle} to CSV`}
      aria-label={`Export ${reportTitle} to CSV`}
    >
      {exported ? 'CSV Downloaded' : 'Export CSV'}
    </Button>
  );
};
