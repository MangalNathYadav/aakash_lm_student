"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { KeyRound, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [psid, setPsid] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!psid.trim()) {
            setError('Please enter your unique PSID.');
            return;
        }

        setLoading(true);
        const result = await login(psid.trim());
        if (!result.success) {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                <Lock className="text-blue-600 w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
                            <p className="mt-2 text-slate-600">Enter your PSID assigned to you for test results</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="psid" className="block text-sm font-medium text-slate-700 mb-2">
                                    PSID Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyRound className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="psid"
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                        placeholder="e.g. 00010239673"
                                        value={psid}
                                        onChange={(e) => setPsid(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start">
                                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                        Authenticating...
                                    </>
                                ) : (
                                    'Access Analytics'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-xs text-center text-slate-500 italic">
                                No password required. Your PSID is your identity key.
                                Keep it secure to protect your academic data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
