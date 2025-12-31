import { useState, useEffect } from 'react';
import type { MicroNovelty, CustomNovelty } from '../../lib/database.types';
import { BookOpen, Users, Lightbulb, MapPin, Target, Plus, X, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface MicroNoveltyChecklistProps {
    value: MicroNovelty;
    onChange: (value: MicroNovelty) => void;
    selectedDate: string;
}

const NOVELTY_ITEMS = [
    { key: 'newBook' as keyof MicroNovelty, label: 'New Knowledge', description: 'Book, article, podcast, video', icon: BookOpen },
    { key: 'newPerson' as keyof MicroNovelty, label: 'New Conversation', description: 'Different person or deep topic', icon: Users },
    { key: 'newMethod' as keyof MicroNovelty, label: 'New Method', description: 'Tried a different technique', icon: Lightbulb },
    { key: 'newPlace' as keyof MicroNovelty, label: 'New Spot', description: 'Worked from different location', icon: MapPin },
    { key: 'newChallenge' as keyof MicroNovelty, label: 'Hard Challenge', description: 'Pushed outside comfort zone', icon: Target },
];

const MicroNoveltyChecklist = ({ value, onChange, selectedDate }: MicroNoveltyChecklistProps) => {
    const { user } = useAuth();
    const [customNovelties, setCustomNovelties] = useState<CustomNovelty[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newLabel, setNewLabel] = useState('');

    // Load custom novelties for this date
    useEffect(() => {
        if (!user || !selectedDate) return;

        const loadCustomNovelties = async () => {
            const { data } = await supabase
                .from('custom_novelties')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', selectedDate);

            if (data) {
                setCustomNovelties(data as CustomNovelty[]);
            }
        };

        loadCustomNovelties();
    }, [user, selectedDate]);

    const toggleItem = (key: keyof MicroNovelty) => {
        onChange({ ...value, [key]: !value[key] });
    };

    const addCustomNovelty = async () => {
        if (!newLabel.trim() || !user) return;

        const { data, error } = await supabase
            .from('custom_novelties')
            .insert({
                user_id: user.id,
                date: selectedDate,
                label: newLabel.trim(),
                completed: false,
            })
            .select()
            .single();

        if (!error && data) {
            setCustomNovelties([...customNovelties, data as CustomNovelty]);
            setNewLabel('');
            setIsAdding(false);
        }
    };

    const toggleCustomNovelty = async (id: string) => {
        const item = customNovelties.find(n => n.id === id);
        if (!item) return;

        await supabase
            .from('custom_novelties')
            .update({ completed: !item.completed })
            .eq('id', id);

        setCustomNovelties(customNovelties.map(n =>
            n.id === id ? { ...n, completed: !n.completed } : n
        ));
    };

    const deleteCustomNovelty = async (id: string) => {
        await supabase
            .from('custom_novelties')
            .delete()
            .eq('id', id);

        setCustomNovelties(customNovelties.filter(n => n.id !== id));
    };

    const activeCount = Object.values(value).filter(Boolean).length;
    const customActiveCount = customNovelties.filter(n => n.completed).length;
    const totalNoveltyScore = (activeCount + customActiveCount) * 0.5;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium uppercase tracking-wider text-gray-400">
                    Micro-Novelty
                </label>
                <span className="text-blue-400 font-bold text-sm">
                    +{totalNoveltyScore.toFixed(1)} N
                </span>
            </div>

            <div className="space-y-2">
                {/* Standard novelty items */}
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

                {/* Custom novelty items for this date */}
                {customNovelties.map((item) => (
                    <div
                        key={item.id}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${item.completed
                            ? 'bg-purple-500/10 border-purple-500/30 text-white'
                            : 'bg-surface-50 border-surface-200 text-gray-400'
                            }`}
                    >
                        <button
                            onClick={() => toggleCustomNovelty(item.id)}
                            className="flex-1 flex items-center gap-3"
                        >
                            <div className={`p-2 rounded-lg ${item.completed ? 'bg-purple-500/20' : 'bg-surface-100'}`}>
                                <Sparkles className={`w-4 h-4 ${item.completed ? 'text-purple-400' : 'text-gray-500'}`} />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium text-sm">{item.label}</div>
                                <div className="text-xs text-gray-500">Custom for today</div>
                            </div>
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${item.completed
                                ? 'bg-purple-500 border-purple-500'
                                : 'border-gray-600'
                                }`}>
                                {item.completed && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </button>
                        <button
                            onClick={() => deleteCustomNovelty(item.id)}
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {/* Add custom novelty */}
                {isAdding ? (
                    <div className="flex items-center gap-2 p-3 rounded-xl border border-purple-500/30 bg-purple-500/5">
                        <input
                            type="text"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            placeholder="What's novel today?"
                            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-500"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && addCustomNovelty()}
                        />
                        <button
                            onClick={addCustomNovelty}
                            disabled={!newLabel.trim()}
                            className="px-3 py-1.5 bg-purple-500 text-white text-xs font-bold rounded-lg hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => { setIsAdding(false); setNewLabel(''); }}
                            className="p-1.5 text-gray-400 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-surface-300 text-gray-500 hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Add Custom Novelty</span>
                    </button>
                )}
            </div>

            <p className="text-xs text-gray-500 mt-3 text-center">
                Each adds +0.5 to your novelty multiplier • Custom items are for this day only
            </p>
        </div>
    );
};

export default MicroNoveltyChecklist;
