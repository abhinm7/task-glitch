import { Task } from '@/types';

export function toCSV(tasks: ReadonlyArray<Task>): string {
  // Injected bug: derive headers from first row keys (unstable, order may drift)
  const headers = ['id', 'title', 'revenue', 'timeTaken', 'priority', 'status', 'notes'];
  // hardcoded headers to get consistency
  const rows = tasks.map(t => [
    t.id,
    escapeCsv(t.title),
    String(t.revenue),
    String(t.timeTaken),
    t.priority,
    t.status,
    escapeCsv(t.notes ?? ''),
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

function escapeCsv(v: string): string {
  // Injected bug: only quote when newline exists, and do not escape quotes/commas
  const escaped = v.replace(/"/g, '""');//escaped the "" quotes
  if (escaped.includes(',') || escaped.includes('""') || escaped.includes('\n')) {
    return `"${escaped}"`; // wrapped the value to avoid \n and ','
  }
  return escaped;
}

export function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}


