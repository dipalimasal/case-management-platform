import { useEffect, useState } from 'react';
import { DataRow, Badge } from '../common';
import { getTransactionById, getCustomerById, getRiskColor } from '../../services/screeningService';
import type { TransactionRecord, CustomerRecord } from '../../types/screening';

interface Props {
  caseId: string;
  referenceId?: string;
}

export function TransactionMessage({ referenceId }: Props) {
  const [txn, setTxn] = useState<TransactionRecord | null>(null);

  useEffect(() => {
    if (referenceId) getTransactionById(referenceId).then(setTxn);
  }, [referenceId]);

  if (!txn) return <p className="text-sm text-slate-400">Loading...</p>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{txn.paymentType}</Badge>
      </div>
      <pre className="bg-[#0f1419] border border-[#2d3a4d] rounded p-4 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
        {txn.message}
      </pre>
    </div>
  );
}

export function TransactionDetails({ referenceId }: Props) {
  const [txn, setTxn] = useState<TransactionRecord | null>(null);

  useEffect(() => {
    if (referenceId) getTransactionById(referenceId).then(setTxn);
  }, [referenceId]);

  if (!txn) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
      <DataRow label="Transaction ID" value={txn.transactionId} />
      <DataRow label="Transaction Date" value={new Date(txn.transactionDate).toLocaleString()} />
      <DataRow label="Amount" value={<span className="font-semibold">{txn.currency} {txn.amount.toLocaleString()}</span>} />
      <DataRow label="Currency" value={txn.currency} />
      <DataRow label="Sender" value={txn.sender} />
      <DataRow label="Sender Account" value={txn.senderAccount} />
      <DataRow label="Beneficiary" value={txn.beneficiary} />
      <DataRow label="Beneficiary Account" value={txn.beneficiaryAccount} />
      <DataRow label="Country" value={txn.country} />
      <DataRow label="Payment Type" value={txn.paymentType} />
    </div>
  );
}

export function TransactionScreeningResults({ referenceId }: Props) {
  const [txn, setTxn] = useState<TransactionRecord | null>(null);

  useEffect(() => {
    if (referenceId) getTransactionById(referenceId).then(setTxn);
  }, [referenceId]);

  if (!txn) return null;

  return (
    <div className="space-y-3">
      {txn.screeningResults.map((result, i) => (
        <div key={i} className="bg-[#0f1419] rounded p-3 border border-[#2d3a4d]/50">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div><span className="text-slate-400 text-xs">Screening Rule</span><p className="text-slate-200">{result.rule}</p></div>
            <div><span className="text-slate-400 text-xs">Alert Reason</span><p className="text-slate-200">{result.alertReason}</p></div>
            <div><span className="text-slate-400 text-xs">Match</span><p className="text-slate-200">{result.match}</p></div>
            <div><span className="text-slate-400 text-xs">Risk Score</span><p className={`font-semibold ${getRiskColor(result.riskScore)}`}>{result.riskScore}</p></div>
            <div><span className="text-slate-400 text-xs">Rule Triggered</span><p>{result.ruleTriggered ? '✓ Yes' : '✗ No'}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RelatedCases({ referenceId }: Props) {
  const [txn, setTxn] = useState<TransactionRecord | null>(null);
  const [customer, setCustomer] = useState<CustomerRecord | null>(null);

  useEffect(() => {
    if (referenceId) {
      getTransactionById(referenceId).then((t) => {
        setTxn(t);
        if (t?.relatedCustomerId) getCustomerById(t.relatedCustomerId).then(setCustomer);
      });
    }
  }, [referenceId]);

  if (!txn) return null;

  return (
    <div className="space-y-4">
      {customer && (
        <div>
          <h4 className="text-xs text-slate-400 uppercase mb-2">Customer</h4>
          <div className="bg-[#0f1419] rounded p-3 border border-[#2d3a4d]/50">
            <p className="text-sm text-slate-200 font-medium">{customer.name}</p>
            <p className="text-xs text-slate-400">{customer.customerId} · {customer.customerType} · Risk: {customer.riskRating}</p>
          </div>
        </div>
      )}
      <div>
        <h4 className="text-xs text-slate-400 uppercase mb-2">Beneficiary</h4>
        <div className="bg-[#0f1419] rounded p-3 border border-[#2d3a4d]/50">
          <p className="text-sm text-slate-200 font-medium">{txn.beneficiary}</p>
          <p className="text-xs text-slate-400">{txn.beneficiaryAccount} · {txn.country}</p>
        </div>
      </div>
      {txn.relatedTransactionIds && txn.relatedTransactionIds.length > 0 && (
        <div>
          <h4 className="text-xs text-slate-400 uppercase mb-2">Related Transactions</h4>
          {txn.relatedTransactionIds.map((id) => (
            <div key={id} className="bg-[#0f1419] rounded p-2 border border-[#2d3a4d]/50 text-sm text-blue-400 mb-1">
              {id}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
