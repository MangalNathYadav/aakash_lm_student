"use client";
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PredictionCard from '@/components/PredictionCard';
import { motion } from 'framer-motion';

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
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
                <div className="mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl font-bold text-slate-900"
                    >
                        AI Performance Prediction
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-sm"
                    >
                        Detailed analysis and future score projections.
                    </motion.p>
                </div>

                <PredictionCard psid={user.psid} />
            </motion.main>
        </div>
    );
}
