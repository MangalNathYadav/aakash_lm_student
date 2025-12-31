"use client";
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import GraphSection from '@/components/GraphSection';
import AnalyticsCards from '@/components/AnalyticsCards';
import PredictionCard from '@/components/PredictionCard';
import { TrendingUp, TrendingDown, Minus, Target, Award, Calendar, ChevronRight } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${colorClass || 'bg-slate-100 text-slate-600'}`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium">{label}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    </div>
);

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading your profile...</div>;

    const { overall_performance = {}, meta = {}, subjects = {}, focus_insights = {} } = user;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Welcome Back, {user.name}</h1>
                    <p className="text-slate-500 text-sm">Here is your academic progress summary.</p>
                </div>

                {/* Score Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        label="Average Score"
                        value={overall_performance.average_total_score || 0}
                        icon={Award}
                        colorClass="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        label="Latest Score"
                        value={overall_performance.latest_score || 0}
                        icon={Target}
                        colorClass="bg-green-50 text-green-600"
                    />
                    <StatCard
                        label="Best Score"
                        value={overall_performance.best_score || 0}
                        icon={TrendingUp}
                        colorClass="bg-amber-50 text-amber-600"
                    />
                    <StatCard
                        label="Total Tests"
                        value={meta.tests_taken || 0}
                        icon={Calendar}
                        colorClass="bg-purple-50 text-purple-600"
                    />
                </div>


                {/* Analytics Section */}
                <AnalyticsCards psid={user.psid} />

                {/* Prediction Section */}
                <PredictionCard psid={user.psid} />

                {/* Graph Section */}
                <div className="mb-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <GraphSection psid={user.psid} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Subject Wise Performance */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-lg font-bold text-slate-800">Subject Wise Performance</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {Object.entries(subjects).map(([name, data]) => (
                                <div key={name} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-slate-900 capitalize">{name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-md font-semibold ${(data.average_percentage || 0) >= 75 ? 'bg-green-50 text-green-700' :
                                            (data.average_percentage || 0) >= 50 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                                            }`}>
                                            {data.average_percentage || 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full mb-4 overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all"
                                            style={{ width: `${data.average_percentage || 0}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Good: {(data.strong_chapters || []).length} Ch</span>
                                        <span>Weak: {(data.weak_chapters || []).length} Ch</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Improvement Areas */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-slate-800">Focus Areas</h2>
                        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Chapters to Improve</h3>
                            <div className="space-y-4">
                                {(focus_insights?.top_weak_chapters || []).length > 0 ? (
                                    focus_insights.top_weak_chapters.map((ch, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs font-bold text-slate-400">
                                                {idx + 1}
                                            </div>
                                            <span className="text-sm text-slate-300 line-clamp-1">{ch}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-sm italic">All caught up! Keep it up.</p>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Recently Improved</h3>
                                <div className="space-y-3">
                                    {(focus_insights?.most_improved_chapters || []).length > 0 ? (
                                        focus_insights.most_improved_chapters.slice(0, 3).map((ch, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-green-400">
                                                <TrendingUp size={14} />
                                                <span className="text-sm text-slate-300 line-clamp-1">{ch}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 text-sm italic">Keep practicing to see updates.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800">
                            <p className="text-xs font-bold mb-1">💡 Study Tip</p>
                            <p className="text-sm">
                                Review '{(focus_insights?.top_weak_chapters || [])[0] || 'your mistakes'}' before your next mock test.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
