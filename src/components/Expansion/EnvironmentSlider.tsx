interface EnvironmentSliderProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

const EnvironmentSlider = ({ value, onChange, disabled }: EnvironmentSliderProps) => {
    // Get label based on value range
    const getLabel = (val: number): string => {
        if (val <= 0.1) return 'Bedroom (Trapped)';
        if (val <= 0.3) return 'Bedroom + Some Movement';
        if (val <= 0.5) return 'Downstairs (Home Base)';
        if (val <= 0.7) return 'Mixed Environment';
        if (val <= 0.8) return 'Down + Training';
        if (val <= 0.9) return 'Third Space';
        return 'Library + Gym (Optimal)';
    };

    // Get color based on value
    const getColor = (val: number): string => {
        if (val <= 0.2) return 'from-red-500 to-red-600';
        if (val <= 0.4) return 'from-orange-500 to-yellow-500';
        if (val <= 0.6) return 'from-yellow-500 to-lime-500';
        if (val <= 0.8) return 'from-lime-500 to-green-500';
        return 'from-green-500 to-emerald-500';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = parseFloat(e.target.value);
        onChange(Math.round(newVal * 10) / 10); // Round to 1 decimal
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium uppercase tracking-wider text-gray-400">
                    Environment
                </label>
                <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold bg-gradient-to-r ${getColor(value)} bg-clip-text text-transparent`}>
                        {value.toFixed(1)}x
                    </span>
                </div>
            </div>

            {/* Value label */}
            <div className="text-center mb-3">
                <span className="text-sm text-gray-300 font-medium">
                    {getLabel(value)}
                </span>
            </div>

            {/* Slider */}
            <div className="relative">
                {/* Track background */}
                <div className="absolute inset-0 h-3 rounded-full bg-surface-100 top-1/2 -translate-y-1/2" />

                {/* Filled track */}
                <div
                    className={`absolute h-3 rounded-full bg-gradient-to-r ${getColor(value)} top-1/2 -translate-y-1/2 transition-all duration-150`}
                    style={{ width: `${value * 100}%` }}
                />

                {/* Slider input */}
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    className={`relative w-full h-6 appearance-none bg-transparent cursor-pointer z-10
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-6
                        [&::-webkit-slider-thumb]:h-6
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-white/50
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:hover:scale-110
                        [&::-moz-range-thumb]:w-6
                        [&::-moz-range-thumb]:h-6
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-white
                        [&::-moz-range-thumb]:border-2
                        [&::-moz-range-thumb]:border-white/50
                        [&::-moz-range-thumb]:cursor-pointer
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                />
            </div>

            {/* Tick marks */}
            <div className="flex justify-between mt-2 px-1">
                {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((tick) => (
                    <div key={tick} className="flex flex-col items-center">
                        <div className={`w-0.5 h-1.5 rounded-full ${value >= tick ? 'bg-white/60' : 'bg-gray-600'}`} />
                        <span className="text-[10px] text-gray-500 mt-0.5">{tick}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EnvironmentSlider;
