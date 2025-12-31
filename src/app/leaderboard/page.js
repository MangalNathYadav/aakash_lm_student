"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Trophy, Medal, Star, Info, Loader2, ArrowUpCircle, ArrowDownCircle, MinusCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TrendIcon = ({ trend }) => {
    if (trend === 'improving') return <ArrowUpCircle className="w-4 h-4 text-green-500" />;
    if (trend === 'declining') return <ArrowDownCircle className="w-4 h-4 text-red-500" />;
    return <MinusCircle className="w-4 h-4 text-slate-300" />;
};

export default function LeaderboardPage() {
    const { user: currentUser } = useAuth();
    const [leaderboard, setLeaderboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeBoard, setActiveBoard] = useState('latest_scores');

    const boards = [
        { id: 'latest_scores', name: 'Latest Scores', icon: Medal },
        { id: 'overall_average', name: 'Overall Average', icon: Trophy },
        { id: 'consistency_index', name: 'Consistency Rank', icon: Star },
    ];

    useEffect(() => {
        const fetchBoard = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/leaderboards/public/${activeBoard}.json`);
                const data = await res.json();
                setLeaderboard(data);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            }
            setLoading(false);
        };
        fetchBoard();
    }, [activeBoard]);

    const [sortOrder, setSortOrder] = useState('none'); // none, asc, desc
    const [selectedBatch, setSelectedBatch] = useState('All');

    // Get unique batches from data
    const uniqueBatches = ['All', ...new Set(leaderboard?.entries?.map(e => e.batch).filter(Boolean) || [])].sort();

    // Data for "My Status" bar
    const userGlobalEntry = leaderboard?.entries?.find(e => e.psid === currentUser?.psid);
    const batchEntries = leaderboard?.entries?.filter(e => e.batch === selectedBatch) || [];
    const userBatchRank = selectedBatch !== 'All'
        ? (batchEntries.findIndex(e => e.psid === currentUser?.psid) + 1)
        : null;

    const getDisplayEntries = () => {
        if (!leaderboard?.entries) return [];
        let list = [...leaderboard.entries];

        if (selectedBatch !== 'All') {
            list = list.filter(e => e.batch === selectedBatch);
        }

        if (sortOrder === 'asc') {
            list.sort((a, b) => (a.batch || '').localeCompare(b.batch || ''));
        } else if (sortOrder === 'desc') {
            list.sort((a, b) => (b.batch || '').localeCompare(a.batch || ''));
        }

        return list.slice(0, 100);
    };

    const toggleSort = () => {
        if (sortOrder === 'none') setSortOrder('asc');
        else if (sortOrder === 'asc') setSortOrder('desc');
        else setSortOrder('none');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
            >
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-3xl font-bold text-slate-900 mb-2"
                    >
                        Student Rank List
                    </motion.h1>
                    <p className="text-slate-500 text-sm">See how you compare with other students across different categories.</p>
                </div>

                {/* Compact Horizontal Scrollable Tabs */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:justify-center">
                    {boards.map((board) => (
                        <button
                            key={board.id}
                            onClick={() => { setActiveBoard(board.id); setSortOrder('none'); }}
                            className={`flex items-center flex-shrink-0 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${activeBoard === board.id
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                                }`}
                        >
                            <board.icon size={14} className="mr-1.5 sm:mr-2" />
                            {board.name}
                        </button>
                    ))}
                </div>

                {/* Compact Methodology Explanation */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-4xl mx-auto mb-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                >
                    <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
                        <Info size={14} className="text-blue-600" />
                        <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Methodology & Logic</span>
                    </div>
                    <div className="p-4 sm:p-5">
                        {activeBoard === 'latest_scores' && (
                            <div className="space-y-2">
                                <h3 className="font-bold text-sm sm:text-base text-slate-900 border-l-4 border-blue-600 pl-3">Latest Scores</h3>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    This leaderboard represents the raw standings from the **most recent exam**. It is a direct "snapshot" of your competitive position.
                                </p>
                            </div>
                        )}
                        {activeBoard === 'overall_average' && (
                            <div className="space-y-2">
                                <h3 className="font-bold text-sm sm:text-base text-slate-900 border-l-4 border-blue-600 pl-3">Overall Average</h3>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Calculated as the **Simple Arithmetic Mean** of all your test scores.
                                </p>
                                <div className="bg-slate-50 p-2 rounded-lg font-mono text-[10px] sm:text-xs text-blue-700 flex justify-center italic">
                                    Overall Average = (Sum of Scores) ÷ (Tests Taken)
                                </div>
                            </div>
                        )}
                        {activeBoard === 'consistency_index' && (
                            <div className="space-y-2">
                                <h3 className="font-bold text-sm sm:text-base text-slate-900 border-l-4 border-blue-600 pl-3">Consistency Rank</h3>
                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Identifies students with high-performance stability, not just high peaks.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                        <h4 className="text-[10px] font-bold text-blue-800 uppercase mb-1">The Formula</h4>
                                        <p className="font-mono text-[9px] sm:text-[10px] text-blue-900 leading-relaxed">
                                            Rank = Avg_Score × (1 / (Volatility + 1))
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        <h4 className="text-[10px] font-bold text-slate-700 uppercase mb-1">Key Factors</h4>
                                        <ul className="text-[10px] text-slate-600 space-y-1 list-disc pl-3">
                                            <li><strong>Volatility:</strong> Lower SD is better.</li>
                                            <li><strong>Reliability:</strong> Bonus for 10+ tests.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                        {sortOrder !== 'none' && (
                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-blue-700 font-bold text-[10px] uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                Sorted by Batch ({sortOrder}).
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Filter & Table Actions */}
                <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                        <label htmlFor="batch-filter" className="text-xs font-bold text-slate-500 uppercase">Filter By Batch:</label>
                        <select
                            id="batch-filter"
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                        >
                            {uniqueBatches.map(batch => (
                                <option key={batch} value={batch}>{batch}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                        Showing {getDisplayEntries().length} students {selectedBatch !== 'All' ? `from ${selectedBatch}` : 'overall'}
                    </div>
                </div>

                {/* Clean Leaderboard Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative"
                >
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-3 px-1 sm:px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-8 sm:w-16 text-center">#</th>
                                    <th className="py-3 px-2 sm:px-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider w-[55%]">Student</th>
                                    <th className="py-3 px-2 sm:px-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Score</th>
                                    <th className="hidden sm:table-cell py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-24">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <AnimatePresence mode="wait">
                                    {getDisplayEntries().map((entry, idx) => {
                                        const displayRank = selectedBatch === 'All' ? entry.rank : idx + 1;
                                        const isCurrentUser = currentUser?.psid === entry.psid;
                                        return (
                                            <motion.tr
                                                key={`${entry.psid}-${selectedBatch}`} // changing key forces re-render on batch change
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2, delay: idx * 0.03 }} // Staggered rows
                                                id={isCurrentUser ? `user-row-${currentUser.psid}` : undefined}
                                                className={`transition-all ${isCurrentUser ? 'bg-blue-600/5 ring-1 ring-inset ring-blue-600/20 shadow-sm' : 'hover:bg-slate-50/80'} ${!isCurrentUser && displayRank <= 3 ? 'bg-blue-50/30' : ''}`}
                                            >
                                                <td className="py-2 px-1 sm:py-4 sm:px-4 text-center">
                                                    <span className={`inline-flex items-center justify-center w-5 h-5 sm:w-8 sm:h-8 rounded-full text-[10px] sm:text-sm font-bold ${displayRank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                                        displayRank === 2 ? 'bg-slate-100 text-slate-700' :
                                                            displayRank === 3 ? 'bg-amber-100 text-amber-700' :
                                                                'text-slate-400'
                                                        }`}>
                                                        {displayRank}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-2 sm:py-4 sm:px-4">
                                                    <div className="flex flex-col min-w-0">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <span className={`font-bold text-xs sm:text-sm capitalize truncate ${isCurrentUser ? 'text-blue-700' : 'text-slate-800'}`}>
                                                                {entry.name || 'Anonymous'}
                                                            </span>
                                                            {isCurrentUser && <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">You</span>}
                                                        </div>

                                                        {/* Merged Batch and PSID row for mobile */}
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold border border-slate-200">
                                                                {entry.batch || 'N/A'}
                                                            </span>
                                                            <span className="text-[9px] text-slate-400 font-mono tracking-wider hidden sm:inline">
                                                                {"***" + (entry.psid?.slice(-3) || "---")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-2 sm:py-4 sm:px-4 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="font-bold text-sm sm:text-base text-slate-900">
                                                            {typeof entry.score === 'number' ? entry.score.toLocaleString() : entry.score}
                                                        </span>
                                                        {/* Mobile Trend Indicator */}
                                                        <div className="sm:hidden mt-0.5">
                                                            <TrendIcon trend={entry.trend} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden sm:table-cell py-4 px-4 text-right">
                                                    <div className="flex justify-end">
                                                        <TrendIcon trend={entry.trend} />
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-200 text-center">
                        <p className="text-xs font-semibold text-slate-400">
                            Viewing Top 100 Students • Updated Automatically
                        </p>
                    </div>
                </motion.div>

                {/* Sticky My Rank Bar */}
                <AnimatePresence>
                    {currentUser && userGlobalEntry && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-white/90 backdrop-blur-md border-t border-blue-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
                        >
                            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 sm:gap-6">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-200">
                                        <User size={16} className="sm:w-5 sm:h-5" />
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logged In As</p>
                                        <h4 className="text-sm font-bold text-slate-900 capitalize">{currentUser.name}</h4>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 sm:gap-12 flex-1 justify-end sm:justify-center">
                                    <div className="text-center">
                                        <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Global Rank</p>
                                        <span className="text-base sm:text-lg font-black text-blue-600 tracking-tight">#{userGlobalEntry.rank}</span>
                                    </div>
                                    {selectedBatch !== 'All' && userGlobalEntry.batch === selectedBatch && (
                                        <div className="text-center border-l border-slate-200 pl-4 sm:pl-12">
                                            <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Batch Rank</p>
                                            <span className="text-base sm:text-lg font-black text-blue-600 tracking-tight">#{userBatchRank}</span>
                                        </div>
                                    )}
                                    <div className="text-center border-l border-slate-200 pl-4 sm:pl-12">
                                        <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Score</p>
                                        <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{userGlobalEntry.score}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const row = document.getElementById(`user-row-${currentUser.psid}`);
                                        if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }}
                                    className="hidden lg:flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
                                >
                                    Jump to Me
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Spacer for sticky bar */}
                {currentUser && <div className="h-32 sm:h-24"></div>}
            </motion.main>
        </div>
    );
}
