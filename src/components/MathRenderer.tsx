import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // Step 1: Handle block math $$...$$
    let text = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      try {
        return `<div class="my-2 py-1.5 px-3 overflow-x-auto bg-slate-50/80 rounded-lg border border-slate-200/60 text-center font-medium">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
      } catch (err) {
        return `<div class="text-rose-600 bg-rose-50 p-2 rounded text-sm">${math}</div>`;
      }
    });

    // Step 2: Handle inline math $...$
    text = text.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        return `<span class="inline-math font-serif px-0.5">${katex.renderToString(math.trim(), { displayMode: false, throwOnError: false })}</span>`;
      } catch (err) {
        return `<span class="text-rose-600">${math}</span>`;
      }
    });

    // Step 3: Handle basic markdown formatting (bold, italic, lists, quotes, badges)
    // Headers
    text = text.replace(/^### (.*$)/gim, '<h4 class="text-base font-bold text-slate-800 mt-3 mb-1.5 flex items-center gap-1.5">$1</h4>');
    text = text.replace(/^## (.*$)/gim, '<h3 class="text-lg font-bold text-indigo-900 mt-4 mb-2 flex items-center gap-2 pb-1 border-b border-indigo-100">$1</h3>');
    text = text.replace(/^# (.*$)/gim, '<h2 class="text-xl font-extrabold text-indigo-950 mt-4 mb-2">$1</h2>');

    // Bold & Italic
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>');

    // Callout highlights like 📚, 🎯, 💡, 👉, 🔴, 🟡, 🟢, 📊
    text = text.replace(/^(📚|🎯|💡|👉|🧠|⭐|⚠️|📌|🔍|✏️|🏆|🌎|📊|⚡)\s*(.*?)$/gm, 
      '<div class="flex items-start gap-2.5 my-2 p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/50 text-slate-800 text-sm leading-relaxed"><span class="text-lg flex-shrink-0 select-none">$1</span><div class="flex-1">$2</div></div>');

    // Line breaks to <br/> if not within HTML tags
    const paragraphs = text.split('\n\n');
    return paragraphs
      .map(p => {
        const trimmed = p.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<div') || trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol')) {
          return trimmed;
        }
        return `<p class="my-1.5 leading-relaxed text-slate-700">${trimmed.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('');
  }, [content]);

  return (
    <div 
      className={`prose-math text-slate-800 text-sm md:text-base leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
