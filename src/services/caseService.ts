import casesData from '../mock/cases.json';
import auditData from '../mock/audit-events.json';
import type {
  CaseRecord,
  CaseFilters,
  CaseQueueResult,
  DashboardStats,
  ActionPayload,
  CaseStatus,
  CaseLevel,
  ScreeningType,
  CasePriority,
} from '../types/case';
import type { AuditEvent } from '../types/screening';
import {
  getCaseOverrides,
  setCaseOverride,
  getAuditOverrides,
  addAuditOverride,
  generateId,
  isToday,
} from './storage';
import { getAvailableActions, getWorkflowForCase, applyTransition } from './workflowService';
import { getUsers } from './screeningService';

const CURRENT_USER = { id: 'user-001', name: 'Sarah Chen' };

function mergeCases(): CaseRecord[] {
  const overrides = getCaseOverrides();
  return (casesData as CaseRecord[]).map((c) => {
    const override = overrides[c.id];
    return {
      ...c,
      ...override,
      investigation: {
        notes: override?.investigation?.notes ?? c.investigation?.notes ?? '',
        decision: override?.investigation?.decision ?? c.investigation?.decision ?? null,
        reason: override?.investigation?.reason ?? c.investigation?.reason ?? null,
      },
      evidence: override?.evidence ?? c.evidence ?? [],
      comments: override?.comments ?? c.comments ?? [],
    };
  });
}

function mergeAuditEvents(): AuditEvent[] {
  return [...(auditData as AuditEvent[]), ...getAuditOverrides()];
}

function statusToLevel(status: CaseStatus): CaseLevel | null {
  if (status === 'L1_INVESTIGATION') return 'L1';
  if (status === 'L2_INVESTIGATION') return 'L2';
  if (status === 'L3_INVESTIGATION') return 'L3';
  return null;
}

