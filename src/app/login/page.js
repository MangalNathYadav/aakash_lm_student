"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { User, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [psid, setPsid] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!psid.trim()) {
            setError('Please enter your PSID.');
            return;
        }

        setLoading(true);
        const result = await login(psid.trim());
        if (!result.success) {
            setError(result.error || 'Login failed. Please check your PSID.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Student Sign In</h2>
                            <p className="mt-2 text-slate-500 text-sm italic">Access your test results and performance analysis.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="psid" className="block text-sm font-bold text-slate-700 mb-2">
                                    Your PSID
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                    <input
                                        id="psid"
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                                        placeholder="Enter your PSID here"
                                        value={psid}
                                        onChange={(e) => setPsid(e.target.value)}
                                    />
                                </div>
                                <p className="mt-2 text-[10px] text-slate-400 italic">Example: 00003815468</p>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start text-red-700 text-xs font-semibold">
                                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all disabled:opacity-50 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                        Checking...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400">
                                This portal is for registered students only.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
