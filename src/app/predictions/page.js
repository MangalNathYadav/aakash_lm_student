"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { BrainCircuit, Sparkles, ShieldAlert, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PredictionPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            fetch(`/api/students/${user.psid}/prediction.json`)
                .then(res => res.json())
                .then(data => setPrediction(data))
                .catch(err => console.error("Failed to load predictions", err));
        }
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Analyzing Potential...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-3xl mb-6 shadow-indigo-100 shadow-2xl">
                        <BrainCircuit className="text-indigo-600 w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900">Score Projection AI</h1>
                    <p className="text-slate-600 mt-4 max-w-xl mx-auto">
                        Our neural model estimates your future performance based on velocity, consistency, and chapter mastery trends.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6">
                            <Sparkles className="text-indigo-200 w-8 h-8" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-500 mb-8">Estimated NEET Range</h2>
                        <div className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">
                            {prediction?.predicted_score_range || '...'}
                        </div>
                        <p className="text-slate-500 font-medium">Confidence Level: <span className="text-indigo-600 font-bold">{prediction?.confidence_level}</span></p>

                        <div className="mt-12 pt-8 border-t border-slate-100">
                            <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-2xl">
                                <Info className="text-indigo-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                                    This range represents the most likely score based on current growth velocity. Consistency is the primary factor for narrowing this range.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col justify-center space-y-8"
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">How it works</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                We use an <strong>exponentially weighted moving average</strong> of your last 5 tests. If your recent scores are higher than your average, the model projects an upward trajectory. If consistency (index) is high, the prediction window narrows.
                            </p>
                        </div>

                        <div className="p-8 bg-red-50 border border-red-100 rounded-3xl">
                            <div className="flex items-center gap-3 text-red-600 mb-3">
                                <ShieldAlert className="w-5 h-5" />
                                <h3 className="font-bold">Disclaimer</h3>
                            </div>
                            <p className="text-xs text-red-900/70 leading-relaxed italic">
                                {prediction?.disclaimer}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
