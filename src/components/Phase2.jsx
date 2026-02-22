import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const tutors = [
    {
        id: 'nchad',
        name: 'Nerdy Chad',
        image: '/src/assets/Images/nchad.jpg',
        subtext: 'Maximum Logic. Zero Fluff.',
    },
    {
        id: 'equeen',
        name: 'Energy Queen',
        image: '/src/assets/Images/equeen.jpg',
        subtext: 'High Energy. High Retention.',
    }
];

export default function Phase2({ onComplete, onTutorSelect, onBack }) {
    const [generating, setGenerating] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleSelect = (tutor) => {
        setSelectedId(tutor.id);
        setGenerating(true);
        onTutorSelect(tutor);
        setTimeout(() => {
            onComplete();
        }, 2000);
    };

    return (
        <motion.div
            className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-950 relative transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <header className="bg-white dark:bg-gray-900 px-6 pt-10 pb-6 shadow-sm border-b border-gray-100 dark:border-gray-800 flex flex-col gap-4 relative z-20 transition-colors">
                <button
                    onClick={onBack}
                    disabled={generating}
                    className={`flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors w-fit ${generating ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium text-sm">Back to Dashboard</span>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Choose Your Sigma Tutor</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Select an AI Sigma Tutor style for your generated modules.</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-8 pb-24 z-10">
                <div className="flex flex-col gap-6">
                    {tutors.map((tutor, idx) => (
                        <motion.div
                            key={tutor.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', bounce: 0.4, duration: 0.8, delay: idx * 0.1 }}
                            onClick={() => !generating && handleSelect(tutor)}
                            className={`relative bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border-2 cursor-pointer group transition-all duration-300 ${selectedId === tutor.id
                                ? 'border-brand-500 shadow-[0_8px_30px_rgba(144,194,130,0.3)] dark:shadow-[0_8px_30px_rgba(144,194,130,0.15)]'
                                : 'border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md'
                                } ${generating && selectedId !== tutor.id ? 'opacity-50 pointer-events-none scale-95' : ''}`}
                        >
                            {selectedId === tutor.id && (
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center shadow-md z-20">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                            )}

                            <div className="flex gap-5 items-center">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100 dark:border-gray-800 group-hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-shadow">
                                    <img src={tutor.image} alt={tutor.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{tutor.name}</h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{tutor.subtext}</p>
                                    <div className="mt-3 px-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 w-fit group-hover:bg-brand-50 dark:group-hover:bg-brand-900/30 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                                        View Demo Profile
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {generating && (
                <motion.div
                    className="absolute inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-6"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                >
                    <div className="w-16 h-16 bg-brand-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner border border-brand-200 dark:border-gray-700">
                        <img src="/src/assets/Images/auraed.png" alt="Aura-Ed" className="w-10 h-10 object-contain animate-bounce" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex gap-2 items-center">
                        <span>Generating</span>
                        <span className="text-brand-500">Learning Path</span>
                        <span className="flex gap-1">
                            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                        </span>
                    </div>
                    <div className="w-full max-w-[240px] h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative shadow-inner">
                        <motion.div className="h-full bg-brand-500 rounded-full" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.8, ease: "easeInOut" }} />
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
