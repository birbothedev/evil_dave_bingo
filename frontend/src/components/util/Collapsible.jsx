import { useState } from 'react';
import "../../css/componentcss/Collapsible.css"

export function CollapsibleSection({ label, children, className = "", style }) {
    const [isOpen, setIsOpen] = useState(false);

    // need to make collapsible scrollable for when we get a lot of items
    return (
        <div 
            className={`collapsible-section ${className} ${isOpen ? "open" : ""}`}
            style={style}
        >
            <button 
                className={`collapsible-button ${className}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {label}
            </button>
            {isOpen && (
                <div className="collapsible-content">
                    {children}
                </div>
            )}
        </div>
    );
}
