import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Select, Input, Button } from '../../components/common';
import { getCases } from '../../services/caseService';
import {
  getScreeningTypeLabel,
  getPriorityColor,
  getStatusColor,
  getRiskColor,
  formatStatus,
} from '../../services/screeningService';
import { formatDate } from '../../services/storage';
import type { CaseRecord, CaseFilters } from '../../types/case';

export default function CaseQueue() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<CaseFilters>({
    page: 1,
    pageSize: 10,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });

  const loadCases = useCallback(() => {
    getCases(filters).then((result) => {
      setCases(result.cases);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    });
  }, [filters]);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const updateFilter = (key: keyof CaseFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? (value as number) : 1 }));
  };

  const toggleSort = (field: keyof CaseRecord) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
  };

  const SortHeader = ({ field, children }: { field: keyof CaseRecord; children: React.ReactNode }) => (
    <th
      className="pb-2 pr-4 cursor-pointer hover:text-slate-200 select-none"
      onClick={() => toggleSort(field)}
    >
      {children}
      {filters.sortBy === field && (filters.sortOrder === 'asc' ? ' ↑' : ' ↓')}
    </th>
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Case Queue</h1>
          <p className="text-sm text-slate-400 mt-1">{total} cases total</p>
        </div>
      </div>

      <div className="bg-[#1e2a3a] border border-[#2d3a4d] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <Input
            placeholder="Search cases..."
            value={filters.search ?? ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="md:col-span-2"
          />
          <Select
            value={filters.screeningType ?? ''}
            onChange={(v) => updateFilter('screeningType', v)}
            placeholder="All Screening Types"
            options={[
              { value: 'CUSTOMER_SCREENING', label: 'Customer Screening' },
              { value: 'TRANSACTION_SCREENING', label: 'Transaction Screening' },
              { value: 'SECURITY_SCREENING', label: 'Security Screening' },
            ]}
          />
          <Select
            value={filters.priority ?? ''}
            onChange={(v) => updateFilter('priority', v)}
            placeholder="All Priorities"
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
              { value: 'CRITICAL', label: 'Critical' },
            ]}
          />
          <Select
            value={filters.status ?? ''}
            onChange={(v) => updateFilter('status', v)}
            placeholder="All Statuses"
            options={[
              { value: 'NEW', label: 'New' },
              { value: 'L1_INVESTIGATION', label: 'L1 Investigation' },
              { value: 'L2_INVESTIGATION', label: 'L2 Investigation' },
              { value: 'L3_INVESTIGATION', label: 'L3 Investigation' },
              { value: 'ON_HOLD', label: 'On Hold' },
              { value: 'RESOLVED', label: 'Resolved' },
            ]}
          />
          <Select
            value={filters.level ?? ''}
            onChange={(v) => updateFilter('level', v)}
            placeholder="All Levels"
            options={[
              { value: 'L1', label: 'L1' },
              { value: 'L2', label: 'L2' },
              { value: 'L3', label: 'L3' },
            ]}
          />
        </div>
      </div>

      <div className="bg-[#1e2a3a] border border-[#2d3a4d] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#1a2332]">
              <tr className="text-left text-xs text-slate-400">
                <SortHeader field="id">Case ID</SortHeader>
                <th className="pb-3 pt-3 pr-4">Screening Type</th>
                <SortHeader field="entityName">Customer / Entity</SortHeader>
                <SortHeader field="priority">Priority</SortHeader>
                <SortHeader field="riskScore">Risk Score</SortHeader>
                <SortHeader field="currentLevel">Level</SortHeader>
                <SortHeader field="status">Status</SortHeader>
                <th className="pb-3 pt-3 pr-4">Assigned To</th>
                <SortHeader field="createdAt">Created</SortHeader>
                <th className="pb-3 pt-3 pr-4">SLA</th>
                <SortHeader field="updatedAt">Last Updated</SortHeader>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="border-t border-[#2d3a4d]/50 hover:bg-[#2d3a4d]/20">
                  <td className="py-3 pr-4">
                    <Link to={`/cases/${c.id}`} className="text-blue-400 hover:text-blue-300 font-medium">
                      {c.id}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-slate-300 text-xs whitespace-nowrap">{getScreeningTypeLabel(c.screeningType)}</td>
                  <td className="py-3 pr-4 text-slate-200 max-w-[180px] truncate">{c.entityName}</td>
                  <td className="py-3 pr-4"><Badge className={getPriorityColor(c.priority)}>{c.priority}</Badge></td>
                  <td className={`py-3 pr-4 font-semibold ${getRiskColor(c.riskScore)}`}>{c.riskScore}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs font-medium">{c.currentLevel}</span>
                  </td>
                  <td className="py-3 pr-4"><Badge className={getStatusColor(c.status)}>{formatStatus(c.status)}</Badge></td>
                  <td className="py-3 pr-4 text-slate-300 text-xs">{c.assignedToName ?? '—'}</td>
                  <td className="py-3 pr-4 text-slate-400 text-xs whitespace-nowrap">{formatDate(c.createdAt)}</td>
                  <td className="py-3 pr-4">
                    {c.slaBreached ? (
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Breached</Badge>
                    ) : (
                      <span className="text-xs text-emerald-400">On Track</span>
                    )}
                  </td>
                  <td className="py-3 text-slate-400 text-xs whitespace-nowrap">{formatDate(c.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#2d3a4d]">
            <span className="text-xs text-slate-400">
              Page {filters.page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={(filters.page ?? 1) <= 1}
                onClick={() => updateFilter('page', (filters.page ?? 1) - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={(filters.page ?? 1) >= totalPages}
                onClick={() => updateFilter('page', (filters.page ?? 1) + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
