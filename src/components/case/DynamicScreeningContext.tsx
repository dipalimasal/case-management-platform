import { useEffect, useState } from 'react';
import { SectionPanel } from '../common';
import { getUIConfigByProfile } from '../../services/configurationService';
import { getComponent } from '../../config/componentRegistry';
import type { UIConfiguration } from '../../types/ui-config';
import type { ScreeningType } from '../../types/case';

interface Props {
  uiProfile: string;
  caseId: string;
  referenceId: string;
  screeningType: ScreeningType;
}

export function DynamicScreeningContext({ uiProfile, caseId, referenceId, screeningType }: Props) {
  const [config, setConfig] = useState<UIConfiguration | null>(null);

  useEffect(() => {
    getUIConfigByProfile(uiProfile).then(setConfig);
  }, [uiProfile]);

  if (!config) {
    return <p className="text-sm text-slate-400">Loading UI configuration...</p>;
  }

  const sections = [...config.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-slate-500 uppercase tracking-wide">Dynamic Screening Context</span>
        <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
          Profile: {uiProfile}
        </span>
      </div>
      {sections.map((section) => {
        const Component = getComponent(section.component);
        if (!Component) {
          return (
            <SectionPanel key={section.id} title={section.title} defaultExpanded={section.defaultExpanded}>
              <p className="text-sm text-amber-400">Component "{section.component}" not registered.</p>
            </SectionPanel>
          );
        }
        return (
          <SectionPanel
            key={section.id}
            title={section.title}
            defaultExpanded={section.defaultExpanded ?? true}
            collapsible={section.collapsible ?? true}
          >
            <Component
              caseId={caseId}
              referenceId={referenceId}
              screeningType={screeningType}
            />
          </SectionPanel>
        );
      })}
    </div>
  );
}
