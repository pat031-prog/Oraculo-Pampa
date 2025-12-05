import React from 'react';

/**
 * Simple Markdown to React renderer
 * Handles basic markdown formatting without external dependencies
 */

export const parseMarkdown = (text: string): React.ReactNode => {
    if (!text) return null;

    // Split by double newlines for paragraphs
    const blocks = text.split('\n\n');

    return blocks.map((block, blockIndex) => {
        // Handle headers
        if (block.startsWith('### ')) {
            return (
                <h3 key={blockIndex} className="text-lg sm:text-xl font-bold text-[#00ff88] mt-4 mb-2 [text-shadow:0_0_8px_#00ff88]">
                    {processInlineMarkdown(block.replace('### ', ''))}
                </h3>
            );
        }
        if (block.startsWith('## ')) {
            return (
                <h2 key={blockIndex} className="text-xl sm:text-2xl font-bold text-[#00ff88] mt-4 mb-2 [text-shadow:0_0_10px_#00ff88]">
                    {processInlineMarkdown(block.replace('## ', ''))}
                </h2>
            );
        }
        if (block.startsWith('# ')) {
            return (
                <h1 key={blockIndex} className="text-2xl sm:text-3xl font-bold text-[#00ff88] mt-4 mb-3 [text-shadow:0_0_12px_#00ff88]">
                    {processInlineMarkdown(block.replace('# ', ''))}
                </h1>
            );
        }

        // Handle lists
        if (block.match(/^[-*]\s/m)) {
            const items = block.split('\n').filter(line => line.trim());
            return (
                <ul key={blockIndex} className="list-disc list-inside space-y-1 my-2 ml-4">
                    {items.map((item, i) => (
                        <li key={i} className="text-[#e8ffe8]">
                            {processInlineMarkdown(item.replace(/^[-*]\s/, ''))}
                        </li>
                    ))}
                </ul>
            );
        }

        // Handle numbered lists
        if (block.match(/^\d+\.\s/m)) {
            const items = block.split('\n').filter(line => line.trim());
            return (
                <ol key={blockIndex} className="list-decimal list-inside space-y-1 my-2 ml-4">
                    {items.map((item, i) => (
                        <li key={i} className="text-[#e8ffe8]">
                            {processInlineMarkdown(item.replace(/^\d+\.\s/, ''))}
                        </li>
                    ))}
                </ol>
            );
        }

        // Handle code blocks
        if (block.startsWith('```')) {
            const code = block.replace(/```[\w]*\n?/, '').replace(/```$/, '');
            return (
                <pre key={blockIndex} className="bg-[rgba(0,0,0,0.5)] border border-[rgba(0,255,136,0.3)] rounded-sm p-3 my-2 overflow-x-auto">
                    <code className="text-[#00ff88] text-sm font-mono">{code}</code>
                </pre>
            );
        }

        // Regular paragraph
        return (
            <p key={blockIndex} className="text-[#e8ffe8] my-2 leading-relaxed">
                {processInlineMarkdown(block)}
            </p>
        );
    });
};

const processInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let key = 0;

    // Regex patterns for inline formatting
    const patterns = [
        { regex: /\*\*([^*]+)\*\*/g, render: (match: string) => <strong key={key++} className="font-bold text-[#00d9ff]">{match}</strong> },
        { regex: /__([^_]+)__/g, render: (match: string) => <strong key={key++} className="font-bold text-[#00d9ff]">{match}</strong> },
        { regex: /\*([^*]+)\*/g, render: (match: string) => <em key={key++} className="italic text-[#ffcc00]">{match}</em> },
        { regex: /_([^_]+)_/g, render: (match: string) => <em key={key++} className="italic text-[#ffcc00]">{match}</em> },
        { regex: /`([^`]+)`/g, render: (match: string) => <code key={key++} className="bg-[rgba(0,255,136,0.1)] px-1 py-0.5 rounded text-[#00ff88] font-mono text-sm">{match}</code> },
        { regex: /\[([^\]]+)\]\(([^)]+)\)/g, render: (match: string, text: string, url: string) => <a key={key++} href={url} target="_blank" rel="noopener noreferrer" className="text-[#00d9ff] underline hover:text-[#ffcc00] transition-colors">{text}</a> },
    ];

    // Find all matches
    const allMatches: Array<{ start: number; end: number; element: React.ReactNode }> = [];

    patterns.forEach(({ regex, render }) => {
        const matches = Array.from(text.matchAll(regex));
        matches.forEach(match => {
            if (match.index !== undefined) {
                allMatches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    element: render(match[1], match[1], match[2])
                });
            }
        });
    });

    // Sort matches by position
    allMatches.sort((a, b) => a.start - b.start);

    // Build the result
    allMatches.forEach(({ start, end, element }) => {
        if (start > currentIndex) {
            parts.push(text.substring(currentIndex, start));
        }
        parts.push(element);
        currentIndex = end;
    });

    // Add remaining text
    if (currentIndex < text.length) {
        parts.push(text.substring(currentIndex));
    }

    return parts.length > 0 ? parts : text;
};

/**
 * Markdown component that renders markdown text
 */
interface MarkdownProps {
    children: string;
    className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ children, className = '' }) => {
    return (
        <div className={`markdown-content ${className}`}>
            {parseMarkdown(children)}
        </div>
    );
};

export default Markdown;
