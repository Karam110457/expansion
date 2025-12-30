import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';
import type { DailyData } from '../../types';

interface HistoryChartProps {
    history: DailyData[];
}

const HistoryChart = ({ history }: HistoryChartProps) => {
    // Get last 7 entries
    const data = history.slice(-7).map(d => ({
        ...d,
        day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    }));

    if (history.length === 0) {
        return (
            <div className="w-full h-40 flex items-center justify-center border border-dashed border-surface-200 rounded-xl bg-surface-100/30">
                <p className="text-gray-500 text-sm">No history yet</p>
            </div>
        );
    }

    return (
        <div className="w-full h-48 mt-8">
            <h3 className="text-secondary text-sm font-medium uppercase tracking-wider text-gray-400 mb-4">Last 7 Days</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis
                        dataKey="day"
                        tick={{ fill: '#6b7280', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: '#1e1e1e' }}
                        contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                        formatter={(value: number) => [value, 'Score']}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.score > 50 ? '#0aff00' : '#00f3ff'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HistoryChart;
