import { useEffect, useState } from 'react';
import { CustomerScreeningResults } from '../customer/CustomerComponents';
import { TransactionScreeningResults } from '../transaction/TransactionComponents';
import { getCaseById } from '../../services/caseService';
import type { ScreeningType } from '../../types/case';

interface Props {
  caseId: string;
  referenceId?: string;
  screeningType?: ScreeningType;
}

export function ScreeningResults({ caseId, referenceId, screeningType }: Props) {
  const [type, setType] = useState<ScreeningType | undefined>(screeningType);

  useEffect(() => {
    if (!screeningType) {
      getCaseById(caseId).then((c) => c && setType(c.screeningType));
    }
  }, [caseId, screeningType]);

  if (type === 'CUSTOMER_SCREENING') {
    return <CustomerScreeningResults caseId={caseId} referenceId={referenceId} />;
  }
  if (type === 'TRANSACTION_SCREENING') {
    return <TransactionScreeningResults caseId={caseId} referenceId={referenceId} />;
  }
  return <p className="text-sm text-slate-400">No screening results available.</p>;
}
