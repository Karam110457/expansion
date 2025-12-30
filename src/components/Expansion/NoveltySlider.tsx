import { useRef } from "react";

interface NoveltySliderProps {
    value: number;
    onChange: (value: number) => void;
}

const NoveltySlider = ({ value, onChange }: NoveltySliderProps) => {
    const ref = useRef<HTMLInputElement>(null);

    // Calculate percentage for background fill
    const percentage = ((value - 1) / 9) * 100;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <label className="text-secondary text-sm font-medium uppercase tracking-wider text-gray-400">Novelty</label>
                <span className="text-neon-blue font-bold text-lg">{value}/10</span>
            </div>
            <div className="relative w-full h-8 flex items-center">
                <input
                    ref={ref}
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer focus:outline-none z-10"
                    style={{
                        background: `linear-gradient(to right, #00f3ff 0%, #00f3ff ${percentage}%, #2d2d2d ${percentage}%, #2d2d2d 100%)`
                    }}
                />
                {/* Custom thumb styles are usually handled via CSS/Tailwind utilities in index.css but simpler to use standard accent here or inline styles if we want specific look. 
            Tailwind 'accent-' utilities work for simple coloring.
        */}
            </div>
            <p className="text-xs text-gray-500 mt-1">How new was today?</p>

            <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
          cursor: pointer;
          margin-top: -6px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
        }
        input[type=range]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
};

export default NoveltySlider;
