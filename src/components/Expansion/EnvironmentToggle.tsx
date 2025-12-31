interface EnvironmentToggleProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

const EnvironmentToggle = ({ value, onChange, disabled }: EnvironmentToggleProps) => {
    const percentage = (value / 1) * 100;

    // Helper function to get label based on value
    const getLabel = (val: number): string => {
        if (val <= 0.2) return 'Bedroom / Trapped';
        if (val <= 0.4) return 'Home Base';
        if (val <= 0.6) return 'Mixed Spaces';
        if (val <= 0.8) return 'Active / Gym';
        return 'Library / Optimal';
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium uppercase tracking-wider text-gray-400">
                    Environment
                </label>
                <span className="text-blue-400 font-bold text-lg">
                    {value.toFixed(1)}x
                </span>
            </div>

            <div className="relative w-full h-10 flex items-center">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={value}
                    onChange={(e) => !disabled && onChange(Number(e.target.value))}
                    disabled={disabled}
                    className={`w-full h-2 bg-surface-200 rounded-lg appearance-none focus:outline-none z-10 ${
                        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #2d2d2d ${percentage}%, #2d2d2d 100%)`
                    }}
                />
            </div>

            {/* Current value description */}
            <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="font-medium text-blue-400 text-sm">{getLabel(value)}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                    Mix of environments: home, gym, library, etc.
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-2 text-center">
                Adjust for your environment mix (0.0 = bedroom, 1.0 = optimal spaces)
            </p>

            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 22px;
                    width: 22px;
                    border-radius: 50%;
                    background: #ffffff;
                    box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
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
                input[type=range]:disabled::-webkit-slider-thumb {
                    cursor: not-allowed;
                    opacity: 0.5;
                }
                input[type=range]:disabled::-moz-range-thumb {
                    cursor: not-allowed;
                    opacity: 0.5;
                }
            `}</style>
        </div>
    );
};

export default EnvironmentToggle;
