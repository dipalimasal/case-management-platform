import type { ScreeningType } from './case';

export interface UISectionConfig {
  id: string;
  component: string;
  title: string;
  order: number;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface UIConfiguration {
  uiProfile: string;
  screeningType: ScreeningType;
  sections: UISectionConfig[];
}

export interface ComponentRenderProps {
  caseId: string;
  caseData?: Record<string, unknown>;
}
