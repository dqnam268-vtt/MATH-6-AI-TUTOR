import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    let text = content;

    // Step 0: Handle code blocks before math/markdown replacement
    const codeBlocks: string[] = [];
    text = text.replace(/```([\s\S]*?)```/g, (_, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push(code);
      return `@@@CODEBLOCK_${idx}@@@`;
    });

    // Step 1: Standardize LaTeX delimiters: \[...\] to $$...$$ and \(...\) to $...$
    text = text.replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$');
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');

    // Step 2: Handle block math $$...$$
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      try {
        const rendered = katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
          strict: false,
          trust: true,
          macros: {
            '\\N': '\\mathbb{N}',
            '\\Z': '\\mathbb{Z}',
            '\\Q': '\\mathbb{Q}',
            '\\R': '\\mathbb{R}',
            '\\UCLN': '\\text{ƯCLN}',
            '\\BCNN': '\\text{BCNN}',
            '\\deg': '^\\circ'
          }
        });
        return `<div class="my-2.5 py-2 px-3 overflow-x-auto bg-slate-50/90 rounded-xl border border-slate-200 text-center font-medium shadow-2xs">${rendered}</div>`;
      } catch (err) {
        return `<div class="text-rose-600 bg-rose-50 p-2 rounded text-sm">${math}</div>`;
      }
    });

    // Step 3: Handle inline math $...$
    text = text.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        const rendered = katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
          strict: false,
          trust: true,
          macros: {
            '\\N': '\\mathbb{N}',
            '\\Z': '\\mathbb{Z}',
            '\\Q': '\\mathbb{Q}',
            '\\R': '\\mathbb{R}',
            '\\UCLN': '\\text{ƯCLN}',
            '\\BCNN': '\\text{BCNN}',
            '\\deg': '^\\circ'
          }
        });
        return `<span class="inline-math px-0.5 align-middle">${rendered}</span>`;
      } catch (err) {
        return `<span class="text-rose-600">${math}</span>`;
      }
    });

    // Step 4: Handle Markdown Tables
    text = text.replace(/((\|[^\n]+\|\r?\n)((?:\|:?[-]+:?)+\|)(\r?\n(?:\|[^\n]+\|\r?\n?)+))/g, (match) => {
      const lines = match.trim().split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return match;
      
      const headerCells = lines[0].split('|').slice(1, -1).map(c => c.trim());
      const bodyRows = lines.slice(2);

      let html = '<div class="overflow-x-auto my-3 rounded-xl border border-slate-200 shadow-2xs"><table class="w-full text-xs text-left text-slate-700">';
      html += '<thead class="text-xs text-slate-900 uppercase bg-slate-100 border-b border-slate-200 font-bold"><tr>';
      headerCells.forEach(cell => {
        html += `<th scope="col" class="px-3.5 py-2.5">${cell}</th>`;
      });
      html += '</tr></thead><tbody>';

      bodyRows.forEach((rowStr, rIdx) => {
        const cells = rowStr.split('|').slice(1, -1).map(c => c.trim());
        const bg = rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60';
        html += `<tr class="${bg} border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition-colors">`;
        cells.forEach(cell => {
          html += `<td class="px-3.5 py-2.5 font-medium">${cell}</td>`;
        });
        html += '</tr>';
      });

      html += '</tbody></table></div>';
      return html;
    });

    // Step 5: Handle Headers
    text = text.replace(/^#### (.*$)/gim, '<h5 class="text-sm font-bold text-slate-800 mt-2.5 mb-1">$1</h5>');
    text = text.replace(/^### (.*$)/gim, '<h4 class="text-base font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-1.5">$1</h4>');
    text = text.replace(/^## (.*$)/gim, '<h3 class="text-lg font-bold text-blue-950 mt-4 mb-2 flex items-center gap-2 pb-1 border-b border-slate-200">$1</h3>');
    text = text.replace(/^# (.*$)/gim, '<h2 class="text-xl font-extrabold text-blue-950 mt-4 mb-2">$1</h2>');

    // Step 6: Bold, Italic, Strikethrough, Inline Code
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>');
    text = text.replace(/~~(.*?)~~/g, '<del class="line-through text-slate-400">$1</del>');
    text = text.replace(/`([^`\n]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[12px] border border-slate-200">$1</code>');

    // Step 7: Blockquotes
    text = text.replace(/^\>\s+(.*?)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-3 py-1 my-2 bg-blue-50/50 rounded-r-lg text-slate-700 italic text-xs sm:text-sm">$1</blockquote>');

    // Step 8: Callout highlights
    text = text.replace(/^(📚|🎯|💡|👉|🧠|⭐|⚠️|📌|🔍|✏️|🏆|🌎|📊|⚡|✅|❌|❓)\s*(.*?)$/gm, 
      '<div class="flex items-start gap-2.5 my-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed"><span class="text-base flex-shrink-0 select-none mt-0.5">$1</span><div class="flex-1">$2</div></div>');

    // Step 9: Reinsert code blocks
    text = text.replace(/@@@CODEBLOCK_(\d+)@@@/g, (_, id) => {
      const code = codeBlocks[parseInt(id)] || '';
      return `<pre class="my-2.5 p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    });

    // Step 10: Lists & Paragraphs
    const paragraphs = text.split(/\n{2,}/);
    return paragraphs
      .map(p => {
        const trimmed = p.trim();
        if (!trimmed) return '';
        if (
          trimmed.startsWith('<div') || 
          trimmed.startsWith('<h') || 
          trimmed.startsWith('<table') || 
          trimmed.startsWith('<pre') ||
          trimmed.startsWith('<blockquote')
        ) {
          return trimmed;
        }

        // Check if paragraph is list items
        if (trimmed.split('\n').every(line => /^[-*•]\s+/.test(line.trim()))) {
          const listItems = trimmed.split('\n').map(line => {
            const item = line.trim().replace(/^[-*•]\s+/, '');
            return `<li class="flex items-start gap-2"><span class="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span><div class="flex-1">${item}</div></li>`;
          }).join('');
          return `<ul class="space-y-1.5 my-2 text-xs sm:text-sm">${listItems}</ul>`;
        }

        if (trimmed.split('\n').every(line => /^\d+[\.\)]\s+/.test(line.trim()))) {
          const listItems = trimmed.split('\n').map(line => {
            const numMatch = line.trim().match(/^(\d+)[\.\)]\s+(.*)/);
            if (numMatch) {
              return `<li class="flex items-start gap-2"><span class="font-bold text-blue-600 text-xs flex-shrink-0 w-4">${numMatch[1]}.</span><div class="flex-1">${numMatch[2]}</div></li>`;
            }
            return `<li>${line}</li>`;
          }).join('');
          return `<ol class="space-y-1.5 my-2 text-xs sm:text-sm">${listItems}</ol>`;
        }

        return `<p class="my-1.5 leading-relaxed text-slate-800 text-xs sm:text-sm">${trimmed.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('');
  }, [content]);

  return (
    <div 
      className={`prose-math text-slate-800 text-xs sm:text-sm leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

