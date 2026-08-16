import { useEffect, useState } from 'react';
import { formatDate } from '../../services/storage';
import { getAuditEvents } from '../../services/caseService';
import type { AuditEvent } from '../../types/screening';

interface Props {
  caseId: string;
}

const eventIcons: Record<string, string> = {
  CASE_CREATED: '●',
  ASSIGNED: '◉',
  INVESTIGATION_STARTED: '▶',
  EVIDENCE_ADDED: '📎',
  COMMENT_ADDED: '💬',
  ESCALATED: '↑',
  RESOLVED: '✓',
  ON_HOLD: '⏸',
  REOPENED: '↻',
  CLOSED: '■',
};

const eventColors: Record<string, string> = {
  CASE_CREATED: 'border-purple-500 bg-purple-500/10',
  ASSIGNED: 'border-blue-500 bg-blue-500/10',
  ESCALATED: 'border-amber-500 bg-amber-500/10',
  RESOLVED: 'border-emerald-500 bg-emerald-500/10',
  ON_HOLD: 'border-slate-500 bg-slate-500/10',
  REOPENED: 'border-blue-500 bg-blue-500/10',
};

export function Timeline({ caseId }: Props) {
  const [events, setEvents] = useState<AuditEvent[]>([]);

  useEffect(() => {
    getAuditEvents(caseId).then(setEvents);
  }, [caseId]);

  if (events.length === 0) {
    return <p className="text-sm text-slate-400">No timeline events yet.</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-2 bottom-2 w-px bg-[#2d3a4d]" />
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="relative pl-10">
            <div className={`absolute left-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${eventColors[event.type] ?? 'border-slate-500 bg-slate-500/10'}`}>
              {eventIcons[event.type] ?? '•'}
            </div>
            <div>
              <p className="text-sm text-slate-200">{event.description}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {event.performedByName} · {formatDate(event.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
