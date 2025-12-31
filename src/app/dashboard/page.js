"use client";
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { TrendingUp, TrendingDown, Minus, Target, Award, ListChecks, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TrendBadge = ({ trend }) => {
    const configs = {
        improving: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100', text: 'Improving' },
        declining: { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-100', text: 'Declining' },
        stable: { icon: Minus, color: 'text-blue-600', bg: 'bg-blue-100', text: 'Stable' },
        insufficient_data: { icon: Minus, color: 'text-slate-600', bg: 'bg-slate-100', text: 'No Data' },
    };
    const config = configs[trend] || configs.insufficient_data;
    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.color}`}>
            <Icon className="w-3 h-3 mr-1.5" />
            {config.text}
        </div>
    );
};

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading Performance...</div>;

    const { overall_performance, meta, subjects, focus_insights } = user;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Welcome Back, {user.name}</h1>
                        <p className="text-slate-600 mt-1">PSID: {user.psid} • Latest Update: {meta.latest_test_date}</p>
                    </div>
                    <div className="flex gap-4">
                        <TrendBadge trend={overall_performance.trend} />
                    </div>
                </div>

                {/* Top Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center text-slate-500 mb-2">
                            <Award className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium uppercase tracking-wider">Average Score</span>
                        </div>
                        <div className="text-3xl font-extrabold text-slate-900">{overall_performance.average_total_score}</div>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center text-slate-500 mb-2">
                            <Target className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium uppercase tracking-wider">Latest Score</span>
                        </div>
                        <div className="text-3xl font-extrabold text-blue-600">{overall_performance.latest_score}</div>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center text-slate-500 mb-2">
                            <ArrowUpRight className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium uppercase tracking-wider">Best Performance</span>
                        </div>
                        <div className="text-3xl font-extrabold text-emerald-600">{overall_performance.best_score}</div>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center text-slate-500 mb-2">
                            <ListChecks className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium uppercase tracking-wider">Tests Taken</span>
                        </div>
                        <div className="text-3xl font-extrabold text-indigo-600">{meta.tests_taken}</div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Subject Overview List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 px-1">Subject Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {Object.entries(subjects).map(([name, data]) => (
                                <div key={name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold capitalize text-slate-900">{name}</h3>
                                        <TrendBadge trend={data.trend} />
                                    </div>
                                    <div>
                                        <div className="text-4xl font-black text-slate-900 mb-2">{data.average_percentage}%</div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${data.average_percentage >= 75 ? 'bg-emerald-500' :
                                                        data.average_percentage >= 50 ? 'bg-blue-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${data.average_percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-between items-center text-xs font-bold text-slate-400">
                                        <span>{data.strong_chapters.length} STRONG</span>
                                        <span>{data.weak_chapters.length} WEAK</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Focus Insights Panel */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 px-1">Focus Analytics</h2>
                        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white">
                            <h3 className="text-lg font-bold mb-6 flex items-center">
                                <Target className="w-5 h-5 mr-3 text-red-500" />
                                Attention Required
                            </h3>
                            <div className="space-y-4">
                                {focus_insights.top_weak_chapters.length > 0 ? (
                                    focus_insights.top_weak_chapters.map((ch, idx) => (
                                        <div key={idx} className="flex items-start gap-4 group">
                                            <div className="w-6 h-6 rounded-lg bg-slate-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                {idx + 1}
                                            </div>
                                            <span className="text-sm text-slate-300 font-medium leading-tight">{ch}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-sm italic">Great work! No significant weak chapters identified.</p>
                                )}
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-800">
                                <h3 className="text-lg font-bold mb-6 flex items-center">
                                    <Award className="w-5 h-5 mr-3 text-emerald-500" />
                                    Most Improved
                                </h3>
                                <div className="space-y-4">
                                    {focus_insights.most_improved_chapters.length > 0 ? (
                                        focus_insights.most_improved_chapters.slice(0, 3).map((ch, idx) => (
                                            <div key={idx} className="flex items-start gap-4">
                                                <TrendingUp className="w-4 h-4 text-emerald-500 mt-1" />
                                                <span className="text-sm text-slate-300 font-medium leading-tight">{ch}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-400 text-sm italic">Keep testing to build trend data.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
