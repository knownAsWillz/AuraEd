import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Phase0 from './components/Phase0';
import Phase1 from './components/Phase1';
import Phase2 from './components/Phase2';
import Phase3 from './components/Phase3';

export default function App() {
  const [phase, setPhase] = useState(0);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [subjects, setSubjects] = useState([]);

  // New Global State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [likedVideos, setLikedVideos] = useState([]);
  const [auraScore, setAuraScore] = useState(999);

  return (
    <div className={`w-full h-screen flex justify-center overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-950' : 'bg-gray-100'}`}>
      <div className="w-full max-w-[480px] h-full shadow-2xl relative bg-white dark:bg-gray-900 sm:border-x sm:border-gray-200 dark:sm:border-gray-800 flex flex-col items-center transition-colors duration-300">
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <Phase0 key="phase0" onComplete={() => setPhase(1)} />
          )}
          {phase === 1 && (
            <Phase1
              key="phase1"
              subjects={subjects}
              setSubjects={setSubjects}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              auraScore={auraScore}
              setAuraScore={setAuraScore}
              onLogout={() => setPhase(0)}
              onSkipToFeed={() => setPhase(3)}
              onComplete={() => setPhase(2)}
            />
          )}
          {phase === 2 && (
            <Phase2
              key="phase2"
              onTutorSelect={setSelectedTutor}
              onBack={() => setPhase(1)}
              onComplete={() => setPhase(3)}
            />
          )}
          {phase === 3 && (
            <Phase3
              key="phase3"
              likedVideos={likedVideos}
              setLikedVideos={setLikedVideos}
              auraScore={auraScore}
              setAuraScore={setAuraScore}
              onBack={() => setPhase(1)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
