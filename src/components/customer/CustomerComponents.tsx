import { useEffect, useState } from 'react';
import { DataRow, Badge } from '../common';
import { getCustomerById } from '../../services/screeningService';
import type { CustomerRecord } from '../../types/screening';

interface Props {
  caseId: string;
  referenceId?: string;
}

export function CustomerProfile({ referenceId }: Props) {
  const [customer, setCustomer] = useState<CustomerRecord | null>(null);

  useEffect(() => {
    if (referenceId) getCustomerById(referenceId).then(setCustomer);
  }, [referenceId]);

  if (!customer) return <p className="text-sm text-slate-400">Loading customer data...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
      <DataRow label="Customer ID" value={customer.customerId} />
      <DataRow label="Customer Name" value={customer.name} />
      <DataRow label="Date of Birth" value={customer.dateOfBirth} />
      <DataRow label="Nationality" value={customer.nationality} />
      <DataRow label="Country" value={customer.country} />
      <DataRow label="Customer Type" value={customer.customerType} />
      <DataRow label="Risk Rating" value={<Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">{customer.riskRating}</Badge>} />
      <DataRow label="KYC Status" value={customer.kycStatus} />
    </div>
  );
}

export function BeneficiaryDetails({ referenceId }: Props) {
  const [customer, setCustomer] = useState<CustomerRecord | null>(null);

  useEffect(() => {
    if (referenceId) getCustomerById(referenceId).then(setCustomer);
  }, [referenceId]);

  if (!customer) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-400 border-b border-[#2d3a4d]">
            <th className="pb-2 pr-4">Name</th>
            <th className="pb-2 pr-4">Relationship</th>
            <th className="pb-2 pr-4">Country</th>
            <th className="pb-2 pr-4">Risk</th>
            <th className="pb-2">Screening Status</th>
          </tr>
        </thead>
        <tbody>
          {customer.relatedParties.map((party, i) => (
            <tr key={i} className="border-b border-[#2d3a4d]/50">
              <td className="py-2 pr-4 text-slate-200">{party.name}</td>
              <td className="py-2 pr-4 text-slate-300">{party.relationship}</td>
              <td className="py-2 pr-4 text-slate-300">{party.country}</td>
              <td className="py-2 pr-4"><Badge className="bg-slate-500/20 text-slate-300">{party.risk}</Badge></td>
              <td className="py-2 text-slate-300">{party.screeningStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CustomerScreeningResults({ referenceId }: Props) {
  const [customer, setCustomer] = useState<CustomerRecord | null>(null);

  useEffect(() => {
    if (referenceId) getCustomerById(referenceId).then(setCustomer);
  }, [referenceId]);

  if (!customer) return null;

  return (
    <div className="space-y-3">
      {customer.screeningResults.map((result, i) => (
        <div key={i} className="bg-[#0f1419] rounded p-3 border border-[#2d3a4d]/50">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div><span className="text-slate-400 text-xs">Source</span><p className="text-slate-200">{result.source}</p></div>
            <div><span className="text-slate-400 text-xs">Match Name</span><p className="text-slate-200">{result.matchName}</p></div>
            <div><span className="text-slate-400 text-xs">Match Type</span><p className="text-slate-200">{result.matchType}</p></div>
            <div><span className="text-slate-400 text-xs">Match Score</span><p className="text-amber-400 font-semibold">{result.matchScore}%</p></div>
            <div><span className="text-slate-400 text-xs">Status</span><p className="text-slate-200">{result.matchStatus}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}
