import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge, Card, DataRow } from '../../components/common';
import { DynamicScreeningContext } from '../../components/case/DynamicScreeningContext';
import { WorkflowActions } from '../../components/workflow/WorkflowActions';
import { WorkflowTimeline } from '../../components/workflow/WorkflowTimeline';
import { Evidence } from '../../components/investigation/Evidence';
import { Comments } from '../../components/investigation/Comments';
import { Timeline } from '../../components/investigation/Timeline';
import { getCaseById, getAvailableActions } from '../../services/caseService';
import { getWorkflowForCase } from '../../services/workflowService';
import {
  getScreeningTypeLabel,
  getPriorityColor,
  getStatusColor,
  getRiskColor,
  formatStatus,
} from '../../services/screeningService';
import { formatDate } from '../../services/storage';
import type { CaseRecord } from '../../types/case';
import type { WorkflowConfig, WorkflowTransition } from '../../types/workflow';

export default function CaseDetails() {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowConfig | null>(null);
  const [actions, setActions] = useState<WorkflowTransition[]>([]);

  const loadCase = useCallback(async () => {
    if (!caseId) return;
    const c = await getCaseById(caseId);
    setCaseRecord(c);
    if (c) {
      const wf = await getWorkflowForCase(c);
      setWorkflow(wf);
      const available = await getAvailableActions(c);
      setActions(available);
    }
  }, [caseId]);

  useEffect(() => {
    loadCase();
  }, [loadCase]);

  if (!caseRecord) {
    return (
      <div className="p-6">
        <p className="text-slate-400">Loading case...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 max-w-7xl">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link to="/cases" className="hover:text-blue-400">Case Queue</Link>
        <span>/</span>
        <span className="text-slate-200">{caseRecord.id}</span>
      </div>

      {/* Case Header */}
      <div className="bg-[#1e2a3a] border border-[#2d3a4d] rounded-lg p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-lg font-bold text-white">{caseRecord.id}</h1>
              <Badge className={getPriorityColor(caseRecord.priority)}>{caseRecord.priority}</Badge>
              <Badge className={getStatusColor(caseRecord.status)}>{formatStatus(caseRecord.status)}</Badge>
              {caseRecord.slaBreached && (
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30">SLA Breached</Badge>
              )}
            </div>
            <p className="text-sm text-slate-300">{caseRecord.entityName}</p>
            <p className="text-xs text-slate-500 mt-1">{caseRecord.summary}</p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-xs text-slate-400">Current Level:</span>
              <span className="px-3 py-1 bg-blue-600 text-white rounded font-semibold text-sm">
                {caseRecord.currentLevel}
              </span>
            </div>
            <p className={`text-2xl font-bold ${getRiskColor(caseRecord.riskScore)}`}>
              Risk: {caseRecord.riskScore}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#2d3a4d] text-xs text-slate-400">
          <span>{getScreeningTypeLabel(caseRecord.screeningType)}</span>
          <span>·</span>
          <span>Assigned: {caseRecord.assignedToName ?? 'Unassigned'}</span>
          <span>·</span>
          <span>Created: {formatDate(caseRecord.createdAt)}</span>
          <span>·</span>
          <span>Workflow: {caseRecord.workflowId}</span>
          <span>·</span>
          <span>UI Profile: {caseRecord.uiProfile}</span>
        </div>
        {caseRecord.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {caseRecord.tags.map((tag) => (
              <Badge key={tag} className="bg-slate-600/20 text-slate-400 border-slate-600/30">{tag}</Badge>
            ))}
          </div>
        )}
      </div>

      {/* Workflow Timeline */}
      {workflow && (
        <WorkflowTimeline workflow={workflow} currentLevel={caseRecord.currentLevel} />
      )}

      {/* Case Summary */}
      <Card title="Case Summary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DataRow label="Entity ID" value={caseRecord.entityId} />
          <DataRow label="Reference" value={caseRecord.referenceId} />
          <DataRow label="Screening Type" value={getScreeningTypeLabel(caseRecord.screeningType)} />
          <DataRow label="SLA Deadline" value={formatDate(caseRecord.slaDeadline)} />
        </div>
      </Card>

      {/* Dynamic Screening Context */}
      <DynamicScreeningContext
        uiProfile={caseRecord.uiProfile}
        caseId={caseRecord.id}
        referenceId={caseRecord.referenceId}
        screeningType={caseRecord.screeningType}
      />

      {/* Evidence & Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Evidence evidence={caseRecord.evidence ?? []} />
        <Comments
          caseId={caseRecord.id}
          comments={caseRecord.comments ?? []}
          onUpdate={loadCase}
        />
      </div>

      {/* Timeline */}
      <Card title="Audit Timeline">
        <Timeline caseId={caseRecord.id} key={caseRecord.updatedAt} />
      </Card>

      {/* Workflow Actions */}
      <WorkflowActions
        caseRecord={caseRecord}
        availableActions={actions}
        onActionComplete={loadCase}
      />
    </div>
  );
}
