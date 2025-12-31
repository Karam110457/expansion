import { Swords, BookOpen, Home, Bed, Dumbbell, Warehouse, X } from 'lucide-react';


interface EnvironmentArchetypeProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

const ARCHETYPES = [
    { name: 'Apex', desc: 'Library + Gym', value: 1.0, work: 'library', training: 'gym', tier: 'elite' },
    { name: 'Professional', desc: 'Library + Garage', value: 0.9, work: 'library', training: 'garage', tier: 'elite' },
    { name: 'Architect', desc: 'Library + No Training', value: 0.8, work: 'library', training: 'none', tier: 'elite' },
    { name: 'Hybrid', desc: 'Kitchen + Gym', value: 0.6, work: 'home', training: 'gym', tier: 'mid' },
    { name: 'Domestic', desc: 'Kitchen + Garage', value: 0.5, work: 'home', training: 'garage', tier: 'mid' },
    { name: 'Housebound', desc: 'Kitchen + No Training', value: 0.4, work: 'home', training: 'none', tier: 'mid' },
    { name: 'Breakout', desc: 'Room + Gym', value: 0.3, work: 'room', training: 'gym', tier: 'low' },
    { name: 'Survival', desc: 'Room + Garage', value: 0.2, work: 'room', training: 'garage', tier: 'low' },
    { name: 'Stagnant', desc: 'Room + No Training', value: 0.1, work: 'room', training: 'none', tier: 'low' },
] as const;

const getWorkIcon = (work: string) => {
    switch (work) {
        case 'library': return BookOpen;
        case 'home': return Home;
        case 'room': return Bed;
        default: return Home;
    }
};

const getTrainingIcon = (training: string) => {
    switch (training) {
        case 'gym': return Dumbbell;
        case 'garage': return Warehouse;
        case 'none': return X;
        default: return X;
    }
};

const getTierStyles = (tier: string, isSelected: boolean) => {
    if (!isSelected) {
        return 'border-surface-200 bg-surface-50 text-gray-400 hover:border-surface-300 hover:bg-surface-100';
    }
    switch (tier) {
        case 'elite':
            return 'border-emerald-500/50 bg-emerald-500/10 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]';
        case 'mid':
            return 'border-amber-500/50 bg-amber-500/10 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]';
        case 'low':
            return 'border-red-500/50 bg-red-500/10 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]';
        default:
            return 'border-blue-500/50 bg-blue-500/10 text-white';
    }
};

const getValueColor = (tier: string) => {
    switch (tier) {
        case 'elite': return 'text-emerald-400';
        case 'mid': return 'text-amber-400';
        case 'low': return 'text-red-400';
        default: return 'text-gray-400';
    }
};

const EnvironmentArchetype = ({ value, onChange, disabled }: EnvironmentArchetypeProps) => {
    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
                <Swords className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-bold uppercase tracking-wider text-gray-400">
                    Your Battleground
                </label>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {ARCHETYPES.map((archetype) => {
                    const isSelected = Math.abs(value - archetype.value) < 0.01;
                    const WorkIcon = getWorkIcon(archetype.work);
                    const TrainingIcon = getTrainingIcon(archetype.training);

                    return (
                        <button
                            key={archetype.name}
                            onClick={() => !disabled && onChange(archetype.value)}
                            disabled={disabled}
                            className={`
                                relative p-3 rounded-xl border transition-all duration-200
                                flex items-center gap-4
                                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                ${getTierStyles(archetype.tier, isSelected)}
                            `}
                        >
                            {/* Icons */}
                            <div className="flex items-center gap-1.5">
                                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/10' : 'bg-surface-100'}`}>
                                    <WorkIcon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                                </div>
                                <span className="text-gray-600">+</span>
                                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/10' : 'bg-surface-100'}`}>
                                    <TrainingIcon className={`w-4 h-4 ${isSelected ? (archetype.training === 'none' ? 'text-red-400' : 'text-white') : 'text-gray-500'}`} />
                                </div>
                            </div>

                            {/* Name & Description */}
                            <div className="flex-1 text-left">
                                <div className="font-bold text-sm">{archetype.name}</div>
                                <div className="text-xs text-gray-500">{archetype.desc}</div>
                            </div>

                            {/* Value */}
                            <div className={`font-mono font-bold text-lg ${getValueColor(archetype.tier)}`}>
                                {archetype.value.toFixed(1)}x
                            </div>

                            {/* Selected indicator */}
                            {isSelected && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className={`w-2 h-2 rounded-full ${archetype.tier === 'elite' ? 'bg-emerald-400' :
                                        archetype.tier === 'mid' ? 'bg-amber-400' : 'bg-red-400'
                                        } animate-pulse`} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <p className="text-xs text-gray-500 mt-3 text-center">
                Higher multiplier = greater mental bandwidth for deep work
            </p>
        </div>
    );
};

export default EnvironmentArchetype;
