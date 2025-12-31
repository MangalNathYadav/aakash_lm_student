"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Trophy, Medal, Star, Filter, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TrendIcon = ({ trend }) => {
    if (trend === 'improving') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
    if (trend === 'declining') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-slate-300" />;
};

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeBoard, setActiveBoard] = useState('latest_scores');

    const boards = [
        { id: 'latest_scores', name: 'Latest Test', icon: Medal },
        { id: 'overall_average', name: 'Cumulative Rank', icon: Trophy },
        { id: 'consistency_index', name: 'Most Consistent', icon: Star },
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

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Academic Leaderboard</h1>
                    <p className="text-slate-600 mt-2">Celebrating excellence and consistency across the foundation.</p>
                </div>

                {/* Board Selection Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                    {boards.map((board) => (
                        <button
                            key={board.id}
                            onClick={() => setActiveBoard(board.id)}
                            className={`flex items-center px-6 py-3 rounded-2xl text-sm font-bold transition-all ${activeBoard === board.id
                                ? 'bg-slate-900 text-white shadow-xl scale-105'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-600'
                                }`}
                        >
                            <board.icon className={`w-4 h-4 mr-2 ${activeBoard === board.id ? 'text-blue-400' : 'text-slate-400'}`} />
                            {board.name}
                        </button>
                    ))}
                </div>

                {/* Leaderboard Table */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="py-5 px-8 text-xs font-black uppercase tracking-widest text-slate-400">Rank</th>
                                    <th className="py-5 px-8 text-xs font-black uppercase tracking-widest text-slate-400">Student Name</th>
                                    <th className="py-5 px-8 text-xs font-black uppercase tracking-widest text-slate-400">Identity</th>
                                    <th className="py-5 px-8 text-xs font-black uppercase tracking-widest text-slate-400">Score / Index</th>
                                    <th className="py-5 px-8 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {leaderboard?.entries.slice(0, 100).map((entry, idx) => (
                                    <tr key={idx} className={`hover:bg-slate-50 transition-colors ${idx < 3 ? 'bg-blue-50/30' : ''}`}>
                                        <td className="py-5 px-8">
                                            <div className="flex items-center">
                                                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-black ${idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    idx === 1 ? 'bg-slate-200 text-slate-700' :
                                                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                                                            'text-slate-400'
                                                    }`}>
                                                    {entry.rank}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="font-bold text-slate-900">{entry.name || 'Anonymous Student'}</div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 mr-3">
                                                    {entry.psid.slice(-2)}
                                                </div>
                                                <span className="font-medium text-slate-500 font-mono text-xs">{entry.psid}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 font-black text-slate-900 text-lg">
                                            {entry.score}
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                                                <TrendIcon trend={entry.trend} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500 flex items-center justify-center">
                            <Trophy className="w-4 h-4 mr-2 text-blue-500" />
                            Showing top 100 students based on overall academic performance.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
