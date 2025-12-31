"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { BookOpen, CheckCircle, AlertTriangle, ChevronRight, Search } from 'lucide-react';

export default function AnalysisPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('physics');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading analysis...</div>;

    const subjects = user?.subjects || {};
    const currentSubject = subjects[activeTab] || { strong_chapters: [], average_chapters: [], weak_chapters: [] };

    const filterChapters = (list) => {
        if (!searchQuery) return list;
        return (list || []).filter(ch => ch.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 border-l-4 border-blue-600 pl-4">Subject Wise Analysis</h1>
                    <p className="text-slate-500 text-sm mt-1">Detailed breakdown of your strengths and weaknesses in each subject.</p>
                </div>

                {/* Subject Selector and Search */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                        {Object.keys(subjects).map((sub) => (
                            <button
                                key={sub}
                                onClick={() => setActiveTab(sub)}
                                className={`px-6 py-2 rounded-md text-sm font-semibold transition-all whitespace-nowrap capitalize ${activeTab === sub
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                                    }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>

                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search for a chapter..."
                            className="w-full bg-white pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Chapter Proficiency Index */}
                        <div className="space-y-6">
                            <h3 className="flex items-center text-sm font-bold text-slate-800 mb-3 px-1 uppercase tracking-wider">
                                <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                                Chapter Proficiency Index (1-10 Scale)
                            </h3>

                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                {(() => {
                                    // Use new chapters list or fallback to merging old lists
                                    let allChapters = currentSubject.chapters || [];
                                    if (allChapters.length === 0) {
                                        // Fallback if data structure is old
                                        const createStats = (list, rating, status) => (list || []).map(name => ({ name, rating, status }));
                                        allChapters = [
                                            ...createStats(currentSubject.weak_chapters, 3.5, 'Weak'),
                                            ...createStats(currentSubject.average_chapters, 6.5, 'Average'),
                                            ...createStats(currentSubject.strong_chapters, 9.0, 'Mastered')
                                        ];
                                    }

                                    const filtered = allChapters.filter(ch => ch.name.toLowerCase().includes(searchQuery.toLowerCase()));

                                    if (filtered.length === 0) {
                                        return <div className="p-12 text-center text-slate-400 text-sm italic">No chapters found matching your search.</div>;
                                    }

                                    return filtered.map((ch, idx) => {
                                        // Dynamic Color Logic
                                        let colorClass = "bg-red-500";
                                        let bgClass = "bg-red-50";
                                        let textClass = "text-red-700";

                                        if (ch.rating >= 8.0) {
                                            colorClass = "bg-emerald-500";
                                            bgClass = "bg-emerald-50";
                                            textClass = "text-emerald-700";
                                        } else if (ch.rating >= 5.0) {
                                            colorClass = "bg-amber-500";
                                            bgClass = "bg-amber-50";
                                            textClass = "text-amber-700";
                                        }

                                        return (
                                            <div key={idx} className="px-6 py-5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-slate-800 text-sm font-bold">{ch.name}</span>
                                                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${bgClass} ${textClass}`}>
                                                        {ch.status} • {ch.rating}/10
                                                    </div>
                                                </div>

                                                {/* Rating Bar */}
                                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${colorClass} transition-all duration-500 ease-out`}
                                                        style={{ width: `${(ch.rating / 10) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Quick Suggestions Panel */}
                    <div className="space-y-6">
                        <div className="bg-blue-600 p-8 rounded-2xl shadow-lg text-white">
                            <h3 className="text-lg font-bold mb-4 flex items-center">
                                Suggestions for {activeTab}
                            </h3>
                            <p className="text-blue-100 text-sm font-medium mb-6 leading-relaxed">
                                Based on your recent tests, focusing on these topics will give you the biggest score boost.
                            </p>
                            <div className="space-y-3">
                                <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                                    <p className="text-[10px] font-bold text-blue-200 uppercase mb-1">Primary Target</p>
                                    <p className="text-sm font-bold">{currentSubject.weak_chapters[0] || "Review Basics"}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-[10px] font-bold text-blue-300 uppercase mb-1">Secondary Target</p>
                                    <p className="text-sm font-bold">{currentSubject.weak_chapters[1] || "Practice Previous Year Questions"}</p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </main>
        </div>
    );
}
