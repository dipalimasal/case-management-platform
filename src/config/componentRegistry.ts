import type { ComponentType } from 'react';
import type { ComponentRenderProps } from '../types/ui-config';
import { CustomerProfile, BeneficiaryDetails } from '../components/customer/CustomerComponents';
import { TransactionMessage, TransactionDetails, RelatedCases } from '../components/transaction/TransactionComponents';
import { SecurityEvent, SecuritySubject, ThreatRiskInfo } from '../components/security/SecurityComponents';
import { ScreeningResults } from '../components/investigation/ScreeningResults';
import { InvestigationNotes } from '../components/investigation/InvestigationNotes';
import { Timeline } from '../components/investigation/Timeline';

export type RegistryComponent = ComponentType<ComponentRenderProps & Record<string, unknown>>;

export const componentRegistry: Record<string, RegistryComponent> = {
  CustomerProfile,
  BeneficiaryDetails,
  TransactionMessage,
  TransactionDetails,
  ScreeningResults,
  RelatedCases,
  SecurityEvent,
  SecuritySubject,
  ThreatRiskInfo,
  InvestigationNotes,
  Timeline,
};

export function getComponent(name: string): RegistryComponent | null {
  return componentRegistry[name] ?? null;
}

export function getRegisteredComponents(): string[] {
  return Object.keys(componentRegistry);
}
