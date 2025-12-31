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

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading Analytics...</div>;

    const currentSubject = user.subjects[activeTab];

    const filterChapters = (list) => {
        if (!searchQuery) return list;
        return list.filter(ch => ch.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">Deep Subject Analysis</h1>
                    <p className="text-slate-600 mt-1">Granular breakdown of your chapter-level mastery</p>
                </div>

                {/* Search and Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
                        {Object.keys(user.subjects).map((sub) => (
                            <button
                                key={sub}
                                onClick={() => setActiveTab(sub)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap ${activeTab === sub
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>

                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search chapters..."
                            className="w-full bg-white pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main List */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Strong Section */}
                        <div>
                            <div className="flex items-center text-emerald-600 font-bold mb-4 uppercase tracking-wider text-xs px-2">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Strong Foundation ({currentSubject.strong_chapters.length})
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                                {filterChapters(currentSubject.strong_chapters).length > 0 ? (
                                    filterChapters(currentSubject.strong_chapters).map((ch, idx) => (
                                        <div key={idx} className="p-4 hover:bg-slate-50 flex items-center justify-between group transition-colors">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-4" />
                                                <span className="text-slate-700 font-medium">{ch}</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-sm italic">No chapters matching search in this category.</div>
                                )}
                            </div>
                        </div>

                        {/* Average Section */}
                        <div>
                            <div className="flex items-center text-blue-600 font-bold mb-4 uppercase tracking-wider text-xs px-2">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Working Knowledge ({currentSubject.average_chapters.length})
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                                {filterChapters(currentSubject.average_chapters).length > 0 ? (
                                    filterChapters(currentSubject.average_chapters).map((ch, idx) => (
                                        <div key={idx} className="p-4 hover:bg-slate-50 flex items-center justify-between group transition-colors">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-4" />
                                                <span className="text-slate-700 font-medium">{ch}</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-sm italic">No chapters matching search in this category.</div>
                                )}
                            </div>
                        </div>

                        {/* Weak Section */}
                        <div>
                            <div className="flex items-center text-red-600 font-bold mb-4 uppercase tracking-wider text-xs px-2">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Critical Focus Needed ({currentSubject.weak_chapters.length})
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                                {filterChapters(currentSubject.weak_chapters).length > 0 ? (
                                    filterChapters(currentSubject.weak_chapters).map((ch, idx) => (
                                        <div key={idx} className="p-4 hover:bg-slate-50 flex items-center justify-between group transition-colors">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 rounded-full bg-red-500 mr-4" />
                                                <span className="text-slate-700 font-medium">{ch}</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-sm italic">No chapters matching search in this category.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tips Panel */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 px-1">Study Strategy</h2>
                        <div className="bg-blue-600 p-8 rounded-3xl shadow-xl text-white">
                            <h3 className="text-lg font-bold mb-4 capitalize">{activeTab} Roadmap</h3>
                            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                                Based on your performance in {activeTab}, we recommend focusing on your top 3 weak chapters first. Review the concepts and attempt 50+ MCQs for each.
                            </p>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/10 rounded-2xl">
                                    <span className="block font-bold text-blue-200 text-xs mb-1 uppercase tracking-widest">Immediate Priority</span>
                                    <span className="text-sm font-medium">{currentSubject.weak_chapters[0] || "None - Good job!"}</span>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl">
                                    <span className="block font-bold text-blue-300/50 text-xs mb-1 uppercase tracking-widest">Next Target</span>
                                    <span className="text-sm font-medium">{currentSubject.weak_chapters[1] || "All Chapters Clear"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Pro Insight</h3>
                            <p className="text-slate-500 text-sm leading-relaxed italic">
                                "Consistency in {activeTab} is often tied to grasp of fundamental definitions. Re-read the NCERT summary for '{currentSubject.average_chapters[0] || 'your core topics'}' to convert Average results into Strong ones."
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
