import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { BookOpen, Bookmark, Reply, Heart, ArrowLeft, MoreHorizontal, Volume2, VolumeX, Play, ShieldAlert, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

const ALL_VIDEOS = [
    { id: 1, src: '/src/assets/Videos/Encapsulation.mp4', title: '#Encapsulation', tutorImg: '/src/assets/Images/equeen.jpg', quizText: "What is the primary purpose of Encapsulation?", options: ["Exposing all data", "Data Hiding & Security", "Running faster", "Adding styles"], answerIndex: 1 },
    { id: 2, src: '/src/assets/Videos/Polymorphism.mp4', title: '#Polymorphism', tutorImg: '/src/assets/Images/nchad.jpg', quizText: "Polymorphism allows objects to be treated as instances of their...", options: ["Parent class", "Variables", "Functions", "Databases"], answerIndex: 0 },
    { id: 3, src: '/src/assets/Videos/Search.mp4', title: '#Search', tutorImg: '/src/assets/Images/nchad.jpg', quizText: "Which search algorithm is O(log n) on sorted arrays?", options: ["Linear Search", "Jump Search", "Binary Search", "Random Search"], answerIndex: 2 }
];

export default function Phase3({ onBack, likedVideos, setLikedVideos, auraScore, setAuraScore }) {
    const containerRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'favorites'
    const videoRefs = useRef({});
    const [quizActiveFor, setQuizActiveFor] = useState(null); // id of video with active quiz
    const [quizCompleted, setQuizCompleted] = useState({}); // { 1: true }
    const [quizSelection, setQuizSelection] = useState(null);

    const displayedVideos = activeTab === 'feed'
        ? ALL_VIDEOS
        : ALL_VIDEOS.filter(vid => likedVideos.includes(vid.id));

    // Handle auto-playing logic on scroll
    useEffect(() => {
        const videoElements = document.querySelectorAll('.feed-video');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                const vidId = parseInt(video.dataset.videoid);

                if (entry.isIntersecting) {
                    video.play().then(() => {
                        setPlayingVideoId(vidId);
                    }).catch(e => {
                        setIsMuted(true);
                        video.muted = true;
                        video.play().then(() => setPlayingVideoId(vidId)).catch(err => console.error(err));
                    });
                } else {
                    video.pause();
                    if (playingVideoId === vidId) {
                        setPlayingVideoId(null);
                    }
                }
            });
        }, { root: containerRef.current, threshold: 0.6 });

        videoElements.forEach(video => observer.observe(video));
        return () => {
            videoElements.forEach(video => observer.unobserve(video));
            observer.disconnect();
        };
    }, [displayedVideos]); // Re-bind observer when displayed videos change

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        Object.values(videoRefs.current).forEach(video => {
            if (video) video.muted = newMutedState;
        });
    };

    const handleVideoClick = (id) => {
        if (quizActiveFor) return; // disable pause/play via click if quiz overlay is up
        const video = videoRefs.current[id];
        if (!video) return;
        if (video.paused) { video.play(); setPlayingVideoId(id); }
        else { video.pause(); setPlayingVideoId(null); }
    };

    const handleTimeUpdate = (id) => {
        const video = videoRefs.current[id];
        if (!video || quizCompleted[id] || quizActiveFor === id) return;

        // Trigger quiz near the end of the video
        if (video.currentTime > 0 && video.duration - video.currentTime < 0.5) {
            video.pause();
            setQuizActiveFor(id);
        }
    };

    const submitQuiz = (vidId, isCorrect) => {
        setQuizSelection(isCorrect);
        if (isCorrect) {
            setAuraScore(prev => prev + 100);
        }
        setTimeout(() => {
            setQuizCompleted(prev => ({ ...prev, [vidId]: true }));
            setQuizActiveFor(null);
            setQuizSelection(null);
            if (videoRefs.current[vidId]) videoRefs.current[vidId].play();
        }, 1500);
    };

    const replayVideo = (vidId) => {
        setQuizActiveFor(null);
        setQuizSelection(null);
        const video = videoRefs.current[vidId];
        if (video) {
            video.currentTime = 0;
            video.play();
            setPlayingVideoId(vidId);
        }
    };

    const toggleLike = (id) => {
        if (likedVideos.includes(id)) {
            setLikedVideos(likedVideos.filter(v => v !== id));
        } else {
            setLikedVideos([...likedVideos, id]);
            setAuraScore(prev => prev + 10);
        }
    };

    return (
        <motion.div className="w-full h-full relative bg-gray-950 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            {/* Top Header Overlay */}
            <div className="absolute top-0 inset-x-0 z-50 flex flex-col bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <div className="flex justify-between items-center px-4 pt-10 pb-2">
                    <button onClick={onBack} className="flex items-center justify-center w-10 h-10 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors pointer-events-auto">
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* Tabs */}
                    <div className="flex gap-4 pointer-events-auto bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg relative">
                        {/* Display Aura here too */}
                        <div className="absolute -top-3 -right-6 px-3 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-md z-10 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-white" />
                            <span className="text-white text-xs font-bold">{auraScore}</span>
                        </div>

                        <button
                            onClick={() => setActiveTab('feed')}
                            className={`font-bold transition-colors ${activeTab === 'feed' ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500' : 'text-gray-400 hover:text-white'}`}
                        >
                            Feed
                        </button>
                        <span className="text-gray-600">|</span>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`font-bold transition-colors ${activeTab === 'favorites' ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500' : 'text-gray-400 hover:text-white'}`}
                        >
                            Favorites
                        </button>
                    </div>

                    <button onClick={toggleMute} className="flex items-center justify-center w-10 h-10 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors pointer-events-auto">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div ref={containerRef} className="flex-1 w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar relative">
                {displayedVideos.length === 0 && activeTab === 'favorites' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8 text-center bg-gray-950">
                        <Heart className="w-16 h-16 text-gray-700 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">No Favorites Yet</h2>
                        <p className="text-gray-400">Heart a video in the Feed to see it saved here for quick review later.</p>
                        <button onClick={() => setActiveTab('feed')} className="mt-6 px-6 py-3 bg-brand-500 rounded-full font-bold hover:bg-brand-600 transition-colors active:scale-95 text-gray-900">Go to Feed</button>
                    </div>
                ) : (
                    displayedVideos.map((vid) => (
                        <div key={vid.id + activeTab} className="w-full h-[100dvh] snap-start relative flex items-center justify-center bg-gray-900 border-b border-gray-800">
                            <video
                                ref={el => videoRefs.current[vid.id] = el}
                                src={vid.src}
                                className="feed-video w-full h-full object-cover cursor-pointer"
                                loop
                                playsInline
                                muted={isMuted}
                                data-videoid={vid.id}
                                onClick={() => handleVideoClick(vid.id)}
                                onTimeUpdate={() => handleTimeUpdate(vid.id)}
                            />

                            <AnimatePresence>
                                {quizActiveFor === vid.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                                        className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6"
                                    >
                                        <div className="bg-gray-900 border border-brand-500 rounded-3xl p-6 w-full max-w-sm shadow-2xl shadow-brand-500/20">
                                            <div className="flex items-center gap-2 mb-4">
                                                <ShieldAlert className="w-6 h-6 text-brand-400" />
                                                <h3 className="text-xl font-bold text-white">Sigma Checkpoint</h3>
                                            </div>
                                            <p className="text-gray-300 font-medium text-lg mb-6">{vid.quizText}</p>

                                            <div className="flex flex-col gap-3">
                                                {vid.options.map((opt, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => submitQuiz(vid.id, i === vid.answerIndex)}
                                                        disabled={quizSelection !== null}
                                                        className={`w-full text-left px-5 py-4 rounded-xl font-semibold transition-all ${quizSelection === null
                                                            ? 'bg-gray-800 text-white hover:bg-gray-700 hover:border-brand-500 border border-transparent'
                                                            : (i === vid.answerIndex ? 'bg-green-500 text-white' : 'bg-red-500/50 text-white/50 border border-red-500/50')
                                                            }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Replay Video Button */}
                                            {quizSelection === null && (
                                                <button
                                                    onClick={() => replayVideo(vid.id)}
                                                    className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold bg-gray-800/50 text-brand-400 hover:bg-gray-800 hover:text-brand-300 transition-colors border border-gray-700 hover:border-brand-500/50"
                                                >
                                                    <RotateCcw className="w-5 h-5" />
                                                    Replay Lesson
                                                </button>
                                            )}

                                            <AnimatePresence>
                                                {quizSelection !== null && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
                                                        {quizSelection ? (
                                                            <div className="text-brand-400 font-bold flex flex-col items-center gap-2">
                                                                <Sparkles className="w-8 h-8" />
                                                                <span>Correct! +100 Aura</span>
                                                            </div>
                                                        ) : (
                                                            <div className="text-red-400 font-bold">Incorrect. Stay focused!</div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                )}

                                {playingVideoId !== vid.id && quizActiveFor !== vid.id && (
                                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                        <div className="w-20 h-20 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                                            <Play className="w-10 h-10 text-white ml-2 opacity-80 shadow-sm" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent pointer-events-none" />

                            <div className="absolute bottom-6 left-4 z-10 w-2/3 pointer-events-none">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="px-2 py-0.5 bg-brand-500/90 backdrop-blur-sm rounded-md border border-brand-400 shadow-md">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Lesson</span>
                                    </div>
                                </div>
                                <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{vid.title}</h2>
                                <p className="text-white text-base font-medium line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-snug">Listen closely to your Sigma Tutor as they explain the core concepts of {vid.title.replace('#', '')}.</p>
                            </div>

                            <div className="absolute bottom-6 right-4 z-10 flex flex-col items-center gap-6">
                                <motion.div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-[0_2px_10px_rgba(0,0,0,0.5)] relative cursor-pointer group bg-gray-800 pointer-events-auto" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <img src={vid.tutorImg} alt="Tutor" className="w-full h-full object-cover" />
                                    <div className="absolute -bottom-2 inset-x-0 mx-auto w-5 h-5 bg-brand-500 rounded-full flex justify-center items-center text-[12px] text-gray-900 font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 shadow-md">
                                        +
                                    </div>
                                </motion.div>

                                <div
                                    onClick={() => toggleLike(vid.id)}
                                    className="flex flex-col items-center gap-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] cursor-pointer text-white transition-all pointer-events-auto group hover:scale-110 active:scale-90"
                                >
                                    <Heart className={`w-8 h-8 transition-colors ${likedVideos.includes(vid.id) ? 'fill-red-500 text-red-500' : 'fill-transparent group-hover:fill-pink-500/50 group-hover:text-pink-400'}`} />
                                    <span className={`text-xs font-semibold ${likedVideos.includes(vid.id) ? 'text-red-400' : ''}`}>{likedVideos.includes(vid.id) ? '1' : '0'}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] cursor-pointer text-white hover:text-indigo-300 hover:scale-110 transition-all pointer-events-auto group">
                                    <BookOpen className="w-8 h-8 group-hover:fill-indigo-500/50 transition-colors" />
                                    <span className="text-xs font-semibold">1.2K</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
