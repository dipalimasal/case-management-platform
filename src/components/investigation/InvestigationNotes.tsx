import { useState, useEffect } from 'react';
import { Textarea, DataRow, Badge } from '../common';
import { getCaseById, updateInvestigationNotes } from '../../services/caseService';

interface Props {
  caseId: string;
}

export function InvestigationNotes({ caseId }: Props) {
  const [notes, setNotes] = useState('');
  const [decision, setDecision] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getCaseById(caseId).then((c) => {
      if (c?.investigation) {
        setNotes(c.investigation.notes);
        setDecision(c.investigation.decision);
        setReason(c.investigation.reason);
      }
    });
  }, [caseId]);

  const handleSave = async () => {
    await updateInvestigationNotes(caseId, notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-400 uppercase block mb-1">Investigator Notes</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter investigation notes..."
          rows={4}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSave}
            className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            {saved ? 'Saved ✓' : 'Save Notes'}
          </button>
        </div>
      </div>
      {(decision || reason) && (
        <div className="bg-[#0f1419] rounded p-3 border border-[#2d3a4d]/50">
          <DataRow label="Decision" value={decision ? <Badge className="bg-emerald-500/20 text-emerald-300">{decision}</Badge> : '—'} />
          <DataRow label="Reason" value={reason} />
        </div>
      )}
    </div>
  );
}
