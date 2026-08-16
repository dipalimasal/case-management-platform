export type ScreeningType =
  | 'CUSTOMER_SCREENING'
  | 'TRANSACTION_SCREENING'
  | 'SECURITY_SCREENING';

export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CaseLevel = 'L1' | 'L2' | 'L3';

export type CaseStatus =
  | 'NEW'
  | 'L1_INVESTIGATION'
  | 'L2_INVESTIGATION'
  | 'L3_INVESTIGATION'
  | 'ON_HOLD'
  | 'RESOLVED'
  | 'CLOSED';

export interface CaseRecord {
  id: string;
  screeningType: ScreeningType;
  entityName: string;
  entityId: string;
  priority: CasePriority;
  riskScore: number;
  currentLevel: CaseLevel;
  status: CaseStatus;
  assignedTo: string | null;
  assignedToName: string | null;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  slaBreached: boolean;
  workflowId: string;
  uiProfile: string;
  referenceId: string;
  summary: string;
  tags: string[];
  customerId?: string;
  transactionId?: string;
  securityEventId?: string;
  investigation?: InvestigationData;
  evidence?: EvidenceItem[];
  comments?: CommentItem[];
}

export interface InvestigationData {
  notes: string;
  decision: string | null;
  reason: string | null;
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  description: string;
}

export interface CommentItem {
  id: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface CaseFilters {
  search?: string;
  screeningType?: ScreeningType | '';
  priority?: CasePriority | '';
  status?: CaseStatus | '';
  level?: CaseLevel | '';
  sortBy?: keyof CaseRecord;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface CaseQueueResult {
  cases: CaseRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalOpen: number;
  newCases: number;
  l1Cases: number;
  l2Cases: number;
  l3Cases: number;
  criticalCases: number;
  slaBreached: number;
  resolvedToday: number;
  byScreeningType: Record<ScreeningType, number>;
  byPriority: Record<CasePriority, number>;
  byLevel: Record<CaseLevel, number>;
  recentCases: CaseRecord[];
}

export type WorkflowAction = 'ASSIGN' | 'ESCALATE' | 'RESOLVE' | 'ON_HOLD' | 'REOPEN' | 'CLOSE';

export interface ActionPayload {
  assignedTo?: string;
  decision?: string;
  reason?: string;
  comment?: string;
  performedBy?: string;
}
