import type { ExpansionMode } from '../../lib/database.types';
import { Hammer, Globe } from 'lucide-react';

interface ModeToggleProps {
    mode: ExpansionMode;
    onChange: (mode: ExpansionMode) => void;
}

const ModeToggle = ({ mode, onChange }: ModeToggleProps) => {
    return (
        <div className="flex gap-2 p-1 bg-surface-50 rounded-xl">
            <button
                onClick={() => onChange('building')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${mode === 'building'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-surface-100'
                    }`}
            >
                <Hammer className="w-4 h-4" />
                <span>Building</span>
            </button>
            <button
                onClick={() => onChange('expanding')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${mode === 'expanding'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-surface-100'
                    }`}
            >
                <Globe className="w-4 h-4" />
                <span>Expanding</span>
            </button>
        </div>
    );
};

export default ModeToggle;
