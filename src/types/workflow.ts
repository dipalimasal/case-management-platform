import type { CaseStatus, ScreeningType, WorkflowAction } from './case';

export interface WorkflowTransition {
  from: CaseStatus;
  to: CaseStatus;
  action: WorkflowAction;
  label?: string;
  requiresReason?: boolean;
  requiresDecision?: boolean;
}

export interface WorkflowConfig {
  workflowId: string;
  screeningType: ScreeningType;
  initialLevel: 'L1' | 'L2' | 'L3';
  initialStatus: CaseStatus;
  states: CaseStatus[];
  transitions: WorkflowTransition[];
}
