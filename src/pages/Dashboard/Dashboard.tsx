import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatCard, Card, Badge } from '../../components/common';
import { getDashboardStats } from '../../services/caseService';
import {
  getScreeningTypeLabel,
  getPriorityColor,
  getStatusColor,
  getRiskColor,
  formatStatus,
} from '../../services/screeningService';
import { formatRelativeTime } from '../../services/storage';
import type { DashboardStats, ScreeningType, CaseLevel } from '../../types/case';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Operations Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Case management overview across all screening types</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <StatCard label="Open Cases" value={stats.totalOpen} />
        <StatCard label="New Cases" value={stats.newCases} variant="warning" />
        <StatCard label="L1 Cases" value={stats.l1Cases} />
        <StatCard label="L2 Cases" value={stats.l2Cases} />
        <StatCard label="L3 Cases" value={stats.l3Cases} />
        <StatCard label="Critical" value={stats.criticalCases} variant="critical" />
        <StatCard label="SLA Breached" value={stats.slaBreached} variant="critical" />
        <StatCard label="Resolved Today" value={stats.resolvedToday} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Cases by Screening Type">
          <div className="space-y-3">
            {Object.entries(stats.byScreeningType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{getScreeningTypeLabel(type as ScreeningType)}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-[#2d3a4d] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${stats.totalOpen ? ((count as number) / stats.totalOpen) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white w-6 text-right">{count as number}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Cases by Priority">
          <div className="space-y-2">
            {Object.entries(stats.byPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <Badge className={getPriorityColor(priority)}>{priority}</Badge>
                <span className="text-sm font-medium text-white">{count as number}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Cases by Workflow Level">
          <div className="space-y-2">
            {Object.entries(stats.byLevel).map(([level, count]) => (
              <div key={level} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{level as CaseLevel}</span>
                <span className="text-sm font-medium text-white">{count as number}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Recent Cases">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-[#2d3a4d]">
                <th className="pb-2 pr-4">Case ID</th>
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Entity</th>
                <th className="pb-2 pr-4">Priority</th>
                <th className="pb-2 pr-4">Risk</th>
                <th className="pb-2 pr-4">Level</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentCases.map((c) => (
                <tr key={c.id} className="border-b border-[#2d3a4d]/50 hover:bg-[#2d3a4d]/20">
                  <td className="py-2.5 pr-4">
                    <Link to={`/cases/${c.id}`} className="text-blue-400 hover:text-blue-300 font-medium">
                      {c.id}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 text-slate-300 text-xs">{getScreeningTypeLabel(c.screeningType)}</td>
                  <td className="py-2.5 pr-4 text-slate-200 max-w-[200px] truncate">{c.entityName}</td>
                  <td className="py-2.5 pr-4"><Badge className={getPriorityColor(c.priority)}>{c.priority}</Badge></td>
                  <td className={`py-2.5 pr-4 font-semibold ${getRiskColor(c.riskScore)}`}>{c.riskScore}</td>
                  <td className="py-2.5 pr-4 text-slate-300">{c.currentLevel}</td>
                  <td className="py-2.5 pr-4"><Badge className={getStatusColor(c.status)}>{formatStatus(c.status)}</Badge></td>
                  <td className="py-2.5 text-slate-400 text-xs">{formatRelativeTime(c.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
