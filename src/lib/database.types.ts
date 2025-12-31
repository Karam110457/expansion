export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            expansion_days: {
                Row: {
                    id: string
                    date: string
                    mode: 'building' | 'expanding'
                    environment: number
                    business_focus: number
                    training_focus: number
                    micro_novelty: MicroNovelty
                    macro_novelty: number | null
                    dopamine: number
                    clearing: number
                    score: number
                    submitted: boolean
                    user_id: string | null
                    display_name: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    date: string
                    mode: 'building' | 'expanding'
                    environment: number
                    business_focus?: number
                    training_focus?: number
                    micro_novelty?: MicroNovelty
                    macro_novelty?: number | null
                    dopamine?: number
                    clearing?: number
                    score?: number
                    submitted?: boolean
                    user_id?: string
                    display_name?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    date?: string
                    mode?: 'building' | 'expanding'
                    environment?: number
                    business_focus?: number
                    training_focus?: number
                    micro_novelty?: MicroNovelty
                    macro_novelty?: number | null
                    dopamine?: number
                    clearing?: number
                    score?: number
                    submitted?: boolean
                    user_id?: string
                    display_name?: string
                    created_at?: string
                    updated_at?: string
                }

            }
        }
    }
}

export interface MicroNovelty {
    newBook: boolean       // New knowledge input
    newBookText?: string  // Custom text for new book
    newPerson: boolean     // New conversation
    newPersonText?: string // Custom text for new person
    newMethod: boolean     // New technique/approach
    newMethodText?: string // Custom text for new method
    newPlace: boolean      // Worked from new spot
    newPlaceText?: string  // Custom text for new place
    newChallenge: boolean  // Tackled something difficult
    newChallengeText?: string // Custom text for new challenge
}


export type ExpansionDay = Database['public']['Tables']['expansion_days']['Row']
export type ExpansionDayInsert = Database['public']['Tables']['expansion_days']['Insert']
export type ExpansionDayUpdate = Database['public']['Tables']['expansion_days']['Update']

export type ExpansionMode = 'building' | 'expanding'
export type EnvironmentValue = number // 0 to 1, increments of 0.1

