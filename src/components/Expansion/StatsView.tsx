import { useMemo } from 'react';
import type { ExpansionDay } from '../../lib/database.types';
import { TrendingUp, Globe, Clock, Flame, Target } from 'lucide-react';

interface StatsViewProps {
    history: ExpansionDay[];
}

const StatsView = ({ history }: StatsViewProps) => {
    const stats = useMemo(() => {
        const buildingDays = history.filter(d => d.mode === 'building');
        const expandingDays = history.filter(d => d.mode === 'expanding');

        // Building mode stats
        const avgBuildingFocus = buildingDays.length > 0
            ? buildingDays.reduce((sum, d) => sum + d.business_focus + d.training_focus, 0) / buildingDays.length
            : 0;

        const avgBuildingScore = buildingDays.length > 0
            ? buildingDays.reduce((sum, d) => sum + d.score, 0) / buildingDays.length
            : 0;

        // Expanding mode stats
        const avgExpandingNovelty = expandingDays.length > 0
            ? expandingDays.reduce((sum, d) => sum + (d.macro_novelty || 0), 0) / expandingDays.length
            : 0;

        const avgExpandingScore = expandingDays.length > 0
            ? expandingDays.reduce((sum, d) => sum + d.score, 0) / expandingDays.length
            : 0;

        // Overall stats
        const totalDays = history.length;
        const submittedDays = history.filter(d => d.submitted).length;

        // Current streak (approximate)
        let currentStreak = 0;
        const sortedHistory = [...history].sort((a, b) => b.date.localeCompare(a.date));
        for (const day of sortedHistory) {
            if (day.business_focus + day.training_focus > 4) {
                currentStreak++;
            } else {
                break;
            }
        }

        return {
            buildingDays: buildingDays.length,
            expandingDays: expandingDays.length,
            avgBuildingFocus,
            avgBuildingScore,
            avgExpandingNovelty,
            avgExpandingScore,
            totalDays,
            submittedDays,
            currentStreak,
        };
    }, [history]);

    if (history.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No data yet. Start tracking to see stats!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mode breakdown */}
            <div className="grid grid-cols-2 gap-3">
                {/* Building Stats */}
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Building</span>
                    </div>
                    <div className="space-y-2">
                        <div>
                            <div className="text-2xl font-bold text-blue-300">{stats.avgBuildingFocus.toFixed(1)}h</div>
                            <div className="text-[10px] text-gray-500 uppercase">Avg Focus</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-gray-300">{stats.avgBuildingScore.toFixed(1)}</div>
                            <div className="text-[10px] text-gray-500 uppercase">Avg Score</div>
                        </div>
                        <div className="text-xs text-gray-500">{stats.buildingDays} days</div>
                    </div>
                </div>

                {/* Expanding Stats */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-3">
                        <Globe className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Expanding</span>
                    </div>
                    <div className="space-y-2">
                        <div>
                            <div className="text-2xl font-bold text-amber-300">{stats.avgExpandingNovelty.toFixed(1)}</div>
                            <div className="text-[10px] text-gray-500 uppercase">Avg Novelty</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-gray-300">{stats.avgExpandingScore.toFixed(1)}</div>
                            <div className="text-[10px] text-gray-500 uppercase">Avg Score</div>
                        </div>
                        <div className="text-xs text-gray-500">{stats.expandingDays} days</div>
                    </div>
                </div>
            </div>

            {/* Overall stats row */}
            <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-lg bg-surface-100 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                    </div>
                    <div className="text-lg font-bold text-white">{stats.totalDays}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Days Logged</div>
                </div>
                <div className="p-3 rounded-lg bg-surface-100 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className="w-3 h-3 text-gray-500" />
                    </div>
                    <div className="text-lg font-bold text-white">{stats.submittedDays}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Submitted</div>
                </div>
                <div className="p-3 rounded-lg bg-surface-100 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Flame className="w-3 h-3 text-orange-400" />
                    </div>
                    <div className="text-lg font-bold text-orange-400">{stats.currentStreak}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Streak</div>
                </div>
            </div>

            {/* Insight */}
            <div className="p-3 rounded-lg bg-surface-50 border border-surface-200">
                <p className="text-xs text-gray-400 text-center">
                    {stats.buildingDays > stats.expandingDays * 3
                        ? "💡 Heavy on Building. Consider an Expansion day to prevent neural grooves."
                        : stats.expandingDays > stats.buildingDays
                            ? "💡 Lots of exploring! Make sure to lock in Building days to compound gains."
                            : "⚖️ Good balance between Building and Expanding."}
                </p>
            </div>
        </div>
    );
};

export default StatsView;
