import { useState } from 'react';
import "../../css/componentcss/Collapsible.css"

export function CollapsibleSection({ label, children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`collapsible-section ${isOpen ? "open" : ""}`}>
            <button 
                className="collapsible-button" 
                onClick={() => setIsOpen(!isOpen)}
            >
                    {label}
            </button>
            {isOpen && <div className="collapsible-content">{children}</div>}
        </div>
    );
}