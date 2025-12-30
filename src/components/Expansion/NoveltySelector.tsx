import { useState } from 'react';

type NoveltyValue = 1 | 3 | 5 | 7 | 10;

interface NoveltyOption {
    value: NoveltyValue;
    emoji: string;
    label: string;
    description: string;
    glowColor: string;
}

const NOVELTY_OPTIONS: NoveltyOption[] = [
    { value: 1, emoji: '🔄', label: 'Same Routine', description: 'Nothing new today', glowColor: 'rgba(107, 114, 128, 0.3)' },
    { value: 3, emoji: '🌱', label: 'Small Step', description: 'One new thing', glowColor: 'rgba(34, 197, 94, 0.4)' },
    { value: 5, emoji: '🚀', label: 'Pattern Break', description: 'Broke a habit', glowColor: 'rgba(0, 243, 255, 0.4)' },
    { value: 7, emoji: '⚡', label: 'First Time', description: 'New experience', glowColor: 'rgba(0, 243, 255, 0.6)' },
    { value: 10, emoji: '🌋', label: 'Full Expansion', description: 'Outside comfort zone', glowColor: 'rgba(189, 0, 255, 0.5)' },
];

interface NoveltySelectorProps {
    value: number;
    onChange: (value: 1 | 3 | 5 | 7 | 10) => void;
}

const NoveltySelector = ({ value, onChange }: NoveltySelectorProps) => {

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const getOptionStyles = (isSelected: boolean, isHovered: boolean) => {
        const baseStyles = 'relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden';

        if (isSelected) {
            return `${baseStyles} border-white/30 bg-surface-200 scale-105 z-10`;
        }
        if (isHovered) {
            return `${baseStyles} border-surface-300 bg-surface-100 scale-102`;
        }
        return `${baseStyles} border-surface-200 bg-surface-50 hover:border-surface-300`;
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium uppercase tracking-wider text-gray-400">
                    Novelty
                </label>
                <span className="text-neon-blue font-bold text-lg">
                    {value}/10
                </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
                {NOVELTY_OPTIONS.map((option, index) => {
                    const isSelected = value === option.value;
                    const isHovered = hoveredIndex === index;

                    return (
                        <button
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={getOptionStyles(isSelected, isHovered)}
                            style={{
                                boxShadow: isSelected
                                    ? `0 0 25px ${option.glowColor}, 0 0 50px ${option.glowColor}`
                                    : isHovered
                                        ? `0 0 15px ${option.glowColor}`
                                        : 'none',
                            }}
                        >
                            {/* Glow overlay */}
                            {isSelected && (
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-20 animate-pulse"
                                    style={{ background: `radial-gradient(circle at center, ${option.glowColor} 0%, transparent 70%)` }}
                                />
                            )}

                            {/* Emoji */}
                            <span
                                className={`text-2xl transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}
                                style={{
                                    filter: isSelected ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' : 'none'
                                }}
                            >
                                {option.emoji}
                            </span>

                            {/* Value badge */}
                            <span className={`text-[10px] font-bold mt-1 transition-colors duration-200 ${isSelected ? 'text-white' : 'text-gray-500'
                                }`}>
                                {option.value}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Description */}
            <div className="mt-3 h-6 flex items-center justify-center">
                <p className="text-xs text-gray-400 text-center transition-all duration-200">
                    {NOVELTY_OPTIONS.find(o => o.value === value)?.description || 'How new was today?'}
                </p>
            </div>
        </div>
    );
};

export default NoveltySelector;
