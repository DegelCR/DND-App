export function renderSimpleMarkdown(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped
    .replace(/^### (.+)$/gm, '<h3 class="font-display text-base text-gold-300 mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-display text-lg text-gold-400 mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-display text-xl text-gold-400 mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-table-100">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-table-800 px-1 text-gold-300">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, '<br/>')
}
