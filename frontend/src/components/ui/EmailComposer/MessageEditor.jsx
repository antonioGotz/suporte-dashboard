import React, { useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { HoverControl } from './EmailComposer.styles';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import './MessageEditor.css';

const FallbackTextarea = ({ value, onChange }) => (
    <div className="fallback-textarea-container">
        <textarea
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="fallback-textarea"
        />
    </div>
);

const EditorToolbar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const addLink = useCallback(() => {
        const url = window.prompt('Insira a URL (ex: https://example.com)');
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    }, [editor]);

    const removeLink = useCallback(() => {
        editor.chain().focus().unsetLink().run();
    }, [editor]);

    const buttons = [
        { id: 'bold', label: 'B', action: () => editor.chain().focus().toggleBold().run() },
        { id: 'italic', label: 'I', action: () => editor.chain().focus().toggleItalic().run() },
        { id: 'underline', label: 'U', action: () => editor.chain().focus().toggleUnderline().run() },
        { id: 'heading', level: 2, label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
        { id: 'bulletList', label: '• List', action: () => editor.chain().focus().toggleBulletList().run() },
        { id: 'orderedList', label: '1. List', action: () => editor.chain().focus().toggleOrderedList().run() },
        { id: 'link', label: 'Link', action: addLink },
        { id: 'unlink', label: 'Unlink', action: removeLink, active: false },
    ];

    return (
        <div className="message-editor-toolbar">
            {buttons.map(btn => (
                <button
                    key={btn.id}
                    type="button"
                    onClick={btn.action}
                    className={`toolbar-button ${editor.isActive(btn.id, btn.level) ? 'active' : ''}`}
                >
                    {btn.label}
                </button>
            ))}
        </div>
    );
};

const MessageEditor = ({ value = '', onChange, height = 300 }) => {
    const [useFallback, setUseFallback] = useState(typeof window === 'undefined');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: true }),
            Placeholder.configure({ placeholder: 'Escreva sua mensagem aqui...' }),
        ],
        content: value || '<p></p>',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange && onChange(html);
        },
    });

    useEffect(() => {
        if (editor) {
            // This part handles external updates to the 'value' prop
            const isSame = editor.getHTML() === value;
            if (!isSame) {
                editor.commands.setContent(value, false);
            }
        }
    }, [value, editor]);
    
    // Fallback for environments where Tiptap might fail (e.g., server-side rendering)
    if (useFallback) {
        return <FallbackTextarea value={value} onChange={onChange} />;
    }

    // Pass CSS variable to control height from parent
    const style = { ['--message-editor-height']: `${height}px` };

    return (
        <HoverControl style={style}>
            <div className="message-editor-container">
                <EditorToolbar editor={editor} />
                <EditorContent editor={editor} />
            </div>
        </HoverControl>
    );
};

export default MessageEditor;