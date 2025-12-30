import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

import { Trophy, Calendar, TrendingUp, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface LeaderboardEntry {
    display_name: string;
    score: number;
    mode: string;
    date?: string;
}

type ViewType = 'daily' | 'weekly' | 'alltime';

const LeaderboardPage = () => {
    const [view, setView] = useState<ViewType>('weekly');
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Calculate week start (Monday)
    const weekStart = useMemo(() => {
        const date = new Date();
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff)).toISOString().split('T')[0];
    }, []);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);

            let query = supabase
                .from('expansion_days')
                .select('display_name, score, mode, date')
                .eq('submitted', true)
                .not('display_name', 'is', null);

            if (view === 'daily') {
                query = query.eq('date', selectedDate);
            } else if (view === 'weekly') {
                query = query.gte('date', weekStart);
            }
            // 'alltime' gets all submitted days

            const { data, error } = await query.order('score', { ascending: false });

            if (error) {
                console.error('Failed to fetch leaderboard:', error);
                setEntries([]);
            } else if (data) {
                if (view === 'alltime') {
                    // Aggregate scores by user for all-time
                    const aggregated = data.reduce((acc: LeaderboardEntry[], entry: LeaderboardEntry) => {
                        const existing = acc.find((e: LeaderboardEntry) => e.display_name === entry.display_name);
                        if (existing) {
                            existing.score += entry.score;
                        } else {
                            acc.push({ ...entry, score: entry.score });
                        }
                        return acc;
                    }, [] as LeaderboardEntry[]);
                    setEntries(aggregated.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score).slice(0, 20));
                } else if (view === 'weekly') {
                    // Sum scores for the week per user
                    const aggregated = data.reduce((acc: LeaderboardEntry[], entry: LeaderboardEntry) => {
                        const existing = acc.find((e: LeaderboardEntry) => e.display_name === entry.display_name);
                        if (existing) {
                            existing.score += entry.score;
                        } else {
                            acc.push({ ...entry, score: entry.score });
                        }
                        return acc;
                    }, [] as LeaderboardEntry[]);
                    setEntries(aggregated.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score).slice(0, 20));
                } else {
                    // Daily - show individual entries
                    setEntries(data.slice(0, 20));
                }
            }
            setLoading(false);
        };

        fetchLeaderboard();
    }, [view, selectedDate, weekStart]);

    const navigateDate = (days: number) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        if (date <= new Date()) {
            setSelectedDate(date.toISOString().split('T')[0]);
        }
    };

    return (
        <div className="py-6 pb-20">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pt-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h1 className="text-xl font-bold">Leaderboard</h1>
            </div>

            {/* View Tabs */}
            <div className="flex gap-2 mb-6">
                {[
                    { key: 'daily', label: 'Daily', icon: Calendar },
                    { key: 'weekly', label: 'Weekly', icon: TrendingUp },
                    { key: 'alltime', label: 'All Time', icon: Clock },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setView(tab.key as ViewType)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${view === tab.key
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-surface-100 text-gray-400 hover:bg-surface-200'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Date Picker for Daily View */}
            {view === 'daily' && (
                <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                        onClick={() => navigateDate(-1)}
                        className="p-2 hover:bg-surface-100 rounded-lg text-gray-400"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-gray-300">
                        {new Date(selectedDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                    <button
                        onClick={() => navigateDate(1)}
                        disabled={selectedDate === new Date().toISOString().split('T')[0]}
                        className="p-2 hover:bg-surface-100 rounded-lg text-gray-400 disabled:opacity-30"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Leaderboard List */}
            <div className="space-y-2">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">
                        Loading...
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No scores yet for this period.</p>
                        <p className="text-sm mt-1">Be the first to submit!</p>
                    </div>
                ) : (
                    entries.map((entry, index) => (
                        <div
                            key={`${entry.display_name}-${index}`}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${index === 0
                                ? 'bg-amber-500/10 border-amber-500/30'
                                : index === 1
                                    ? 'bg-gray-500/10 border-gray-500/30'
                                    : index === 2
                                        ? 'bg-orange-700/10 border-orange-700/30'
                                        : 'bg-surface-100 border-surface-200'
                                }`}
                        >
                            {/* Rank */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0
                                ? 'bg-amber-500 text-black'
                                : index === 1
                                    ? 'bg-gray-400 text-black'
                                    : index === 2
                                        ? 'bg-orange-700 text-white'
                                        : 'bg-surface-200 text-gray-400'
                                }`}>
                                {index + 1}
                            </div>

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-white truncate">
                                    {entry.display_name}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {entry.mode} mode
                                </p>
                            </div>

                            {/* Score */}
                            <div className="text-right">
                                <p className={`text-xl font-bold ${index === 0 ? 'text-amber-400' : 'text-white'
                                    }`}>
                                    {Math.round(entry.score)}
                                </p>
                                <p className="text-xs text-gray-500">points</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
