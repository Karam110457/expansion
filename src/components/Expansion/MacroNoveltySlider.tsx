import { useState } from 'react';

interface MacroNoveltySliderProps {
    value: number;
    onChange: (value: number) => void;
}

// Realistic everyday novelty scale - not just geographic
const NOVELTY_LABELS: Record<number, { label: string; description: string }> = {
    1: { label: 'Regular day', description: 'Nothing new or different' },
    2: { label: 'Small change', description: 'New route, new music, minor tweak' },
    3: { label: 'New local spot', description: 'New café, restaurant, or park' },
    4: { label: 'New activity', description: 'Tried something different (new hobby, class)' },
    5: { label: 'New social', description: 'Met new people or attended an event' },
    6: { label: 'New neighborhood', description: 'Explored unfamiliar part of city' },
    7: { label: 'Day trip', description: 'Visited a new town or area' },
    8: { label: 'New city', description: 'Traveling to somewhere new' },
    9: { label: 'Travel abroad', description: 'International adventure' },
    10: { label: 'Life milestone', description: 'Once-in-a-lifetime experience' },
};

const MacroNoveltySlider = ({ value, onChange }: MacroNoveltySliderProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const percentage = ((value - 1) / 9) * 100;

    const currentLabel = NOVELTY_LABELS[value] || NOVELTY_LABELS[5];

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium uppercase tracking-wider text-gray-400">
                    Novelty Level
                </label>
                <span className="text-amber-400 font-bold text-lg">
                    {value}/10
                </span>
            </div>

            <div className="relative w-full h-10 flex items-center">
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer focus:outline-none z-10"
                    style={{
                        background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${percentage}%, #2d2d2d ${percentage}%, #2d2d2d 100%)`
                    }}
                />
            </div>

            {/* Current level description */}
            <div className={`mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 transition-all duration-200 ${isDragging ? 'scale-[1.02]' : ''
                }`}>
                <div className="font-medium text-amber-400 text-sm">{currentLabel.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{currentLabel.description}</div>
            </div>

            {/* Quick hint */}
            <p className="text-xs text-gray-500 mt-2 text-center">
                Most expanding days are 3-6 (new spots, activities, people)
            </p>

            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 22px;
                    width: 22px;
                    border-radius: 50%;
                    background: #ffffff;
                    box-shadow: 0 0 12px rgba(245, 158, 11, 0.5);
                    cursor: pointer;
                    margin-top: -8px;
                }
                input[type=range]::-moz-range-thumb {
                    height: 22px;
                    width: 22px;
                    border-radius: 50%;
                    background: #ffffff;
                    cursor: pointer;
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default MacroNoveltySlider;
