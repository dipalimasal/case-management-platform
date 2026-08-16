export interface ScreeningProfile {
  id: string;
  name: string;
  type: 'CUSTOMER_SCREENING' | 'TRANSACTION_SCREENING' | 'SECURITY_SCREENING';
  workflow: string;
  uiProfile: string;
  enabled: boolean;
}

export interface CustomerRecord {
  id: string;
  customerId: string;
  name: string;
  dateOfBirth: string;
  nationality: string;
  country: string;
  customerType: string;
  riskRating: string;
  kycStatus: string;
  relatedParties: RelatedParty[];
  screeningResults: ScreeningMatch[];
}

export interface RelatedParty {
  name: string;
  relationship: string;
  country: string;
  risk: string;
  screeningStatus: string;
}

export interface ScreeningMatch {
  source: string;
  matchName: string;
  matchType: string;
  matchScore: number;
  matchStatus: string;
}

export interface TransactionRecord {
  id: string;
  transactionId: string;
  transactionDate: string;
  amount: number;
  currency: string;
  sender: string;
  senderAccount: string;
  beneficiary: string;
  beneficiaryAccount: string;
  country: string;
  paymentType: string;
  message: string;
  screeningResults: TransactionScreeningResult[];
  relatedCustomerId?: string;
  relatedTransactionIds?: string[];
}

export interface TransactionScreeningResult {
  rule: string;
  alertReason: string;
  match: string;
  riskScore: number;
  ruleTriggered: boolean;
}

export interface SecurityEventRecord {
  id: string;
  eventId: string;
  eventType: string;
  detectionSource: string;
  detectionTime: string;
  severity: string;
  riskScore: number;
  subject: SecuritySubject;
  threatInfo: ThreatInfo;
}

export interface SecuritySubject {
  name: string;
  entityType: string;
  country: string;
  associatedEntities: string[];
}

export interface ThreatInfo {
  category: string;
  trigger: string;
  indicators: string[];
  screeningResult: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
}

export interface AuditEvent {
  id: string;
  caseId: string;
  type: string;
  description: string;
  performedBy: string;
  performedByName: string;
  timestamp: string;
  metadata?: Record<string, string>;
}
