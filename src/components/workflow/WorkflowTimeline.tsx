import { getInitialRouteInfo } from '../../services/workflowService';
import type { WorkflowConfig } from '../../types/workflow';
import type { CaseLevel } from '../../types/case';

interface Props {
  workflow: WorkflowConfig;
  currentLevel: CaseLevel;
}

export function WorkflowTimeline({ workflow, currentLevel }: Props) {
  const { initialLevel, skippedLevels } = getInitialRouteInfo(workflow);
  const allLevels: CaseLevel[] = ['L1', 'L2', 'L3'];
  const currentIdx = allLevels.indexOf(currentLevel);

  return (
    <div className="bg-[#1e2a3a] border border-[#2d3a4d] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-200">Workflow Progress</h3>
        <span className="text-xs text-slate-400">Workflow: {workflow.workflowId}</span>
      </div>
      {skippedLevels.length > 0 && (
        <div className="mb-3 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded text-xs text-purple-300">
          Direct routing: Case entered at {initialLevel} (skipped {skippedLevels.join(', ')})
        </div>
      )}
      <div className="flex items-center gap-2">
        {allLevels.map((level, idx) => {
          const isSkipped = skippedLevels.includes(level);
          const isCurrent = level === currentLevel;
          const isPast = idx < currentIdx && !isSkipped;

          let bg = 'bg-[#2d3a4d] text-slate-500';
          if (isSkipped) bg = 'bg-slate-700/30 text-slate-600 line-through';
          else if (isCurrent) bg = 'bg-blue-600 text-white ring-2 ring-blue-400';
          else if (isPast) bg = 'bg-emerald-600/80 text-white';

          return (
            <div key={level} className="flex items-center gap-2 flex-1">
              <div className={`flex-1 text-center py-2 rounded text-sm font-medium ${bg}`}>
                {level}
                {isCurrent && <span className="block text-xs font-normal opacity-80">Current</span>}
                {isSkipped && <span className="block text-xs font-normal">Skipped</span>}
              </div>
              {idx < allLevels.length - 1 && (
                <div className={`w-4 h-0.5 ${isPast || (isCurrent && idx < currentIdx) ? 'bg-emerald-500' : 'bg-[#2d3a4d]'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
