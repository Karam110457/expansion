import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { ExpansionDay, ExpansionDayInsert, ExpansionDayUpdate, ExpansionMode, MicroNovelty, EnvironmentValue } from '../lib/database.types';
import { calculateScore, calculateStreak, detectStagnation } from '../utils/calculateScore';
import { useAuth } from './useAuth';

const getTodayString = () => new Date().toISOString().split('T')[0];

const DEFAULT_MICRO_NOVELTY: MicroNovelty = {
    newBook: false,
    newPerson: false,
    newMethod: false,
    newPlace: false,
    newChallenge: false,
};


interface DayState {
    mode: ExpansionMode;
    environment: EnvironmentValue;
    businessFocus: number;
    trainingFocus: number;
    microNovelty: MicroNovelty;
    macroNovelty: number;
    dopamine: number;
    clearing: number;
    submitted: boolean;
}

const DEFAULT_DAY_STATE: DayState = {
    mode: 'building',
    environment: 0.5,
    businessFocus: 0,
    trainingFocus: 0,
    microNovelty: DEFAULT_MICRO_NOVELTY,
    macroNovelty: 5,
    dopamine: 0,
    clearing: 0,
    submitted: false,
};

export const useExpansionStore = () => {
    const { user, displayName } = useAuth();
    const [history, setHistory] = useState<ExpansionDay[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
    const [dayState, setDayState] = useState<DayState>(DEFAULT_DAY_STATE);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Track if we should auto-save (prevents loop)
    const shouldAutoSaveRef = useRef(false);
    const isInitialLoadRef = useRef(true);

    // Load all history from Supabase (only on mount and when user changes)
    const loadHistory = useCallback(async (): Promise<ExpansionDay[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('expansion_days')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false })
            .limit(90);

        if (error) {
            console.error('Failed to load history:', error);
            return [];
        }
        return (data as ExpansionDay[]) || [];
    }, [user]);

    // Initial load
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const init = async () => {
            setLoading(true);
            const data = await loadHistory();
            setHistory(data);

            // Load today's data if exists
            const todayData = data.find(d => d.date === getTodayString());
            if (todayData) {
                setDayState({
                    mode: todayData.mode,
                    environment: todayData.environment as EnvironmentValue,
                    businessFocus: todayData.business_focus,
                    trainingFocus: todayData.training_focus,
                    microNovelty: todayData.micro_novelty as MicroNovelty,
                    macroNovelty: todayData.macro_novelty ?? 5,
                    dopamine: todayData.dopamine,
                    clearing: todayData.clearing,
                    submitted: todayData.submitted,
                });
            }

            setLoading(false);
            isInitialLoadRef.current = false;
        };
        init();
    }, [loadHistory, user]);

    // Load day data when selected date changes (not on initial load)
    useEffect(() => {
        if (isInitialLoadRef.current) return;

        const existingDay = history.find(d => d.date === selectedDate);
        if (existingDay) {
            setDayState({
                mode: existingDay.mode,
                environment: existingDay.environment as EnvironmentValue,
                businessFocus: existingDay.business_focus,
                trainingFocus: existingDay.training_focus,
                microNovelty: existingDay.micro_novelty as MicroNovelty,
                macroNovelty: existingDay.macro_novelty ?? 5,
                dopamine: existingDay.dopamine,
                clearing: existingDay.clearing,
                submitted: existingDay.submitted,
            });
        } else {
            setDayState(DEFAULT_DAY_STATE);
        }
        // Don't auto-save when loading existing data
        shouldAutoSaveRef.current = false;
    }, [selectedDate, history]);

    // Calculate streak for selected date
    const streak = useMemo(() => calculateStreak(history, selectedDate), [history, selectedDate]);

    // Calculate current score
    const score = useMemo(() => {
        return calculateScore({
            mode: dayState.mode,
            environment: dayState.environment,
            businessFocus: dayState.businessFocus,
            trainingFocus: dayState.trainingFocus,
            microNovelty: dayState.microNovelty,
            macroNovelty: dayState.macroNovelty,
            dopamine: dayState.dopamine,
            clearing: dayState.clearing,
            streak,
        });
    }, [dayState, streak]);

    // Check for stagnation
    const isStagnating = useMemo(() => detectStagnation(history), [history]);

    // Update a field
    const updateField = <K extends keyof DayState>(field: K, value: DayState[K]) => {
        setDayState(prev => ({ ...prev, [field]: value }));
        shouldAutoSaveRef.current = true; // Enable auto-save on user changes
    };

    // Save/submit the current day
    const saveDay = useCallback(async (submit: boolean = false) => {
        if (!user) return;

        setSaving(true);

        const dayData: ExpansionDayInsert = {
            date: selectedDate,
            mode: dayState.mode,
            environment: dayState.environment,
            business_focus: dayState.businessFocus,
            training_focus: dayState.trainingFocus,
            micro_novelty: dayState.microNovelty,
            macro_novelty: dayState.mode === 'expanding' ? dayState.macroNovelty : null,
            dopamine: dayState.dopamine,
            clearing: dayState.clearing,
            score,
            submitted: submit,
            user_id: user.id,
            display_name: displayName || user.email?.split('@')[0] || 'Anonymous',
        };

        const existingDay = history.find(d => d.date === selectedDate);

        if (existingDay) {
            const { error } = await (supabase
                .from('expansion_days') as any)
                .update(dayData as ExpansionDayUpdate)
                .eq('date', selectedDate)
                .eq('user_id', user.id);
            if (error) console.error('Failed to update day:', error);
        } else {
            const { error } = await (supabase
                .from('expansion_days') as any)
                .insert(dayData as ExpansionDayInsert);
            if (error) console.error('Failed to insert day:', error);
        }

        // Update local history without refetching (prevents loop)
        setHistory(prev => {
            const filtered = prev.filter(d => d.date !== selectedDate);
            const newDay: ExpansionDay = {
                id: existingDay?.id || crypto.randomUUID(),
                date: selectedDate,
                mode: dayState.mode,
                environment: dayState.environment,
                business_focus: dayState.businessFocus,
                training_focus: dayState.trainingFocus,
                micro_novelty: dayState.microNovelty,
                macro_novelty: dayState.mode === 'expanding' ? dayState.macroNovelty : null,
                dopamine: dayState.dopamine,
                clearing: dayState.clearing,
                score,
                submitted: submit,
                user_id: user?.id || null,
                display_name: displayName || user?.email?.split('@')[0] || null,
                created_at: existingDay?.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            return [...filtered, newDay].sort((a, b) => b.date.localeCompare(a.date));
        });


        setSaving(false);

        if (submit) {
            setDayState(prev => ({ ...prev, submitted: true }));
        }

        shouldAutoSaveRef.current = false;
    }, [selectedDate, dayState, score, history]);

    // Auto-save draft on change (debounced) - only when user makes changes
    useEffect(() => {
        if (loading || !shouldAutoSaveRef.current || dayState.submitted) return;

        const timeout = setTimeout(() => {
            if (shouldAutoSaveRef.current) {
                saveDay(false);
            }
        }, 1500);

        return () => clearTimeout(timeout);
    }, [dayState, loading, saveDay]);

    return {
        history,
        selectedDate,
        dayState,
        score,
        streak,
        isStagnating,
        loading,
        saving,
        setSelectedDate,
        updateField,
        saveDay,
        isToday: selectedDate === getTodayString(),
        mode: dayState.mode,
    };
};
