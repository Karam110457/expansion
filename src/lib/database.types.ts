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
            custom_novelties: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    label: string
                    completed: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date: string
                    label: string
                    completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    label?: string
                    completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

export interface MicroNovelty {
    newBook: boolean       // New knowledge input
    newPerson: boolean     // New conversation
    newMethod: boolean     // New technique/approach
    newPlace: boolean      // Worked from new spot
    newChallenge: boolean  // Tackled something difficult
}


export type ExpansionDay = Database['public']['Tables']['expansion_days']['Row']
export type ExpansionDayInsert = Database['public']['Tables']['expansion_days']['Insert']
export type ExpansionDayUpdate = Database['public']['Tables']['expansion_days']['Update']

export type ExpansionMode = 'building' | 'expanding'
export type EnvironmentValue = number // Now 0-1 range with 0.1 increments

export interface CustomNovelty {
    id: string
    user_id: string
    date: string
    label: string
    completed: boolean
    created_at: string
    updated_at: string
}
