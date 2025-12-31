"use client";
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, CheckCircle, AlertTriangle, HelpCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';

export default function AnalyticsCards({ psid }) {
    const [delta, setDelta] = useState(null);
    const [consistency, setConsistency] = useState(null);
    const [readiness, setReadiness] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!psid) return;

        const fetchData = async () => {
            try {
                const [dRes, cRes, rRes] = await Promise.all([
                    fetch(`/api/students/${psid}/graphs/progress_delta.json`),
                    fetch(`/api/students/${psid}/analysis/consistency.json`),
                    fetch(`/api/students/${psid}/analysis/readiness.json`)
                ]);

                if (dRes.ok) setDelta(await dRes.json());
                if (cRes.ok) setConsistency(await cRes.json());
                if (rRes.ok) setReadiness(await rRes.json());
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [psid]);

    if (loading) return null; // Silent load
    if (!delta && !consistency && !readiness) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Progress Delta */}
            {delta && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 bg-blue-500/5 rounded-full -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-sm font-bold text-slate-700">Recent Progress</h3>
                                <p className="text-[10px] text-slate-400">vs Last 3 Tests Avg</p>
                            </div>
                            <div className={`p-2 rounded-lg ${delta.total_score_delta > 0 ? 'bg-green-100 text-green-600' : delta.total_score_delta < 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                {delta.total_score_delta > 0 ? <TrendingUp size={18} /> : delta.total_score_delta < 0 ? <TrendingDown size={18} /> : <Minus size={18} />}
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="text-3xl font-bold text-slate-900 flex items-end gap-2">
                                {delta.total_score_delta > 0 ? '+' : ''}{delta.total_score_delta}
                                <span className="text-xs font-semibold text-slate-400 mb-1">marks</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                {delta.total_score_delta > 0 ? 'You are improving! Keep it up.' : 'Slight dip recently. Review weak areas.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Consistency */}
            {consistency && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 bg-purple-500/5 rounded-full -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-sm font-bold text-slate-700">Consistency</h3>
                                <p className="text-[10px] text-slate-400">Based on last 2 tests</p>
                            </div>
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                <Activity size={18} />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className={`text-2xl font-bold capitalize ${consistency.consistency_level === 'high' ? 'text-green-600' :
                                consistency.consistency_level === 'medium' ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                {consistency.consistency_level}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-snug">
                                {consistency.interpretation}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Readiness */}
            {readiness && (
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 p-16 bg-teal-500/10 rounded-full -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-sm font-bold text-blue-300">Exam Readiness</h3>
                                <p className="text-[10px] text-slate-400">Estimated status</p>
                            </div>
                            <div className={`p-2 rounded-lg ${readiness.readiness_level === 'ready' ? 'bg-teal-500/20 text-teal-400' : 'bg-red-500/20 text-red-400'}`}>
                                {readiness.readiness_level === 'ready' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-2">
                                <div className="text-2xl font-bold capitalize tracking-wide">
                                    {readiness.readiness_level.replace('_', ' ')}
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${readiness.confidence === 'high' ? 'border-green-500/50 text-green-400' : 'border-amber-500/50 text-amber-400'
                                    }`}>
                                    {readiness.confidence} Conf.
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                {readiness.reasoning}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
