import type { MicroNovelty } from '../../lib/database.types';
import { BookOpen, Users, Lightbulb, MapPin, Target } from 'lucide-react';

interface MicroNoveltyChecklistProps {
    value: MicroNovelty;
    onChange: (value: MicroNovelty) => void;
}

const NOVELTY_ITEMS = [
    { key: 'newBook' as keyof MicroNovelty, label: 'New Knowledge', description: 'Book, article, podcast, video', icon: BookOpen },
    { key: 'newPerson' as keyof MicroNovelty, label: 'New Conversation', description: 'Different person or deep topic', icon: Users },
    { key: 'newMethod' as keyof MicroNovelty, label: 'New Method', description: 'Tried a different technique', icon: Lightbulb },
    { key: 'newPlace' as keyof MicroNovelty, label: 'New Spot', description: 'Worked from different location', icon: MapPin },
    { key: 'newChallenge' as keyof MicroNovelty, label: 'Hard Challenge', description: 'Pushed outside comfort zone', icon: Target },
];

const MicroNoveltyChecklist = ({ value, onChange }: MicroNoveltyChecklistProps) => {
    const toggleItem = (key: keyof MicroNovelty) => {
        onChange({ ...value, [key]: !value[key] });
    };

    const activeCount = Object.values(value).filter(Boolean).length;
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

                    return (
                        <button
                            key={item.key}
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
