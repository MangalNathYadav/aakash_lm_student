"use client";
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PredictionCard from '@/components/PredictionCard';

export default function PredictionsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading prediction...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">AI Performance Prediction</h1>
                    <p className="text-slate-500 text-sm">Detailed analysis and future score projections.</p>
                </div>

                <PredictionCard psid={user.psid} />
            </main>
        </div>
    );
}
