import { useExpansionStore } from '../hooks/useExpansionStore';
import ScoreDisplay from '../components/Expansion/ScoreDisplay';
import EnvironmentToggle from '../components/Expansion/EnvironmentToggle';
import ModeToggle from '../components/Expansion/ModeToggle';
import MicroNoveltyChecklist from '../components/Expansion/MicroNoveltyChecklist';
import MacroNoveltySlider from '../components/Expansion/MacroNoveltySlider';
import NumberInput from '../components/Expansion/NumberInput';
import CalendarView from '../components/Expansion/CalendarView';
import StagnationAlert from '../components/Expansion/StagnationAlert';
import StatsView from '../components/Expansion/StatsView';
import { Brain, Trash2, Zap, Flame, Calendar, Check, Loader2, BarChart3 } from 'lucide-react';
import type { EnvironmentValue, MicroNovelty, ExpansionMode } from '../lib/database.types';

const TrackerPage = () => {
  const {
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
    isToday,
  } = useExpansionStore();

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-neon-blue" />
      </div>
    );
  }

  return (
    <div className="py-6 pb-24 space-y-5">


      {/* Date indicator */}
      <div className="text-center pt-2">
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm text-gray-400">
            {selectedDate === today ? 'Today' : new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 border border-orange-500/30">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="text-xs font-bold text-orange-400">{streak}</span>
            </div>
          )}
        </div>
        {dayState.submitted && (
          <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
            <Check className="w-3 h-3" />
            Submitted
          </div>
        )}
      </div>

      {/* Mode Toggle */}
      <ModeToggle
        mode={dayState.mode}
        onChange={(mode: ExpansionMode) => updateField('mode', mode)}
      />

      {/* Stagnation Alert */}
      <StagnationAlert show={isStagnating} />

      {/* Score Display */}
      <ScoreDisplay
        score={score}
        mode={dayState.mode}
        environment={dayState.environment}
        businessFocus={dayState.businessFocus}
        trainingFocus={dayState.trainingFocus}
        microNovelty={dayState.microNovelty}
        macroNovelty={dayState.macroNovelty}
        dopamine={dayState.dopamine}
        clearing={dayState.clearing}
        streak={streak}
        isStagnating={isStagnating}
      />

      {/* Inputs */}
      <div className="space-y-5">
        {/* Environment - Only show in Building mode */}
        {dayState.mode === 'building' && (
          <section className="glass-card p-5">
            <EnvironmentToggle
              value={dayState.environment}
              onChange={(val: EnvironmentValue) => updateField('environment', val)}
            />
          </section>
        )}

        {/* Auto E=1.0 notice for Expanding */}
        {dayState.mode === 'expanding' && (
          <div className="text-xs text-amber-400/70 text-center px-4">
            ✨ Environment auto-set to 1.0x in Expanding mode
          </div>
        )}

        {/* Novelty - Mode dependent */}
        <section className="glass-card p-5">
          {dayState.mode === 'building' ? (
            <MicroNoveltyChecklist
              value={dayState.microNovelty}
              onChange={(val: MicroNovelty) => updateField('microNovelty', val)}
            />
          ) : (
            <MacroNoveltySlider
              value={dayState.macroNovelty}
              onChange={(val) => updateField('macroNovelty', val)}
            />
          )}
        </section>

        {/* Focus Work */}
        <section className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Brain className={`w-4 h-4 ${dayState.mode === 'building' ? 'text-blue-400' : 'text-amber-400'}`} />
            <h3 className={`text-xs font-bold uppercase tracking-widest ${dayState.mode === 'building' ? 'text-blue-400' : 'text-amber-400'}`}>
              Focus Hours
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Business"
              subLabel="Deep Work"
              value={dayState.businessFocus}
              onChange={(val) => updateField('businessFocus', val)}
              color={dayState.mode === 'building' ? 'blue' : 'yellow'}
            />
            <NumberInput
              label="Training"
              subLabel="Physical"
              value={dayState.trainingFocus}
              onChange={(val) => updateField('trainingFocus', val)}
              color={dayState.mode === 'building' ? 'blue' : 'yellow'}
            />
          </div>
          {/* Streak requirement hint */}
          {dayState.mode === 'building' && (
            <p className="text-xs text-gray-500 text-center">
              Need 4+ hours total to build streak
            </p>
          )}
        </section>

        {/* The Sludge */}
        <section className="glass-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-500" />
            <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest">The Sludge</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="Entropy"
              subLabel="Junk Dopamine"
              value={dayState.dopamine}
              onChange={(val) => updateField('dopamine', val)}
              color="red"
            />
            <NumberInput
              label="Clearing"
              subLabel="Exercise"
              value={dayState.clearing}
              onChange={(val) => updateField('clearing', val)}
              color="green"
            />
          </div>
          {dayState.dopamine > dayState.clearing * 0.5 && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <Zap className="w-3 h-3 flex-shrink-0" />
              <span>Sludge penalty: ÷{(1 + dayState.dopamine - (dayState.clearing * 0.5)).toFixed(1)} (clearing weighted 0.5x)</span>
            </div>
          )}
        </section>

        {/* Calendar View */}
        <section className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-gray-400" />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">History</h3>
          </div>
          <CalendarView
            history={history}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </section>

        {/* Stats View */}
        <section className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stats</h3>
          </div>
          <StatsView history={history} />
        </section>
      </div>


      {/* Submit Button - Fixed at bottom, aligned with content */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 p-4 bg-gradient-to-t from-background via-background to-transparent z-40">
        <div className="max-w-lg mx-auto px-2">

          <button
            onClick={() => saveDay(true)}
            disabled={saving || dayState.submitted}
            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${dayState.submitted
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
              : dayState.mode === 'building'
                ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)]'
              }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : dayState.submitted ? (
              <>
                <Check className="w-4 h-4" />
                Day Submitted
              </>
            ) : (
              <>
                Submit {isToday ? 'Today' : 'Day'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackerPage;
