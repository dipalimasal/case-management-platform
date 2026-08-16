import { useState } from 'react';
import { Card, Button, Textarea } from '../common';
import { addComment } from '../../services/caseService';
import { formatDate } from '../../services/storage';
import type { CommentItem } from '../../types/case';

interface Props {
  caseId: string;
  comments: CommentItem[];
  onUpdate: () => void;
}

export function Comments({ caseId, comments, onUpdate }: Props) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    await addComment(caseId, content.trim());
    setContent('');
    setSubmitting(false);
    onUpdate();
  };

  return (
    <Card title="Comments">
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {comments.length === 0 && (
          <p className="text-sm text-slate-400">No comments yet.</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-[#0f1419] rounded p-3 border border-[#2d3a4d]/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-200">{comment.author}</span>
              <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-sm text-slate-300">{comment.content}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          rows={2}
          className="flex-1"
        />
        <Button onClick={handleSubmit} disabled={submitting || !content.trim()} size="sm">
          Post
        </Button>
      </div>
    </Card>
  );
}
