// ─── Project Status ──────────────────────────────────────────

export const PROJECT_STATUS = {
  nouveau:    { label: "Nouveau",    emoji: "🆕", color: "violet" },
  en_cours:   { label: "En cours",   emoji: "🔄", color: "blue" },
  en_recette: { label: "En recette", emoji: "🧪", color: "orange" },
  termine:    { label: "Terminé",    emoji: "✅", color: "green" },
} as const;

export type ProjectStatusKey = keyof typeof PROJECT_STATUS;

// ─── Invoice Status ──────────────────────────────────────────

export const INVOICE_STATUS = {
  draft:    { label: "Draft",    emoji: "📝", color: "gray" },
  sent:     { label: "Sent",     emoji: "📤", color: "blue" },
  paid:     { label: "Paid",     emoji: "💰", color: "green" },
  overdue:  { label: "Overdue",  emoji: "🔴", color: "red" },
  reminded: { label: "Reminded", emoji: "🔔", color: "orange" },
} as const;

export type InvoiceStatusKey = keyof typeof INVOICE_STATUS;

// ─── Issue Status ────────────────────────────────────────────

export const ISSUE_STATUS = {
  open:        { label: "Open",        emoji: "📥", color: "gray" },
  in_progress: { label: "In Progress", emoji: "🔄", color: "blue" },
  resolved:    { label: "Resolved",    emoji: "✅", color: "green" },
  closed:      { label: "Closed",      emoji: "🟣", color: "violet" },
  wont_fix:    { label: "Won't Fix",   emoji: "⏭️", color: "slate" },
} as const;

export type IssueStatusKey = keyof typeof ISSUE_STATUS;

// ─── Issue Priority ──────────────────────────────────────────

export const ISSUE_PRIORITY = {
  critical: { label: "Critical", emoji: "🔴", color: "red" },
  high:     { label: "High",     emoji: "🟠", color: "orange" },
  medium:   { label: "Medium",   emoji: "🟡", color: "yellow" },
  low:      { label: "Low",      emoji: "🔵", color: "blue" },
} as const;

export type IssuePriorityKey = keyof typeof ISSUE_PRIORITY;

// ─── Issue Type ──────────────────────────────────────────────

export const ISSUE_TYPE = {
  bug:         { label: "Bug",         emoji: "🐛" },
  improvement: { label: "Improvement", emoji: "✨" },
  task:        { label: "Task",        emoji: "📌" },
} as const;

export type IssueTypeKey = keyof typeof ISSUE_TYPE;

// ─── Task Status ─────────────────────────────────────────────

export const TASK_STATUS = {
  todo:        { label: "To Do",       emoji: "📥", color: "gray" },
  in_progress: { label: "In Progress", emoji: "🔄", color: "blue" },
  done:        { label: "Done",        emoji: "✅", color: "green" },
} as const;

export type TaskStatusKey = keyof typeof TASK_STATUS;

// ─── Task Priority ───────────────────────────────────────────

export const TASK_PRIORITY = {
  urgent: { label: "Urgent", emoji: "🔴", color: "red" },
  normal: { label: "Normal", emoji: "🟡", color: "yellow" },
  low:    { label: "Low",    emoji: "🔵", color: "blue" },
} as const;

export type TaskPriorityKey = keyof typeof TASK_PRIORITY;

// ─── Default Categories ─────────────────────────────────────

export const DEFAULT_CATEGORIES = [
  { name: "billing",   emoji: "💰", color: "green" },
  { name: "admin",     emoji: "📋", color: "blue" },
  { name: "sales",     emoji: "🤝", color: "violet" },
  { name: "marketing", emoji: "📢", color: "orange" },
  { name: "other",     emoji: "⚙️", color: "gray" },
] as const;

// ─── Project Tags ────────────────────────────────────────────

export const PROJECT_TAGS = [
  "site-web",
  "app-mobile",
  "branding",
  "maintenance",
  "e-commerce",
  "consulting",
] as const;

export type ProjectTag = (typeof PROJECT_TAGS)[number];
