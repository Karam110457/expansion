export type DailyData = {
    date: string; // ISO date string YYYY-MM-DD
    environment: 0.1 | 0.5 | 1.0;
    novelty: 1 | 3 | 5 | 7 | 10; // Card-based selection
    businessFocus: number;

    trainingFocus: number;
    dopamine: number; // Dh
    clearing: number; // Ex
    score: number;
};
