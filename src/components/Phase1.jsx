import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Plus, X, UploadCloud, ChevronRight, Folder, FileText, ArrowLeft, Moon, Sun, LogOut, FastForward, Flame } from 'lucide-react';

export default function Phase1({ onComplete, subjects, setSubjects, isDarkMode, setIsDarkMode, auraScore, setAuraScore, onLogout, onSkipToFeed }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newSubName, setNewSubName] = useState('');
    const [newSubCode, setNewSubCode] = useState('');
    const [view, setView] = useState('dashboard');
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [gravitySurge, setGravitySurge] = useState(false);

    // Dropdown state
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAddSubject = (e) => {
        e.preventDefault();
        if (!newSubName.trim() || !newSubCode.trim()) return;
        const newSubject = { id: Date.now().toString(), name: newSubName, code: newSubCode.toUpperCase() };
        setSubjects([...subjects, newSubject]);
        setNewSubName(''); setNewSubCode(''); setShowAddForm(false);
    };

    const removeSubject = (e, id) => { e.stopPropagation(); setSubjects(subjects.filter(s => s.id !== id)); };
    const openSubject = (subject) => { setSelectedSubject(subject); setView('upload'); };

    const handleFileUpload = (e) => {
        if (e.target.files.length > 0) {
            setGravitySurge(true);
            setAuraScore(prev => prev + 50); // Gamification feature A
            setTimeout(() => onComplete(), 1000);
        }
    };

    const fallAnimation = gravitySurge ? {
        y: [0, 800], scale: 0.9, opacity: 0, transition: { duration: 0.7, type: 'spring', bounce: 0.3 }
    } : {};

    if (view === 'upload') {
        return (
            <motion.div
                className="w-full h-full bg-gray-50 dark:bg-gray-950 flex flex-col relative transition-colors duration-300"
                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
            >
                <motion.header
                    animate={fallAnimation}
                    className="bg-white dark:bg-gray-900 px-6 pt-10 pb-6 shadow-sm border-b border-gray-100 dark:border-gray-800 flex flex-col gap-4 relative z-20"
                >
                    <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors w-fit">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium text-sm">Back to Dashboard</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border border-brand-200 dark:border-gray-700">
                            <Folder className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{selectedSubject.name}</h1>
                            <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm">{selectedSubject.code}</p>
                        </div>
                    </div>
                </motion.header>

                <motion.div animate={fallAnimation} className="flex-1 p-6 flex flex-col items-center justify-center relative z-10 overflow-y-auto">
                    <div className="w-full max-w-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 text-center">Material Required</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-8">Upload your syllabus or module outline to generate your learning path.</p>

                        <div className="relative group w-full mb-6">
                            <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <div className="w-full h-56 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center bg-white dark:bg-gray-900 group-hover:bg-brand-50 dark:group-hover:bg-gray-800 group-hover:border-brand-400 dark:group-hover:border-brand-500 transition-all">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-gray-700 transition-all duration-300">
                                    <UploadCloud className="w-8 h-8 text-gray-400 dark:text-gray-500 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Select Document</h3>
                                <p className="text-gray-400 mt-1 text-sm font-medium">PDF, DOCX, or PPTX</p>
                                <div className="mt-6 px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm font-semibold group-hover:bg-brand-500 group-hover:text-white transition-colors">
                                    Browse Files
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
                            <span className="text-xs text-gray-400 dark:text-gray-600 font-bold uppercase tracking-wider">OR</span>
                            <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
                        </div>

                        <button
                            onClick={() => { setGravitySurge(true); setTimeout(() => onSkipToFeed(), 800); }}
                            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl hover:bg-black dark:hover:bg-gray-200 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md"
                        >
                            <FastForward className="w-5 h-5 fill-current" />
                            Skip and Go to Feed
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div className="w-full h-full bg-gray-50 dark:bg-gray-950 flex flex-col relative transition-colors duration-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header className="bg-white dark:bg-gray-900 px-6 pt-10 pb-6 shadow-sm border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-30 relative transition-colors">
                <div className="flex items-center gap-3">
                    {/* Logo with Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-10 h-10 bg-brand-50 dark:bg-gray-800 rounded-full flex items-center justify-center border border-brand-100 dark:border-gray-700 shadow-inner hover:ring-2 hover:ring-brand-400 focus:outline-none transition-all"
                        >
                            <img src="/src/assets/Images/auraed.png" alt="Aura-Ed" className="w-7 h-7 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-12 left-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 py-1"
                                >
                                    <button
                                        onClick={() => { setIsDarkMode(!isDarkMode); setDropdownOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        {isDarkMode ? <Sun className="w-4 h-4 text-brand-500" /> : <Moon className="w-4 h-4 text-brand-500" />}
                                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                    </button>
                                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                                    <button
                                        onClick={() => onLogout()}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</span>
                </div>

                {/* High Contrast Aura Badge */}
                <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-md flex items-center gap-2">
                    <Flame className="w-4 h-4 text-white fill-white animate-pulse" />
                    <span className="text-white font-bold text-sm">Aura: {auraScore}</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-8 pb-24 z-10 relative">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Subjects</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your active learning modules</p>
                    </div>
                    {!showAddForm && (
                        <button onClick={() => setShowAddForm(true)} className="w-10 h-10 bg-brand-500 text-white rounded-full flex items-center justify-center hover:bg-brand-600 shadow-md transition-transform hover:scale-105 active:scale-95">
                            <Plus className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {showAddForm && (
                        <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 24 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="overflow-hidden">
                            <form onSubmit={handleAddSubject} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col gap-4">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-gray-800 dark:text-white">Add New Subject</h3>
                                    <button type="button" onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex gap-3">
                                    <input type="text" placeholder="Subject Name" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30 font-medium" required />
                                    <input type="text" placeholder="Code" value={newSubCode} onChange={(e) => setNewSubCode(e.target.value)} className="w-24 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30 font-medium uppercase" required />
                                </div>
                                <button type="submit" className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-black dark:hover:bg-gray-200 transition-colors">Create Subject</button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col gap-3">
                    <AnimatePresence>
                        {subjects.length === 0 && !showAddForm && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 px-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-gray-300 dark:text-gray-700" />
                                </div>
                                <h3 className="text-gray-800 dark:text-white font-bold mb-1">No subjects yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Create a subject to start analyzing your syllabus.</p>
                                <button onClick={() => setShowAddForm(true)} className="px-6 py-2.5 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-bold rounded-full text-sm hover:bg-brand-200 transition-colors">Add Your First Subject</button>
                            </motion.div>
                        )}

                        {subjects.map((sub, idx) => (
                            <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={sub.id} onClick={() => openSubject(sub)} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center gap-4 relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-800 group-hover:scale-110 transition-transform shrink-0">
                                    <Folder className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5"><span className="text-xs font-bold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md truncate">{sub.code}</span></div>
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{sub.name}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={(e) => removeSubject(e, sub.id)} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100">
                                        <X className="w-5 h-5" />
                                    </button>
                                    <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-brand-500 transition-colors" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
