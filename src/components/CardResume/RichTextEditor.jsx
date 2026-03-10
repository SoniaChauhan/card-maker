'use client';
import { useRef, useCallback, useEffect } from 'react';

/* strip HTML tags & decode entities so stored HTML values become clean text */
function stripHtml(str) {
  if (!str || !/<|&\w+;/.test(str)) return str; // already plain text
  const tmp = document.createElement('div');
  tmp.innerHTML = str;
  return tmp.innerText || tmp.textContent || '';
}

/* ── tiny toolbar rich-text editor using contentEditable ── */
const BUTTONS = [
  { cmd: 'bold',          icon: 'B',  cls: 'rte-b',  title: 'Bold' },
  { cmd: 'italic',        icon: 'I',  cls: 'rte-i',  title: 'Italic' },
  { cmd: 'underline',     icon: 'U',  cls: 'rte-u',  title: 'Underline' },
  { cmd: 'insertUnorderedList', icon: '☰', cls: '', title: 'Bullet list' },
  { cmd: 'strikeThrough', icon: 'AB', cls: 'rte-s',  title: 'Strikethrough' },
  'sep',
  { cmd: 'strikeThrough', icon: 'T',  cls: 'rte-st', title: 'Strikethrough text' },
  { cmd: 'createLink',    icon: '🔗', cls: '',        title: 'Insert link' },
  { cmd: 'undo',          icon: '↩',  cls: '',        title: 'Undo' },
  { cmd: 'redo',          icon: '↪',  cls: '',        title: 'Redo' },
];

export default function RichTextEditor({ value, onChange, placeholder, rows = 4 }) {
  const editorRef = useRef(null);
  const initialized = useRef(false);

  /* sync plain text → parent on every input (templates expect plain text, not HTML) */
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerText);
    }
  }, [onChange]);

  /* set initial content once — convert stored value to plain text lines */
  const refCb = useCallback((node) => {
    editorRef.current = node;
    if (node && !initialized.current) {
      node.innerText = stripHtml(value || '');
      initialized.current = true;
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  /* sync when parent value is reset externally (e.g. reset button) */
  useEffect(() => {
    if (editorRef.current && initialized.current) {
      const clean = stripHtml(value || '');
      if (editorRef.current.innerText !== clean) {
        editorRef.current.innerText = clean;
      }
    }
  }, [value]);

  /* paste as plain text so stray HTML tags are never inserted */
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  /* execute formatting command */
  function exec(cmd) {
    if (cmd === 'createLink') {
      const url = prompt('Enter URL:', 'https://');
      if (url) document.execCommand(cmd, false, url);
    } else {
      document.execCommand(cmd, false, null);
    }
    editorRef.current?.focus();
    handleInput();
  }

  const minH = Math.max(80, rows * 24);

  return (
    <div className="rte-wrapper">
      {/* Toolbar */}
      <div className="rte-toolbar">
        {BUTTONS.map((btn, i) =>
          btn === 'sep' ? (
            <span key={i} className="rte-sep" />
          ) : (
            <button
              key={i}
              type="button"
              className={`rte-btn ${btn.cls}`}
              title={btn.title}
              onMouseDown={(e) => { e.preventDefault(); exec(btn.cmd); }}
            >
              {btn.icon}
            </button>
          )
        )}
      </div>

      {/* Editable area */}
      <div
        ref={refCb}
        className="rte-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onBlur={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight: minH }}
      />
    </div>
  );
}
