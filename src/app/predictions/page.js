"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Sparkles, AlertTriangle, Lightbulb, Info } from 'lucide-react';

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
                .catch(err => console.error("Failed to load prediction data", err));
        }
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading prediction...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Likely NEET Score Range</h1>
                    <p className="text-slate-500 text-sm italic underline">Based on your recent mock test performance patterns.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Prediction Card */}
                    <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-xl text-center flex flex-col items-center justify-center">
                        <h2 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-6">Predicted Score</h2>
                        <div className="text-6xl font-black text-blue-600 mb-6 tracking-tight">
                            {prediction?.predicted_score_range || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-bold">
                            <Sparkles size={14} /> Confidence: {prediction?.confidence_level || 'Normal'}
                        </div>

                        <div className="mt-10 p-5 bg-blue-50 rounded-xl border border-blue-100 text-left">
                            <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                This score is estimated by looking at your last 5-10 tests. Taking more tests and improving your weak chapters will help narrow this range.
                            </p>
                        </div>
                    </div>

                    {/* How it works / Disclaimer */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Lightbulb className="text-amber-500" size={20} />
                                How to improve this?
                            </h3>
                            <ul className="space-y-4">
                                <li className="text-sm text-slate-600 flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                    Focus on chapters marked as "Weak" in your performance analysis.
                                </li>
                                <li className="text-sm text-slate-600 flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                    Review your silly mistakes in Chemistry and Physics formulas.
                                </li>
                                <li className="text-sm text-slate-600 flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                    Aim for consistency—try not to let your score fluctuate too much.
                                </li>
                            </ul>
                        </div>

                        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-start gap-4">
                            <AlertTriangle className="text-orange-600 w-5 h-5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-orange-800 mb-1">Disclaimer</h4>
                                <p className="text-xs text-orange-700 leading-relaxed italic">
                                    This prediction is only a mathematical estimate. Your actual NEET result depends on many factors including the difficulty of the final paper.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
