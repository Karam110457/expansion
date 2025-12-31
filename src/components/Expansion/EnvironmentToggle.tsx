interface EnvironmentToggleProps {
    value: 0.1 | 0.5 | 0.8 | 1.0;
    onChange: (value: 0.1 | 0.5 | 0.8 | 1.0) => void;
    disabled?: boolean;
}

const EnvironmentToggle = ({ value, onChange, disabled }: EnvironmentToggleProps) => {
    const options = [
        { val: 0.1, label: 'Bedroom', sublabel: 'Trapped', color: 'border-red-500/50' },
        { val: 0.5, label: 'Downstairs', sublabel: 'Home Base', color: 'border-yellow-500/50' },
        { val: 0.8, label: 'Down + Gym', sublabel: 'Active', color: 'border-blue-500/50' },
        { val: 1.0, label: 'Library + Gym', sublabel: 'Optimal', color: 'border-neon-green' },
    ] as const;

    return (
        <div className="w-full">
            <label className="text-secondary text-sm mb-2 block font-medium uppercase tracking-wider text-gray-400">
                Environment
            </label>
            <div className="grid grid-cols-4 gap-1.5">
                {options.map((opt) => (
                    <button
                        key={opt.val}
                        onClick={() => !disabled && onChange(opt.val)}
                        disabled={disabled}
                        className={`
                            relative p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-200
                            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            ${value === opt.val
                                ? `${opt.color} bg-surface-200 shadow-[0_0_15px_-3px_rgba(0,0,0,0.3)] border-opacity-100 text-white`
                                : 'border-surface-200 bg-surface-100 text-gray-500 hover:bg-surface-200 border-opacity-50'}
                        `}
                    >
                        <span className="text-base font-bold">{opt.val}x</span>
                        <span className="text-[10px] text-center mt-0.5 font-medium leading-tight">{opt.label}</span>
                        {value === opt.val && (
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent to-white/5 pointer-events-none" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EnvironmentToggle;
