"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Trophy, Medal, Star, Info, Loader2, ArrowUpCircle, ArrowDownCircle, MinusCircle, User } from 'lucide-react';

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
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Rank List</h1>
                    <p className="text-slate-500 text-sm">See how you compare with other students across different categories.</p>
                </div>

                {/* Simplified Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                    {boards.map((board) => (
                        <button
                            key={board.id}
                            onClick={() => { setActiveBoard(board.id); setSortOrder('none'); }}
                            className={`flex items-center px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeBoard === board.id
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                                }`}
                        >
                            <board.icon size={16} className="mr-2" />
                            {board.name}
                        </button>
                    ))}
                </div>

                {/* Methodology Explanation */}
                <div className="max-w-4xl mx-auto mb-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-2">
                        <Info size={16} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Methodology & Logic</span>
                    </div>
                    <div className="p-6">
                        {activeBoard === 'latest_scores' && (
                            <div className="space-y-3">
                                <h3 className="font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Latest Scores</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    This leaderboard represents the raw standings from the **most recent exam (FT08)**. It is a direct "snapshot" of your current competitive position. No averages or weights are applied here.
                                </p>
                            </div>
                        )}
                        {activeBoard === 'overall_average' && (
                            <div className="space-y-3">
                                <h3 className="font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Overall Average</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    This rank is calculated as the **Simple Arithmetic Mean** of your scores.
                                </p>
                                <div className="bg-slate-50 p-3 rounded-lg font-mono text-xs text-blue-700 flex justify-center italic">
                                    Overall Average = (Sum of All Test Scores) ÷ (Number of Tests Taken)
                                </div>
                                <p className="text-slate-500 text-[11px]">
                                    *Useful for identifying your long-term baseline performance regardless of single-day fluctuations.
                                </p>
                            </div>
                        )}
                        {activeBoard === 'consistency_index' && (
                            <div className="space-y-3">
                                <h3 className="font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Consistency Rank (Advanced Performance Intelligence)</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    The Consistency Rank identifies students with high-performance stability. It prevents "one-hit wonders" from ranking high if their past scores were volatile.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                        <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">The Formula</h4>
                                        <p className="font-mono text-[10px] text-blue-900 leading-relaxed">
                                            Rank = Avg_Score × (1 / (Volatility + 1)) × Data_Reliability
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Key Factors</h4>
                                        <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                                            <li><strong>Volatility:</strong> Based on Standard Deviation (Lower is better).</li>
                                            <li><strong>Reliability:</strong> Weighed higher if you've taken 10+ tests.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                        {sortOrder !== 'none' && (
                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-blue-700 font-bold text-[10px] uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                                Custom Sort Enabled: Showing {sortOrder} order by Batch.
                            </div>
                        )}
                    </div>
                </div>

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
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                                    <th
                                        className="py-4 px-6 text-xs font-bold text-blue-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors flex items-center gap-2 select-none"
                                        onClick={toggleSort}
                                    >
                                        Batch
                                        {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '↕'}
                                    </th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {getDisplayEntries().map((entry, idx) => {
                                    const displayRank = selectedBatch === 'All' ? entry.rank : idx + 1;
                                    const isCurrentUser = currentUser?.psid === entry.psid;
                                    return (
                                        <tr
                                            key={idx}
                                            id={isCurrentUser ? `user-row-${currentUser.psid}` : undefined}
                                            className={`transition-all ${isCurrentUser ? 'bg-blue-600/5 ring-1 ring-inset ring-blue-600/20 shadow-sm' : 'hover:bg-slate-50/80'} ${!isCurrentUser && displayRank <= 3 ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${displayRank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                                    displayRank === 2 ? 'bg-slate-100 text-slate-700' :
                                                        displayRank === 3 ? 'bg-amber-100 text-amber-700' :
                                                            'text-slate-400'
                                                    }`}>
                                                    {displayRank}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-bold text-sm capitalize ${isCurrentUser ? 'text-blue-700' : 'text-slate-800'}`}>{entry.name || 'Anonymous Student'}</span>
                                                        {isCurrentUser && <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">You</span>}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                                                        {"*******" + (entry.psid?.slice(-3) || "---")}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded ${isCurrentUser ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {entry.batch || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-bold text-slate-900">
                                                    {typeof entry.score === 'number' ? entry.score.toLocaleString() : entry.score}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex justify-end">
                                                    <TrendIcon trend={entry.trend} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-200 text-center">
                        <p className="text-xs font-semibold text-slate-400">
                            Viewing Top 100 Students • Updated Automatically
                        </p>
                    </div>
                </div>

                {/* Sticky My Rank Bar */}
                {currentUser && userGlobalEntry && (
                    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-md border-t border-blue-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-200">
                                    <User size={20} />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logged In As</p>
                                    <h4 className="text-sm font-bold text-slate-900 capitalize">{currentUser.name}</h4>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 sm:gap-12">
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Global Rank</p>
                                    <span className="text-lg font-black text-blue-600 tracking-tight">#{userGlobalEntry.rank}</span>
                                </div>
                                {selectedBatch !== 'All' && userGlobalEntry.batch === selectedBatch && (
                                    <div className="text-center border-l border-slate-200 pl-8 sm:pl-12">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Batch Rank ({selectedBatch})</p>
                                        <span className="text-lg font-black text-blue-600 tracking-tight">#{userBatchRank}</span>
                                    </div>
                                )}
                                <div className="text-center border-l border-slate-200 pl-8 sm:pl-12">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Score</p>
                                    <span className="text-lg font-black text-slate-900 tracking-tight">{userGlobalEntry.score}</span>
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
                    </div>
                )}
                {/* Spacer for sticky bar */}
                {currentUser && <div className="h-24"></div>}
            </main>
        </div>
    );
}
