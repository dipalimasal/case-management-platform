import { useEffect, useState } from 'react';
import { DataRow, Badge } from '../common';
import { getSecurityEventById, getRiskColor } from '../../services/screeningService';
import type { SecurityEventRecord } from '../../types/screening';

interface Props {
  caseId: string;
  referenceId?: string;
}

export function SecurityEvent({ referenceId }: Props) {
  const [event, setEvent] = useState<SecurityEventRecord | null>(null);

  useEffect(() => {
    if (referenceId) getSecurityEventById(referenceId).then(setEvent);
  }, [referenceId]);

  if (!event) return <p className="text-sm text-slate-400">Loading...</p>;

  const severityColors: Record<string, string> = {
    Critical: 'bg-red-500/20 text-red-300 border-red-500/30',
    High: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Medium: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Low: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
      <DataRow label="Event ID" value={event.eventId} />
      <DataRow label="Event Type" value={event.eventType} />
      <DataRow label="Detection Source" value={event.detectionSource} />
      <DataRow label="Detection Time" value={new Date(event.detectionTime).toLocaleString()} />
      <DataRow label="Severity" value={<Badge className={severityColors[event.severity] ?? ''}>{event.severity}</Badge>} />
      <DataRow label="Risk Score" value={<span className={`font-semibold ${getRiskColor(event.riskScore)}`}>{event.riskScore}</span>} />
    </div>
  );
}

export function SecuritySubject({ referenceId }: Props) {
  const [event, setEvent] = useState<SecurityEventRecord | null>(null);

  useEffect(() => {
    if (referenceId) getSecurityEventById(referenceId).then(setEvent);
  }, [referenceId]);

  if (!event) return null;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-4">
        <DataRow label="Name" value={event.subject.name} />
        <DataRow label="Entity Type" value={event.subject.entityType} />
        <DataRow label="Country" value={event.subject.country} />
      </div>
      <h4 className="text-xs text-slate-400 uppercase mb-2">Associated Entities</h4>
      <div className="flex flex-wrap gap-2">
        {event.subject.associatedEntities.map((entity, i) => (
          <Badge key={i} className="bg-slate-600/20 text-slate-300 border-slate-600/30">{entity}</Badge>
        ))}
      </div>
    </div>
  );
}

export function ThreatRiskInfo({ referenceId }: Props) {
  const [event, setEvent] = useState<SecurityEventRecord | null>(null);

  useEffect(() => {
    if (referenceId) getSecurityEventById(referenceId).then(setEvent);
  }, [referenceId]);

  if (!event) return null;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-4">
        <DataRow label="Threat Category" value={event.threatInfo.category} />
        <DataRow label="Trigger" value={event.threatInfo.trigger} />
        <DataRow label="Screening Result" value={<Badge className="bg-red-500/20 text-red-300 border-red-500/30">{event.threatInfo.screeningResult}</Badge>} />
      </div>
      <h4 className="text-xs text-slate-400 uppercase mb-2">Indicators</h4>
      <ul className="space-y-1">
        {event.threatInfo.indicators.map((indicator, i) => (
          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
            <span className="text-red-400 mt-0.5">▸</span>
            {indicator}
          </li>
        ))}
      </ul>
    </div>
  );
}
