import { useState, useEffect, useRef } from 'react';
import { BookOpen, Leaf, GitCompare, Plus } from 'lucide-react';
import { useJournal } from './hooks/useJournal';
import { useScene } from './hooks/useScene';
import { useGemini } from './hooks/useGemini';
import { JournalFeed } from './components/journal/JournalFeed';
import { RippleScene } from './components/scene/RippleScene';
import { SimulateView } from './components/simulate/SimulateView';
import { LogSheet } from './components/log/LogSheet';

type Tab = 'journal' | 'ripple' | 'simulate';

const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad'];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('journal');
  const [isLogSheetOpen, setIsLogSheetOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [city, setCity] = useState<string>(() => localStorage.getItem('trace_selected_city') || 'Delhi');

  useEffect(() => {
    localStorage.setItem('trace_selected_city', city);
  }, [city]);

  const fabRef = useRef<HTMLButtonElement>(null);

  const { entries, addEntry, updateEntry, summary } = useJournal(city);
  const sceneState = useScene(entries);
  const { generateStory } = useGemini();

  // Toast effect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string) => {
    setToast(message);
  };

  const handleLogActivity = async (activityId: string) => {
    try {
      showToast('Logged. Generating your story...');
      // 1. Add entry immediately with story: null (triggers skeleton)
      const entry = addEntry(activityId);
      
      // 2. Fetch Gemini story in the background
      const story = await generateStory(entry.activityLabel, entry.relatableUnit, city);
      
      // 3. Update entry with the story
      updateEntry(entry.id, { story });
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error logging activity:', err);
    }
  };

  const handleLogSimulated = (activityId: string, story: string) => {
    // Add entry with the pre-generated story
    addEntry(activityId, story);
    setActiveTab('journal');
  };

  const handleOpenLogFromFeed = () => {
    setIsLogSheetOpen(true);
  };

  const handleCloseLogSheet = () => {
    setIsLogSheetOpen(false);
    // Return focus to FAB as per accessibility rules
    if (fabRef.current) {
      fabRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-base text-green-50 flex flex-col max-w-lg mx-auto border-x border-border/20 shadow-2xl relative">
      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-emerald-500 focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
      >
        Skip to main content
      </a>

      {/* Header bar */}
      <header className="py-5 px-6 border-b border-border/40 flex items-center justify-between bg-surface/30">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-emerald-400">Trace</h1>
          <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase mt-0.5">
            Every choice leaves a trace. Know yours.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <label htmlFor="city-select" className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Location</label>
          <select
            id="city-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-surface border border-border/70 text-emerald-400 font-semibold text-xs py-1 px-2.5 rounded-lg focus-visible:outline-none cursor-pointer mt-1"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 overflow-y-auto px-6 pb-28 pt-2" tabIndex={-1}>
        {activeTab === 'journal' && (
          <JournalFeed
            entries={entries}
            summary={summary}
            pollutionLevel={sceneState.pollutionLevel}
            onOpenLogSheet={handleOpenLogFromFeed}
          />
        )}

        {activeTab === 'ripple' && (
          <div className="flex flex-col gap-6 py-4">
            <div className="text-left">
              <h2 className="text-xl font-bold text-green-50">Ripple Scene</h2>
              <p className="text-sm text-gray-400 mt-1">A living visualization of your choices</p>
            </div>
            <RippleScene sceneState={sceneState} />
            <div className="bg-surface/50 border border-border/50 rounded-2xl p-5 text-left leading-relaxed text-sm text-gray-300">
              <h3 className="font-bold text-green-100 text-sm mb-2">How it works</h3>
              Your cityscape reacts dynamically to your cumulative carbon choices this month. Keep your footprint low to see clear skies, flowing blue waters, and healthy green forests. As emissions grow, watch the landscape change.
            </div>
          </div>
        )}

        {activeTab === 'simulate' && (
          <SimulateView
            onLogSimulated={handleLogSimulated}
            showToast={showToast}
            city={city}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-5 py-3 rounded-full font-bold text-xs shadow-xl z-40 tracking-wider uppercase"
        >
          {toast}
        </div>
      )}

      {/* Bottom Navigation */}
      <nav
        aria-label="Main navigation"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-surface/90 backdrop-blur-md border-t border-border px-4 py-2 flex items-center justify-between z-30 h-[72px]"
      >
        {/* Journal Tab */}
        <button
          onClick={() => setActiveTab('journal')}
          aria-label="Journal feed"
          aria-current={activeTab === 'journal' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-semibold relative transition-colors ${
            activeTab === 'journal' ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="mt-1 text-[10px]">Journal</span>
          {activeTab === 'journal' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-400 rounded-full" />
          )}
        </button>

        {/* Ripple Scene Tab */}
        <button
          onClick={() => setActiveTab('ripple')}
          aria-label="Ripple Scene cityscape"
          aria-current={activeTab === 'ripple' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-semibold relative transition-colors ${
            activeTab === 'ripple' ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Leaf className="w-5 h-5" />
          <span className="mt-1 text-[10px]">Ripple</span>
          {activeTab === 'ripple' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-400 rounded-full" />
          )}
        </button>

        {/* Floating Action Button (Log Choice) */}
        <div className="relative flex-1 flex justify-center -mt-6">
          <button
            ref={fabRef}
            onClick={() => setIsLogSheetOpen(true)}
            aria-label="Log a new choice"
            className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-all hover:scale-105 border-4 border-base focus-visible:outline-none"
          >
            <Plus className="w-7 h-7 stroke-[3]" />
          </button>
        </div>

        {/* Simulate Tab */}
        <button
          onClick={() => setActiveTab('simulate')}
          aria-label="Simulate comparison"
          aria-current={activeTab === 'simulate' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-xs font-semibold relative transition-colors ${
            activeTab === 'simulate' ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <GitCompare className="w-5 h-5" />
          <span className="mt-1 text-[10px]">Simulate</span>
          {activeTab === 'simulate' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-400 rounded-full" />
          )}
        </button>
      </nav>

      {/* Log Bottom Sheet */}
      <LogSheet
        isOpen={isLogSheetOpen}
        onClose={handleCloseLogSheet}
        onLog={handleLogActivity}
        onSimulateClick={() => setActiveTab('simulate')}
      />
    </div>
  );
}

export default App;
