import React, { useState, useRef, useEffect } from 'react';

interface ActionItem {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  accent?: 'danger' | 'primary' | 'neutral';
}

interface ActionMenuProps {
  items: ActionItem[];
}

export default function ActionMenu({ items }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-2 rounded-full hover:bg-slate-100 transition text-slate-500"
        aria-label="Open actions"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="3" cy="10" r="1.5" fill="currentColor" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="17" cy="10" r="1.5" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-44 rounded-lg bg-white border border-slate-200 shadow-lg z-50"
        >
          <ul className="py-1">
            {items.map((it, idx) => (
              <li key={idx}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    it.onClick(e as any);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition ${
                    it.accent === 'danger' ? 'text-red-600' : it.accent === 'primary' ? 'text-blue-600' : 'text-slate-700'
                  }`}
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
