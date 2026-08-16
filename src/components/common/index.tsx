import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${className}`}>
      {children}
    </span>
  );
}

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export function Card({ title, children, className = '', actions }: CardProps) {
  return (
    <div className={`bg-[#1e2a3a] border border-[#2d3a4d] rounded-lg ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d3a4d]">
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
          {actions}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  variant?: 'default' | 'critical' | 'warning' | 'success';
  subtitle?: string;
}

const statVariants = {
  default: 'border-[#2d3a4d]',
  critical: 'border-red-500/40 bg-red-500/5',
  warning: 'border-amber-500/40 bg-amber-500/5',
  success: 'border-emerald-500/40 bg-emerald-500/5',
};

const statValueVariants = {
  default: 'text-white',
  critical: 'text-red-400',
  warning: 'text-amber-400',
  success: 'text-emerald-400',
};

export function StatCard({ label, value, variant = 'default', subtitle }: StatCardProps) {
  return (
    <div className={`bg-[#1e2a3a] border rounded-lg p-4 ${statVariants[variant]}`}>
      <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${statValueVariants[variant]}`}>{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}

interface DataRowProps {
  label: string;
  value: ReactNode;
}

export function DataRow({ label, value }: DataRowProps) {
  return (
    <div className="flex py-2 border-b border-[#2d3a4d]/50 last:border-0">
      <span className="text-xs text-slate-400 w-40 shrink-0">{label}</span>
      <span className="text-sm text-slate-200 flex-1">{value ?? '—'}</span>
    </div>
  );
}

interface SectionPanelProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  collapsible?: boolean;
}

export function SectionPanel({ title, children, defaultExpanded = true, collapsible = true }: SectionPanelProps) {
  return (
    <details open={defaultExpanded} className="group bg-[#1e2a3a] border border-[#2d3a4d] rounded-lg">
      <summary className={`flex items-center justify-between px-4 py-3 ${collapsible ? 'cursor-pointer' : 'cursor-default list-none'} border-b border-[#2d3a4d]`}>
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        {collapsible && (
          <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </summary>
      <div className="p-4">{children}</div>
    </details>
  );
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const btnVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-[#2d3a4d] hover:bg-[#3d4a5d] text-slate-200',
  danger: 'bg-red-600/80 hover:bg-red-600 text-white',
  ghost: 'bg-transparent hover:bg-[#2d3a4d] text-slate-300',
};

export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, type = 'button' }: ButtonProps) {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${btnVariants[variant]} ${sizeClass} rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'danger';
}

export function Modal({ title, children, onClose, onConfirm, confirmLabel = 'Confirm', confirmVariant = 'primary' }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a2332] border border-[#2d3a4d] rounded-lg w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d3a4d]">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-[#2d3a4d]">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          {onConfirm && (
            <Button variant={confirmVariant} onClick={onConfirm}>{confirmLabel}</Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export function Select({ value, onChange, options, placeholder, className = '' }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-[#1e2a3a] border border-[#2d3a4d] rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`bg-[#1e2a3a] border border-[#2d3a4d] rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 w-full ${className}`}
    />
  );
}

export function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`bg-[#1e2a3a] border border-[#2d3a4d] rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 w-full resize-y min-h-[80px] ${className}`}
    />
  );
}
