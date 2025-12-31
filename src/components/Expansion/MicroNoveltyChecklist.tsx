import type { MicroNovelty } from '../../lib/database.types';
import { BookOpen, Users, Lightbulb, MapPin, Target } from 'lucide-react';

interface MicroNoveltyChecklistProps {
    value: MicroNovelty;
    onChange: (value: MicroNovelty) => void;
}

const NOVELTY_ITEMS = [
    { 
        key: 'newBook' as const, 
        textKey: 'newBookText' as const,
        label: 'New Knowledge', 
        description: 'Book, article, podcast, video', 
        icon: BookOpen,
        placeholder: 'e.g., "Read chapter 3 of Atomic Habits"'
    },
    { 
        key: 'newPerson' as const, 
        textKey: 'newPersonText' as const,
        label: 'New Conversation', 
        description: 'Different person or deep topic', 
        icon: Users,
        placeholder: 'e.g., "Had coffee with Sarah about AI"'
    },
    { 
        key: 'newMethod' as const, 
        textKey: 'newMethodText' as const,
        label: 'New Method', 
        description: 'Tried a different technique', 
        icon: Lightbulb,
        placeholder: 'e.g., "Pomodoro technique for coding"'
    },
    { 
        key: 'newPlace' as const, 
        textKey: 'newPlaceText' as const,
        label: 'New Spot', 
        description: 'Worked from different location', 
        icon: MapPin,
        placeholder: 'e.g., "Worked from the library downtown"'
    },
    { 
        key: 'newChallenge' as const, 
        textKey: 'newChallengeText' as const,
        label: 'Hard Challenge', 
        description: 'Pushed outside comfort zone', 
        icon: Target,
        placeholder: 'e.g., "Gave presentation to team"'
    },
];

const MicroNoveltyChecklist = ({ value, onChange }: MicroNoveltyChecklistProps) => {
    const toggleItem = (key: keyof MicroNovelty) => {
        const newValue = !value[key];
        onChange({ ...value, [key]: newValue });
    };

    const updateText = (textKey: 'newBookText' | 'newPersonText' | 'newMethodText' | 'newPlaceText' | 'newChallengeText', text: string) => {
        onChange({ ...value, [textKey]: text });
    };

    // Count only boolean values for score calculation
    const activeCount = [
        value.newBook,
        value.newPerson,
        value.newMethod,
        value.newPlace,
        value.newChallenge
    ].filter(Boolean).length;
    const noveltyScore = activeCount * 0.5;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium uppercase tracking-wider text-gray-400">
                    Micro-Novelty
                </label>
                <span className="text-blue-400 font-bold text-sm">
                    +{noveltyScore.toFixed(1)} N
                </span>
            </div>

            <div className="space-y-2">
                {NOVELTY_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = value[item.key];
                    const textValue = value[item.textKey] || '';

                    return (
                        <div key={item.key} className="space-y-2">
                            <button
                                onClick={() => toggleItem(item.key)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${isActive
                                        ? 'bg-blue-500/10 border-blue-500/30 text-white'
                                        : 'bg-surface-50 border-surface-200 text-gray-400 hover:border-surface-300 hover:bg-surface-100'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500/20' : 'bg-surface-100'}`}>
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-sm">{item.label}</div>
                                    <div className="text-xs text-gray-500">{item.description}</div>
                                </div>
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isActive
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'border-gray-600'
                                    }`}>
                                    {isActive && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                            
                            {/* Text input appears automatically when checked */}
                            {isActive && (
                                <div className="ml-11 mr-0 mt-2">
                                    <input
                                        type="text"
                                        value={textValue}
                                        onChange={(e) => updateText(item.textKey, e.target.value)}
                                        placeholder={item.placeholder}
                                        onClick={(e) => e.stopPropagation()}
                                        onFocus={(e) => e.stopPropagation()}
                                        className="w-full px-3 py-2 text-sm bg-surface-100 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-gray-500 mt-2 text-center">
                Each adds +0.5 to your novelty multiplier (max +2.5)
            </p>
        </div>
    );
};

export default MicroNoveltyChecklist;
