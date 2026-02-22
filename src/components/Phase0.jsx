import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Phase0({ onComplete }) {
    const [isImploding, setIsImploding] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsImploding(true);
        setTimeout(() => {
            onComplete();
        }, 800);
    };

    return (
        <motion.div
            className="flex items-center justify-center w-full h-full bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                animate={isImploding ? {
                    scale: [1, 1.05, 0],
                    opacity: [1, 1, 0],
                } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm px-8 flex flex-col items-center z-10"
            >
                {/* Large Logo without background circle */}
                <div className="mb-8 w-48 h-48 flex justify-center items-center">
                    <img
                        src="/Images/auraed.png"
                        alt="Aura-Ed Logo"
                        className="w-full h-full object-contain filter drop-shadow-md"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
                <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-8 tracking-tight">Welcome Back</h1>

                <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Username</label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-all font-medium placeholder:font-normal placeholder:text-gray-400"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Passkey</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-all font-medium placeholder:font-normal placeholder:text-gray-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-6 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg py-4 rounded-xl hover:bg-black dark:hover:bg-gray-200 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        Login
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}
