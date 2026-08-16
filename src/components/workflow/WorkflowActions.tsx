import { useState } from 'react';
import { Button, Modal, Select, Textarea } from '../common';
import { performCaseAction } from '../../services/caseService';
import { getUsers } from '../../services/screeningService';
import type { CaseRecord } from '../../types/case';
import type { WorkflowTransition } from '../../types/workflow';
import type { UserRecord } from '../../types/screening';

interface Props {
  caseRecord: CaseRecord;
  availableActions: WorkflowTransition[];
  onActionComplete: () => void;
}

export function WorkflowActions({ caseRecord, availableActions, onActionComplete }: Props) {
  const [modal, setModal] = useState<{ action: string; transition: WorkflowTransition } | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [assignedTo, setAssignedTo] = useState('');
  const [decision, setDecision] = useState('');
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');

  const openModal = async (transition: WorkflowTransition) => {
    if (transition.action === 'ASSIGN') {
      const u = await getUsers();
      setUsers(u);
    }
    setModal({ action: transition.action, transition });
    setDecision('');
    setReason('');
    setComment('');
    setAssignedTo('');
  };

  const handleConfirm = async () => {
    if (!modal) return;
    await performCaseAction(caseRecord.id, modal.action, {
      assignedTo: assignedTo || undefined,
      decision: decision || undefined,
      reason: reason || undefined,
      comment: comment || undefined,
    });
    setModal(null);
    onActionComplete();
  };

  const actionVariants: Record<string, 'primary' | 'secondary' | 'danger'> = {
    ESCALATE: 'primary',
    RESOLVE: 'primary',
    ASSIGN: 'secondary',
    ON_HOLD: 'secondary',
    REOPEN: 'secondary',
    CLOSE: 'danger',
  };

  const uniqueActions = availableActions.filter(
    (t, i, arr) => arr.findIndex((x) => x.action === t.action) === i,
  );

  return (
    <div className="bg-[#1e2a3a] border border-[#2d3a4d] rounded-lg p-4">
      <h3 className="text-sm font-semibold text-slate-200 mb-3">Workflow Actions</h3>
      <div className="flex flex-wrap gap-2">
        {uniqueActions.map((transition) => (
          <Button
            key={`${transition.action}-${transition.to}`}
            variant={actionVariants[transition.action] ?? 'secondary'}
            size="sm"
            onClick={() => openModal(transition)}
          >
            {transition.label ?? transition.action}
          </Button>
        ))}
        {uniqueActions.length === 0 && (
          <p className="text-sm text-slate-400">No actions available for current status.</p>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.transition.label ?? modal.action}
          onClose={() => setModal(null)}
          onConfirm={handleConfirm}
          confirmLabel="Confirm"
          confirmVariant={modal.action === 'CLOSE' ? 'danger' : 'primary'}
        >
          {modal.action === 'ASSIGN' && (
            <div className="space-y-3">
              <label className="text-sm text-slate-300 block">Assign to</label>
              <Select
                value={assignedTo}
                onChange={setAssignedTo}
                placeholder="Select investigator"
                options={users.map((u) => ({ value: u.id, label: `${u.name} (${u.team})` }))}
              />
            </div>
          )}
          {modal.transition.requiresDecision && (
            <div className="space-y-3">
              <label className="text-sm text-slate-300 block">Decision</label>
              <Select
                value={decision}
                onChange={setDecision}
                placeholder="Select decision"
                options={[
                  { value: 'True Match', label: 'True Match' },
                  { value: 'False Positive', label: 'False Positive' },
                  { value: 'Escalated to Compliance', label: 'Escalated to Compliance' },
                  { value: 'Contained', label: 'Contained' },
                  { value: 'No Action Required', label: 'No Action Required' },
                ]}
              />
              <label className="text-sm text-slate-300 block">Resolution Reason</label>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter resolution reason..." />
            </div>
          )}
          {modal.transition.requiresReason && !modal.transition.requiresDecision && (
            <div className="space-y-3">
              <label className="text-sm text-slate-300 block">Reason</label>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter reason..." />
            </div>
          )}
          <div className="space-y-3 mt-3">
            <label className="text-sm text-slate-300 block">Comment (optional)</label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." rows={2} />
          </div>
        </Modal>
      )}
    </div>
  );
}
