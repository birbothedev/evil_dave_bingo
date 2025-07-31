import { useState } from 'react';

export function CollapsibleSection({ label, children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="collapsible-section">
            <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? 'Collapse' : 'Expand'} {label}
            </button>
            {isOpen && <div className="collapsible-content">{children}</div>}
        </div>
    );
}