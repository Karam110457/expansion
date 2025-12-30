import { useState } from 'react';
import { ArrowLeft, Zap, Target, BookOpen, Layers, Flame, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

const DefinitionsPage = () => {
    const [activeTab, setActiveTab] = useState<'building' | 'expanding'>('building');

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <header className="flex items-center gap-3">
                <Link to="/" className="p-2 hover:bg-surface-100 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Physics of Expansion
                    </h1>
                    <p className="text-sm text-gray-500">The mathematical framework for your growth</p>
                </div>
            </header>

            {/* Formula Card */}
            <section className="glass-card p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Calculator className="w-16 h-16" />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 relative z-10">
                    <button
                        onClick={() => setActiveTab('building')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'building'
                            ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                            : 'bg-surface-100 text-gray-400 hover:text-white'
                            }`}
                    >
                        Building Mode
                    </button>
                    <button
                        onClick={() => setActiveTab('expanding')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'expanding'
                            ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                            : 'bg-surface-100 text-gray-400 hover:text-white'
                            }`}
                    >
                        Expanding Mode
                    </button>
                </div>

                {/* Formula Display */}
                <div className="mb-8 p-8 bg-black/40 rounded-2xl border border-white/5 text-center relative z-10 backdrop-blur-xl shadow-2xl">
                    {activeTab === 'building' ? (
                        <div className="space-y-6">
                            <div className="text-2xl md:text-4xl font-serif tracking-widest text-blue-200 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                Score = <span className="text-blue-400 font-bold">E</span> × <span className="text-blue-400 font-bold">F</span> × (1 + <span className="text-blue-400 font-bold">N</span>) × <span className="text-orange-400 font-bold">S</span>
                            </div>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"></div>
                            <div className="text-xl md:text-3xl font-serif tracking-widest text-red-200 opacity-90">
                                (1 + <span className="text-red-400 font-bold">Sludge</span>)
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-2xl md:text-4xl font-serif tracking-widest text-amber-200 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                                Score = <span className="text-amber-400 font-bold">E</span> × <span className="text-amber-400 font-bold">N</span> × (<span className="text-amber-400 font-bold">F</span> + 1)
                            </div>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"></div>
                            <div className="text-xl md:text-3xl font-serif tracking-widest text-red-200 opacity-90">
                                (1 + <span className="text-red-400 font-bold">Sludge</span>)
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Variable Definitions */}
            <div className="space-y-4">
                {/* Environment */}
                <div className="glass-card p-5 group hover:bg-surface-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="font-serif italic text-indigo-400 text-xl">E</span>
                                <span>Environment</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal">The Bandwidth Multiplier</span>
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                The physical distance between you and your "rest state". It determines your available mental bandwidth.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                                <div className="p-2 rounded bg-surface-100 border border-surface-200">
                                    <div className="text-indigo-400 font-bold text-xs mb-1">0.1 (The Room)</div>
                                    <div className="text-[10px] text-gray-500">"Legacy code" mode. High resistance.</div>
                                </div>
                                <div className="p-2 rounded bg-surface-100 border border-surface-200">
                                    <div className="text-indigo-400 font-bold text-xs mb-1">0.5 (Downstairs)</div>
                                    <div className="text-[10px] text-gray-500">Better, but "home" signal persists.</div>
                                </div>
                                <div className="p-2 rounded bg-surface-100 border border-surface-200">
                                    <div className="text-indigo-400 font-bold text-xs mb-1">1.0 (Third Space)</div>
                                    <div className="text-[10px] text-gray-500">High-Alert mode. Library, cafe, gym.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Focus */}
                <div className="glass-card p-5 group hover:bg-surface-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                            <Target className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="font-serif italic text-blue-400 text-xl">F</span>
                                <span>Focus</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-normal">The Volume of Work</span>
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                The primary driver of success. Raw hours spent building your business and body.
                            </p>
                            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside marker:text-blue-500">
                                <li><span className="font-serif italic text-blue-300">Fb</span> (Business): Deep work, no phone, single-tasking.</li>
                                <li><span className="font-serif italic text-blue-300">Ft</span> (Training): High-intensity physical training.</li>
                            </ul>
                            <div className="text-xs text-blue-400/80 italic mt-2">
                                "If F is 0, the entire day's score is 0."
                            </div>
                        </div>
                    </div>
                </div>

                {/* Novelty */}
                <div className="glass-card p-5 group hover:bg-surface-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 group-hover:bg-amber-500/30 transition-colors">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="font-serif italic text-amber-400 text-xl">N</span>
                                <span>Novelty</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-normal">The Time Expander</span>
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Creates "Memory Anchors" that prevent life from blurring. Determines how much unique data your brain records.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                <div className="p-3 rounded-lg bg-surface-100/50">
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">Micro-Novelty (Building)</span>
                                    <p className="text-xs text-gray-400">Small injections of "neural freshness" - new book, new conversation, new route.</p>
                                </div>
                                <div className="p-3 rounded-lg bg-surface-100/50">
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">Macro-Novelty (Expanding)</span>
                                    <p className="text-xs text-gray-400">Larger shifts - visiting a new spot, traveling to a new city, exploring unknown territory.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sludge */}
                <div className="glass-card p-5 group hover:bg-surface-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-500/20 rounded-xl text-red-500 group-hover:bg-red-500/30 transition-colors">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="font-serif italic text-red-500 text-xl">Dp</span>
                                <span>The Sludge</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-normal">The Friction Divisor</span>
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                "Neural Sludge" - the cognitive cost of low-effort stimulation (scrolling, mindless consumption) that divides your score.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-green-400 mt-2">
                                <span className="font-bold uppercase tracking-wider">Antidote:</span>
                                <span>Clearing (Ex) - High intensity exercise reduces the penalty.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Streak */}
                <div className="glass-card p-5 group hover:bg-surface-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-500/20 rounded-xl text-orange-500 group-hover:bg-orange-500/30 transition-colors">
                            <Flame className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="font-serif italic text-orange-500 text-xl">S</span>
                                <span>Streak</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-normal">Momentum</span>
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Multiplier (1.0 - 1.5x) based on consecutive days with <span className="text-white font-bold">4+ hours</span> of Focus. Consistency compounds.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefinitionsPage;
