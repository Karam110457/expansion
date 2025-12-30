import { useMemo } from 'react';
import type { ExpansionDay } from '../../lib/database.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
    history: ExpansionDay[];
    selectedDate: string;
    onSelectDate: (date: string) => void;
}

const CalendarView = ({ history, selectedDate, onSelectDate }: CalendarViewProps) => {
    const today = new Date().toISOString().split('T')[0];

    // Get current month from selected date
    const selectedMonth = useMemo(() => {
        const date = new Date(selectedDate);
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }, [selectedDate]);

    // Navigate months
    const prevMonth = () => {
        const newDate = new Date(selectedMonth);
        newDate.setMonth(newDate.getMonth() - 1);
        onSelectDate(newDate.toISOString().split('T')[0]);
    };

    const nextMonth = () => {
        const newDate = new Date(selectedMonth);
        newDate.setMonth(newDate.getMonth() + 1);
        onSelectDate(newDate.toISOString().split('T')[0]);
    };

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const days: { date: string; dayOfMonth: number; isCurrentMonth: boolean; data?: ExpansionDay }[] = [];

        // Previous month padding
        for (let i = 0; i < startDayOfWeek; i++) {
            const prevDate = new Date(year, month, -startDayOfWeek + i + 1);
            days.push({
                date: prevDate.toISOString().split('T')[0],
                dayOfMonth: prevDate.getDate(),
                isCurrentMonth: false,
            });
        }

        // Current month
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayData = history.find(d => d.date === dateStr);
            days.push({
                date: dateStr,
                dayOfMonth: i,
                isCurrentMonth: true,
                data: dayData,
            });
        }

        return days;
    }, [selectedMonth, history]);

    const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="w-full">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={prevMonth}
                    className="p-2 rounded-lg hover:bg-surface-100 text-gray-400 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                    {monthName}
                </h3>
                <button
                    onClick={nextMonth}
                    className="p-2 rounded-lg hover:bg-surface-100 text-gray-400 hover:text-white transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-xs text-gray-500 font-medium py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                    const isSelected = day.date === selectedDate;
                    const isToday = day.date === today;
                    const isFuture = day.date > today;
                    const hasData = !!day.data;
                    const isBuilding = day.data?.mode === 'building';
                    const isSubmitted = day.data?.submitted;

                    // Score-based opacity
                    const scoreOpacity = day.data
                        ? Math.min(0.3 + (day.data.score / 100) * 0.7, 1)
                        : 0;

                    return (
                        <button
                            key={index}
                            onClick={() => !isFuture && onSelectDate(day.date)}
                            disabled={isFuture}
                            className={`
                                relative aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                                ${!day.isCurrentMonth ? 'text-gray-700' : ''}
                                ${isFuture ? 'text-gray-700 cursor-not-allowed' : 'cursor-pointer'}
                                ${isSelected ? 'ring-2 ring-white/50' : ''}
                                ${isToday && !isSelected ? 'ring-1 ring-neon-blue/50' : ''}
                                ${!hasData && day.isCurrentMonth && !isFuture ? 'hover:bg-surface-100 text-gray-400' : ''}
                            `}
                            style={hasData ? {
                                backgroundColor: isBuilding
                                    ? `rgba(59, 130, 246, ${scoreOpacity})`
                                    : `rgba(245, 158, 11, ${scoreOpacity})`,
                            } : undefined}
                        >
                            {day.dayOfMonth}
                            {/* Submitted indicator */}
                            {isSubmitted && (
                                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/70" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-500/50" />
                    <span>Building</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-amber-500/50" />
                    <span>Expanding</span>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
