import { useEffect, useState, useRef } from 'react';
import { getInsight } from '../../utils/calculateScore';

import type { ExpansionMode, MicroNovelty } from '../../lib/database.types';

interface ScoreDisplayProps {
    score: number;
    mode: ExpansionMode;
    environment: number;
    businessFocus: number;
    trainingFocus: number;
    microNovelty: MicroNovelty;
    macroNovelty: number;
    dopamine: number;
    clearing: number;
    streak: number;
    isStagnating: boolean;
}

// Animated counter hook
const useAnimatedNumber = (target: number, duration: number = 500) => {
    const [current, setCurrent] = useState(target);
    const animationRef = useRef<number | null>(null);
    const startRef = useRef<number | null>(null);
    const startValueRef = useRef<number>(target);

    useEffect(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        startValueRef.current = current;
        startRef.current = null;

        const animate = (timestamp: number) => {
            if (startRef.current === null) startRef.current = timestamp;
            const elapsed = timestamp - startRef.current;
            const progress = Math.min(elapsed / duration, 1);

            const eased = 1 - Math.pow(1 - progress, 3);
            const newValue = startValueRef.current + (target - startValueRef.current) * eased;

            setCurrent(Math.round(newValue * 10) / 10);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [target, duration]);

    return current;
};

// Progress ring with mode-aware colors
// Building mode: maxScore of 50 feels more achievable for daily work
const ProgressRing = ({ score, mode }: { score: number; mode: ExpansionMode }) => {
    const radius = 80;
    const strokeWidth = 6;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    // Different max scores for different modes - 50 is a great day in either mode
    const maxScore = 50;
    const progress = Math.min(score / maxScore, 1);
    const strokeDashoffset = circumference - progress * circumference;


    // Mode-aware colors - realistic thresholds for both modes
    const getGradientColors = () => {
        if (mode === 'building') {
            if (score > 25) return ['#3b82f6', '#06b6d4']; // Blue to cyan - great day
            if (score > 10) return ['#3b82f6', '#8b5cf6']; // Blue to purple - solid day
            return ['#3d3d3d', '#5d5d5d']; // Gray - needs work
        } else {
            // Expanding mode - lower thresholds since focus isn't the main driver
            if (score > 20) return ['#f59e0b', '#ef4444']; // Amber to red - great exploration
            if (score > 10) return ['#f59e0b', '#eab308']; // Amber to yellow - solid day
            return ['#3d3d3d', '#5d5d5d'];
        }
    };


    const [color1, color2] = getGradientColors();
    const glowIntensity = Math.min(score / 50, 1) * 0.8;

    return (
        <svg
            height={radius * 2}
            width={radius * 2}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ filter: `drop-shadow(0 0 ${10 + glowIntensity * 20}px ${color1}${Math.round(glowIntensity * 80).toString(16).padStart(2, '0')})` }}
        >
            <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color1} />
                    <stop offset="100%" stopColor={color2} />
                </linearGradient>
            </defs>
            <circle
                stroke="#1e1e1e"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke="url(#scoreGradient)"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference + ' ' + circumference}
                style={{
                    strokeDashoffset,
                    transition: 'stroke-dashoffset 0.5s ease-out',
                    transformOrigin: 'center',
                    transform: 'rotate(-90deg)',
                }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
        </svg>
    );
};

// Tier label - adjusted for realistic Building mode scores
const getTierLabel = (score: number, mode: ExpansionMode): { label: string; emoji: string } => {
    if (mode === 'building') {
        if (score >= 35) return { label: 'Exceptional', emoji: '⚡' };
        if (score >= 25) return { label: 'Excellent', emoji: '🚀' };
        if (score >= 15) return { label: 'Strong', emoji: '🔥' };
        if (score >= 8) return { label: 'Solid', emoji: '📈' };
        return { label: 'Building', emoji: '🌱' };
    } else {
        if (score >= 50) return { label: 'Full Expansion', emoji: '⚡' };
        if (score >= 30) return { label: 'Exploring', emoji: '🚀' };
        if (score >= 15) return { label: 'Discovering', emoji: '🔥' };
        return { label: 'Starting', emoji: '🌱' };
    }
};


const ScoreDisplay = (props: ScoreDisplayProps) => {
    const { score, mode, streak, isStagnating, ...inputData } = props;
    const animatedScore = useAnimatedNumber(score);

    const insight = getInsight(
        { mode, streak, ...inputData },
        score,
        streak,
        isStagnating
    );

    const tier = getTierLabel(score, mode);

    // Mode-aware colors
    const scoreColor = mode === 'building'
        ? score >= 30 ? 'text-blue-400' : 'text-blue-300/70'
        : score >= 30 ? 'text-amber-400' : 'text-amber-300/70';

    const glowIntensity = Math.min(score / 50, 1);

    return (
        <div className="text-center py-6">
            {/* Tier badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-lg">{tier.emoji}</span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                    {tier.label}
                </span>
            </div>

            {/* Score with ring */}
            <div className="relative inline-flex items-center justify-center w-40 h-40">
                <ProgressRing score={score} mode={mode} />
                <div
                    className={`text-6xl font-black ${scoreColor} transition-all duration-300 z-10`}
                    style={{
                        textShadow: score >= 20
                            ? `0 0 ${20 + glowIntensity * 30}px currentColor`
                            : 'none',
                    }}
                >
                    {animatedScore}
                </div>
            </div>

            {/* Streak indicator for building mode */}
            {mode === 'building' && streak > 0 && (
                <div className="mt-2 text-xs text-gray-400">
                    Streak: {streak} day{streak !== 1 ? 's' : ''} • {Math.min(1 + (0.1 * streak), 1.5).toFixed(1)}x multiplier
                </div>
            )}

            {/* Insight card */}
            <div className="mt-4 px-2">
                <div className={`glass-card p-4 inline-block max-w-sm border ${mode === 'building' ? 'border-blue-500/10' : 'border-amber-500/10'
                    }`}>
                    <p className="text-sm font-medium text-gray-300 leading-relaxed">
                        {insight}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ScoreDisplay;
