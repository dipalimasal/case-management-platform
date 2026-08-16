import customersData from '../mock/customers.json';
import transactionsData from '../mock/transactions.json';
import securityEventsData from '../mock/security-events.json';
import usersData from '../mock/users.json';
import type {
  CustomerRecord,
  TransactionRecord,
  SecurityEventRecord,
  UserRecord,
} from '../types/screening';

export async function getCustomers(): Promise<CustomerRecord[]> {
  return customersData as CustomerRecord[];
}

export async function getCustomerById(id: string): Promise<CustomerRecord | null> {
  const customers = await getCustomers();
  return customers.find((c) => c.id === id) ?? null;
}

export async function getTransactions(): Promise<TransactionRecord[]> {
  return transactionsData as TransactionRecord[];
}

export async function getTransactionById(id: string): Promise<TransactionRecord | null> {
  const transactions = await getTransactions();
  return transactions.find((t) => t.id === id) ?? null;
}

export async function getSecurityEvents(): Promise<SecurityEventRecord[]> {
  return securityEventsData as SecurityEventRecord[];
}

export async function getSecurityEventById(id: string): Promise<SecurityEventRecord | null> {
  const events = await getSecurityEvents();
  return events.find((e) => e.id === id) ?? null;
}

export async function getUsers(): Promise<UserRecord[]> {
  return usersData as UserRecord[];
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) ?? null;
}

export function getScreeningTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    CUSTOMER_SCREENING: 'Customer Screening',
    TRANSACTION_SCREENING: 'Transaction Screening',
    SECURITY_SCREENING: 'Security Screening',
  };
  return labels[type] ?? type;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    MEDIUM: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    HIGH: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    CRITICAL: 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return colors[priority] ?? 'bg-slate-500/20 text-slate-300';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    NEW: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    L1_INVESTIGATION: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    L2_INVESTIGATION: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    L3_INVESTIGATION: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    ON_HOLD: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    RESOLVED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    CLOSED: 'bg-slate-600/20 text-slate-500 border-slate-600/30',
  };
  return colors[status] ?? 'bg-slate-500/20 text-slate-300';
}

export function getRiskColor(score: number): string {
  if (score >= 80) return 'text-red-400';
  if (score >= 60) return 'text-amber-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-emerald-400';
}

export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
