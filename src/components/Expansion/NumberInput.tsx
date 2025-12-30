
interface NumberInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    color?: 'blue' | 'green' | 'red' | 'yellow';
    subLabel?: string;
}

const NumberInput = ({ label, value, onChange, color = 'blue', subLabel }: NumberInputProps) => {
    const borderColor = {
        blue: 'focus-within:border-neon-blue',
        green: 'focus-within:border-neon-green',
        red: 'focus-within:border-red-500',
        yellow: 'focus-within:border-amber-500',
    }[color];

    const textColor = {
        blue: 'text-neon-blue',
        green: 'text-neon-green',
        red: 'text-red-500',
        yellow: 'text-amber-400',
    }[color];


    return (
        <div className={`p-4 bg-surface-100 rounded-xl border border-surface-200 transition-colors ${borderColor}`}>
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
            </div>
            <div className="flex items-end gap-2">
                <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={value === 0 ? '' : value}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        onChange(isNaN(val) ? 0 : val);
                    }}
                    placeholder="0"
                    className={`bg-transparent text-3xl font-bold outline-none w-full ${textColor} placeholder-surface-300`}
                />
                <span className="text-sm text-gray-500 mb-1.5 font-medium">hrs</span>
            </div>
            {subLabel && <p className="text-xs text-gray-600 mt-1">{subLabel}</p>}
        </div>
    );
};

export default NumberInput;
