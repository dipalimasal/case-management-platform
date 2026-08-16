import { Card } from '../common';
import { formatDate } from '../../services/storage';
import type { EvidenceItem } from '../../types/case';

interface Props {
  evidence: EvidenceItem[];
}

export function Evidence({ evidence }: Props) {
  return (
    <Card title="Evidence">
      {evidence.length === 0 ? (
        <p className="text-sm text-slate-400">No evidence attached.</p>
      ) : (
        <div className="space-y-2">
          {evidence.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-[#0f1419] rounded p-3 border border-[#2d3a4d]/50">
              <div>
                <p className="text-sm text-slate-200 font-medium">{item.name}</p>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
              <div className="text-right">
                <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">{item.type}</span>
                <p className="text-xs text-slate-500 mt-1">{item.uploadedBy} · {formatDate(item.uploadedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
