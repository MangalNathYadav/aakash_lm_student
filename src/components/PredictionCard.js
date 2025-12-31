"use client";
import { useEffect, useState } from 'react';
import { Target, TrendingUp, AlertTriangle, ShieldCheck, ChevronRight, Activity, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PredictionCard({ psid }) {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!psid) return;
        fetch(`/api/students/${psid}/prediction.json`)
            .then(res => res.json())
            .then(data => setPrediction(data))
            .catch(err => console.error("Prediction fetch error", err))
            .finally(() => setLoading(false));
    }, [psid]);

    if (loading) return null;
    if (!prediction) return null;

    const { predicted_score_range, confidence_level, prediction_explainability, disclaimer } = prediction;
    const { reasoning, subject_contribution, range_narrowing, stability } = prediction_explainability || {};

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl overflow-hidden text-white border border-slate-700 relative mb-8"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

            <div className="p-5 md:p-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-xl font-bold flex items-center text-blue-200">
                            <Target className="mr-3 text-blue-400" />
                            AI Performance Prediction
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">Based on your recent test trends and consistency.</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        className="flex items-center gap-3"
                    >
                        <div className="text-right">
                            <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">{predicted_score_range}</div>
                            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Score Range</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${confidence_level === 'High' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                            confidence_level === 'Medium' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' :
                                'bg-red-500/20 border-red-500/50 text-red-400'
                            }`}>
                            {confidence_level} Conf.
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

                    {/* Insights & Reasoning */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Prediction Reasoning</h3>
                            <ul className="space-y-3">
                                {reasoning && reasoning.map((point, idx) => (
                                    <li key={idx} className="flex items-start text-sm text-slate-300">
                                        <ChevronRight size={16} className="mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {stability && (
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                                    <Activity size={14} className="mr-2" /> Stability Analysis
                                </h4>
                                <div className="text-sm text-slate-300">
                                    <span className={`font-bold capitalize ${stability.level === 'stable' ? 'text-green-400' : 'text-amber-400'}`}>
                                        {stability.level.replace('_', ' ')}:
                                    </span> {stability.explanation}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Contributing Factors & Future */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Subject Contribution</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {subject_contribution && Object.entries(subject_contribution).map(([subject, status], i) => (
                                    <motion.div
                                        key={subject}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 + (i * 0.1) }}
                                        className="flex items-center justify-between p-3 bg-slate-800/80 rounded-lg border border-slate-700/50"
                                    >
                                        <span className="capitalize text-sm font-medium text-slate-300">{subject}</span>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${status === 'boosting' ? 'bg-green-500/10 text-green-400' :
                                            status === 'limiting' ? 'bg-red-500/10 text-red-400' :
                                                'bg-slate-600/10 text-slate-500'
                                            }`}>
                                            {status}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {range_narrowing && (
                            <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center">
                                    <ShieldCheck size={14} className="mr-2" /> Potential Narrowing
                                </h4>
                                <p className="text-xs text-blue-200 mb-2 leading-relaxed">
                                    {range_narrowing.condition}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold text-blue-100">
                                    Range could tighten to:
                                    <span className="text-white bg-blue-600/20 px-2 py-0.5 rounded border border-blue-500/30">
                                        {range_narrowing.future_range.min} - {range_narrowing.future_range.max}
                                    </span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-700/50">
                    <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <AlertTriangle size={12} /> {disclaimer}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
