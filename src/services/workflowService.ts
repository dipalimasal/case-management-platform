import workflowsData from '../mock/workflows.json';
import type { CaseRecord } from '../types/case';
import type { WorkflowConfig, WorkflowTransition } from '../types/workflow';

export async function getWorkflows(): Promise<WorkflowConfig[]> {
  return workflowsData as WorkflowConfig[];
}

export async function getWorkflowById(workflowId: string): Promise<WorkflowConfig | null> {
  const workflows = await getWorkflows();
  return workflows.find((w) => w.workflowId === workflowId) ?? null;
}

export async function getWorkflowForCase(caseRecord: CaseRecord): Promise<WorkflowConfig> {
  const workflow = await getWorkflowById(caseRecord.workflowId);
  if (!workflow) throw new Error(`Workflow not found: ${caseRecord.workflowId}`);
  return workflow;
}

export function applyTransition(
  workflow: WorkflowConfig,
  currentStatus: string,
  action: string,
): WorkflowTransition | null {
  return (
    workflow.transitions.find((t) => t.from === currentStatus && t.action === action) ?? null
  );
}

export async function getAvailableActions(caseRecord: CaseRecord): Promise<WorkflowTransition[]> {
  const workflow = await getWorkflowForCase(caseRecord);
  return workflow.transitions.filter((t) => t.from === caseRecord.status);
}

export function getWorkflowLevels(workflow: WorkflowConfig): string[] {
  const levels = new Set<string>();
  workflow.transitions.forEach((t) => {
    if (t.to.includes('L1')) levels.add('L1');
    if (t.to.includes('L2')) levels.add('L2');
    if (t.to.includes('L3')) levels.add('L3');
  });
  if (workflow.initialLevel) levels.add(workflow.initialLevel);
  return Array.from(levels).sort();
}

export function getInitialRouteInfo(workflow: WorkflowConfig): {
  initialLevel: string;
  skippedLevels: string[];
} {
  const allLevels = ['L1', 'L2', 'L3'];
  const skipped = allLevels.filter(
    (l) => parseInt(l.slice(1)) < parseInt(workflow.initialLevel.slice(1)),
  );
  return { initialLevel: workflow.initialLevel, skippedLevels: skipped };
}