export async function getCases(filters: CaseFilters = {}): Promise<CaseQueueResult> {
  let cases = mergeCases();
  const {
    search = '',
    screeningType,
    priority,
    status,
    level,
    sortBy = 'updatedAt',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
  } = filters;

  if (search) {
    const q = search.toLowerCase();
    cases = cases.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.entityName.toLowerCase().includes(q) ||
        c.entityId.toLowerCase().includes(q) ||
        c.assignedToName?.toLowerCase().includes(q),
    );
  }
  if (screeningType) cases = cases.filter((c) => c.screeningType === screeningType);
  if (priority) cases = cases.filter((c) => c.priority === priority);
  if (status) cases = cases.filter((c) => c.status === status);
  if (level) cases = cases.filter((c) => c.currentLevel === level);

  cases.sort((a, b) => {
    const aVal = a[sortBy as keyof CaseRecord];
    const bVal = b[sortBy as keyof CaseRecord];
    if (aVal == null || bVal == null) return 0;
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  const total = cases.length;
  const start = (page - 1) * pageSize;
  const paged = cases.slice(start, start + pageSize);

  return { cases: paged, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getCaseById(id: string): Promise<CaseRecord | null> {
  const cases = mergeCases();
  return cases.find((c) => c.id === id) ?? null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const cases = mergeCases();
  const openCases = cases.filter((c) => !['RESOLVED', 'CLOSED'].includes(c.status));

  const byScreeningType: Record<ScreeningType, number> = {
    CUSTOMER_SCREENING: 0,
    TRANSACTION_SCREENING: 0,
    SECURITY_SCREENING: 0,
  };
  const byPriority: Record<CasePriority, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
  };
  const byLevel: Record<CaseLevel, number> = { L1: 0, L2: 0, L3: 0 };

  openCases.forEach((c) => {
    byScreeningType[c.screeningType]++;
    byPriority[c.priority]++;
    byLevel[c.currentLevel]++;
  });

  const recentCases = [...cases]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  return {
    totalOpen: openCases.length,
    newCases: cases.filter((c) => c.status === 'NEW').length,
    l1Cases: cases.filter((c) => c.currentLevel === 'L1' && !['RESOLVED', 'CLOSED'].includes(c.status)).length,
    l2Cases: cases.filter((c) => c.currentLevel === 'L2' && !['RESOLVED', 'CLOSED'].includes(c.status)).length,
    l3Cases: cases.filter((c) => c.currentLevel === 'L3' && !['RESOLVED', 'CLOSED'].includes(c.status)).length,
    criticalCases: openCases.filter((c) => c.priority === 'CRITICAL').length,
    slaBreached: openCases.filter((c) => c.slaBreached).length,
    resolvedToday: cases.filter((c) => c.status === 'RESOLVED' && isToday(c.updatedAt)).length,
    byScreeningType,
    byPriority,
    byLevel,
    recentCases,
  };
}

export async function getAuditEvents(caseId: string): Promise<AuditEvent[]> {
  return mergeAuditEvents()
    .filter((e) => e.caseId === caseId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export async function performCaseAction(
  caseId: string,
  action: string,
  payload: ActionPayload = {},
): Promise<CaseRecord | null> {
  const caseRecord = await getCaseById(caseId);
  if (!caseRecord) return null;

  const workflow = await getWorkflowForCase(caseRecord);
  const now = new Date().toISOString();
  const performedBy = payload.performedBy ?? CURRENT_USER.id;
  const performedByName = CURRENT_USER.name;

  let update: Partial<CaseRecord> = { updatedAt: now };
  let auditDescription = '';
  let auditType = action;
  const auditMeta: Record<string, string> = {};

  if (action === 'ASSIGN') {
    const users = await getUsers();
    const user = users.find((u) => u.id === payload.assignedTo);
    update = {
      ...update,
      assignedTo: payload.assignedTo ?? null,
      assignedToName: user?.name ?? null,
      status: caseRecord.status === 'NEW' ? workflow.initialStatus : caseRecord.status,
      currentLevel: caseRecord.status === 'NEW' ? workflow.initialLevel : caseRecord.currentLevel,
    };
    auditDescription = `Assigned to ${user?.name ?? 'Unknown'}`;
    auditType = 'ASSIGNED';
    auditMeta.assignedTo = payload.assignedTo ?? '';
  } else if (action === 'ESCALATE') {
    const result = applyTransition(workflow, caseRecord.status, 'ESCALATE');
    if (result) {
      const newLevel = statusToLevel(result.to);
      update = {
        ...update,
        status: result.to,
        currentLevel: newLevel ?? caseRecord.currentLevel,
      };
      auditDescription = `Escalated from ${caseRecord.currentLevel} to ${newLevel}`;
      auditType = 'ESCALATED';
      auditMeta.fromLevel = caseRecord.currentLevel;
      auditMeta.toLevel = newLevel ?? '';
    }
  } else if (action === 'RESOLVE') {
    update = {
      ...update,
      status: 'RESOLVED',
      investigation: {
        notes: caseRecord.investigation?.notes ?? '',
        decision: payload.decision ?? null,
        reason: payload.reason ?? null,
      },
    };
    auditDescription = `Case resolved: ${payload.decision ?? 'Resolved'}`;
    auditType = 'RESOLVED';
    auditMeta.decision = payload.decision ?? '';
  } else if (action === 'ON_HOLD') {
    update = {
      ...update,
      status: 'ON_HOLD',
      investigation: {
        notes: caseRecord.investigation?.notes ?? '',
        decision: caseRecord.investigation?.decision ?? null,
        reason: payload.reason ?? null,
      },
    };
    auditDescription = `Case put on hold: ${payload.reason ?? 'No reason provided'}`;
    auditType = 'ON_HOLD';
  } else if (action === 'REOPEN') {
    const reopenLevel = workflow.initialLevel;
    const reopenStatus = workflow.initialStatus;
    update = {
      ...update,
      status: reopenStatus,
      currentLevel: reopenLevel,
      investigation: {
        notes: caseRecord.investigation?.notes ?? '',
        decision: null,
        reason: null,
      },
    };
    auditDescription = `Case reopened at ${reopenLevel}`;
    auditType = 'REOPENED';
  } else if (action === 'CLOSE') {
    update = { ...update, status: 'CLOSED' };
    auditDescription = 'Case closed';
    auditType = 'CLOSED';
  }

  if (payload.comment) {
    const comments = caseRecord.comments ?? [];
    comments.push({
      id: generateId('cm'),
      author: performedByName,
      authorId: performedBy,
      content: payload.comment,
      createdAt: now,
    });
    update.comments = comments;
  }

  setCaseOverride(caseId, update);

  if (auditDescription) {
    addAuditOverride({
      id: generateId('audit'),
      caseId,
      type: auditType,
      description: auditDescription,
      performedBy,
      performedByName,
      timestamp: now,
      metadata: auditMeta,
    });
  }

  return getCaseById(caseId);
}

export async function addComment(caseId: string, content: string): Promise<void> {
  const caseRecord = await getCaseById(caseId);
  if (!caseRecord) return;
  const now = new Date().toISOString();
  const comments = caseRecord.comments ?? [];
  comments.push({
    id: generateId('cm'),
    author: CURRENT_USER.name,
    authorId: CURRENT_USER.id,
    content,
    createdAt: now,
  });
  setCaseOverride(caseId, { comments, updatedAt: now });
  addAuditOverride({
    id: generateId('audit'),
    caseId,
    type: 'COMMENT_ADDED',
    description: `Comment added by ${CURRENT_USER.name}`,
    performedBy: CURRENT_USER.id,
    performedByName: CURRENT_USER.name,
    timestamp: now,
  });
}

export async function updateInvestigationNotes(caseId: string, notes: string): Promise<void> {
  const caseRecord = await getCaseById(caseId);
  if (!caseRecord) return;
  setCaseOverride(caseId, {
    investigation: {
      notes,
      decision: caseRecord.investigation?.decision ?? null,
      reason: caseRecord.investigation?.reason ?? null,
    },
    updatedAt: new Date().toISOString(),
  });
}

export { getAvailableActions };

export function getCurrentUser() {
  return CURRENT_USER;
}
