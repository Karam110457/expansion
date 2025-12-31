import type { MicroNovelty, ExpansionMode, ExpansionDay } from '../lib/database.types';

interface ScoreInput {
    mode: ExpansionMode;
    environment: number;
    businessFocus: number;
    trainingFocus: number;
    microNovelty: MicroNovelty;
    macroNovelty: number;
    dopamine: number;
    clearing: number;
    streak: number;
}

// Calculate micro-novelty score (0 to 2.5 with 5 options)
export const calculateMicroNovelty = (micro: MicroNovelty): number => {
    const count = [
        micro.newBook,
        micro.newPerson,
        micro.newMethod,
        micro.newPlace,
        micro.newChallenge
    ].filter(Boolean).length;
    return count * 0.5;
};


// Calculate sludge penalty (clearing is weighted at 0.5x effectiveness)
// 15 min of exercise shouldn't fully clear 2 hours of scrolling
export const calculateSludge = (dopamine: number, clearing: number): number => {
    return Math.max(0, dopamine - (clearing * 0.5));
};


// Building Mode Formula: E × F × (1 + N) × Streak / (1 + Sludge)
// Focus (F) is the main driver - a solid work day should score well
export const calculateBuildingScore = (input: ScoreInput): number => {
    const { environment, businessFocus, trainingFocus, microNovelty, dopamine, clearing, streak } = input;

    const F = businessFocus + trainingFocus;
    const N = calculateMicroNovelty(microNovelty);
    const sludge = calculateSludge(dopamine, clearing);
    const streakMultiplier = Math.min(1 + (0.1 * streak), 1.5);

    // F is multiplied by E, N acts as a bonus multiplier (1 + N)
    const score = (environment * F * (1 + N) * streakMultiplier) / (1 + sludge);
    return Math.round(score * 10) / 10;
};


// Expanding Mode Formula: E × N × (F + 1) / (1 + Sludge)
// Note: Environment is auto-set to 1.0 in Expanding mode (you're by definition away from bed/room)
export const calculateExpandingScore = (input: ScoreInput): number => {
    const { businessFocus, trainingFocus, macroNovelty, dopamine, clearing } = input;

    const E = 1.0; // Auto-set: if expanding, you're in a novel environment
    const F = businessFocus + trainingFocus;
    const N = macroNovelty;
    const sludge = calculateSludge(dopamine, clearing);

    const score = (E * N * (F + 1)) / (1 + sludge);
    return Math.round(score * 10) / 10;
};


// Main score calculation based on mode
export const calculateScore = (input: ScoreInput): number => {
    if (input.mode === 'building') {
        return calculateBuildingScore(input);
    }
    return calculateExpandingScore(input);
};

// Calculate streak from history (consecutive days with F > 4 and clean sludge)
// Hybrid sludge system: streak breaks if dopamine >= 4 OR net sludge > 2
export const calculateStreak = (history: ExpansionDay[], currentDate: string): number => {
    if (history.length === 0) return 0;

    // Sort by date descending (most recent first)
    const sorted = [...history]
        .filter(d => d.date <= currentDate)
        .sort((a, b) => b.date.localeCompare(a.date));

    let streak = 0;
    let expectedDate = new Date(currentDate);

    for (const day of sorted) {
        const dayDate = new Date(day.date);
        const diffDays = Math.round((expectedDate.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));

        // If not consecutive day, break
        if (diffDays > 1) break;

        // Check if focus was > 4 hours
        const totalFocus = day.business_focus + day.training_focus;
        if (totalFocus <= 4) break;

        // Hybrid sludge check
        const dopamine = day.dopamine || 0;
        const clearing = day.clearing || 0;
        const netSludge = calculateSludge(dopamine, clearing);

        // Dopamine ceiling: 4+ hours of dopamine kills streak regardless of clearing
        if (dopamine >= 4) break;

        // Net sludge threshold: if sludge > 2 after clearing, streak breaks
        if (netSludge > 2) break;

        // Day qualifies - increment streak
        streak++;
        expectedDate = dayDate;
    }

    return streak;
};

// Detect stagnation (7+ building days with no micro-novelty)
export const detectStagnation = (history: ExpansionDay[]): boolean => {
    const recentDays = history
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 7);

    if (recentDays.length < 7) return false;

    const allBuilding = recentDays.every(d => d.mode === 'building');
    const noNovelty = recentDays.every(d => {
        const micro = d.micro_novelty as MicroNovelty;
        return !micro.newBook && !micro.newPerson && !micro.newMethod;
    });

    return allBuilding && noNovelty;
};

// Pattern-based insights for dual-mode system
export const getInsight = (
    input: ScoreInput,
    score: number,
    streak: number,
    isStagnating: boolean
): string => {
    const { mode, environment, microNovelty, macroNovelty, businessFocus, trainingFocus, dopamine, clearing } = input;
    const totalFocus = businessFocus + trainingFocus;
    const sludgeGap = dopamine - clearing;
    const microN = calculateMicroNovelty(microNovelty);

    // Priority 1: Stagnation warning
    if (isStagnating) {
        return "⚠️ Neural grooves are deep after 7 days. One pattern break—new place, new person, new method—resets the clock.";
    }

    // Priority 2: Critical state
    if (environment <= 0.2) {
        return "🚨 The Room is a trap. Your multiplier is low. Get to a Third Space and watch your score jump.";
    }

    if (sludgeGap > 2) {
        return "⚠️ Sludge is dragging you down. One clearing session (walk, workout, breathwork) neutralizes the penalty.";
    }

    // Priority 3: Mode-specific wins
    if (mode === 'building') {
        if (streak >= 7) {
            return `🔥 ${streak}-day execution streak! Streak multiplier at ${Math.min(1 + (0.1 * streak), 1.5).toFixed(1)}x. You're compounding into someone unstoppable.`;
        }
        if (totalFocus >= 6 && microN >= 1) {
            return "⚡ High execution + neural novelty = perfect Building day. This is how you grow without stagnating.";
        }
        if (totalFocus >= 6 && microN === 0) {
            return "💪 Strong execution. Add one micro-novelty tomorrow (new book, conversation, or method) to keep the neural pathways fresh.";
        }
        if (totalFocus > 4) {
            return "🔨 Solid Building day. Keep stacking—your streak multiplier grows with consistency.";
        }
    }

    if (mode === 'expanding') {
        if (macroNovelty >= 9) {
            return "🌍 Maximum expansion! Days like this create lifetime memories. Now capture the lessons.";
        }
        if (macroNovelty >= 7 && totalFocus >= 2) {
            return "🚀 High novelty + solid focus = the sweet spot. You're expanding AND building.";
        }
        if (macroNovelty >= 7 && totalFocus < 1) {
            return "🗺️ Great exploration! Tomorrow, channel these new inputs into focused execution.";
        }
    }

    // Priority 4: General tier feedback
    if (score >= 50) return "🏆 Exceptional day. Top-tier performance in either mode.";
    if (score >= 30) return "📈 Strong progress. You're moving the needle.";
    if (score >= 15) return "🌱 Building momentum. Every logged day compounds.";

    return "🎯 Day logged. Pick one variable to push higher tomorrow.";
};
