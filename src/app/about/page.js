"use client";
import Navbar from '@/components/Navbar';
import { Shield, Database, Github, Terminal } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                            <Terminal className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Specification</h1>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <p className="text-xl text-slate-600 leading-relaxed mb-10">
                            Student Performance Intelligence (SPI) is a closed-loop analytics platform designed to transform raw Aakash test data into actionable academic biological/physical insights.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="p-6 bg-slate-50 rounded-3xl">
                                <Shield className="text-blue-600 w-6 h-6 mb-4" />
                                <h3 className="font-bold text-slate-900 mb-2">Non-Affiliation</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    This platform is an independent project and is NOT affiliated with, authorized, maintained, sponsored, or endorsed by Aakash Institute.
                                </p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-3xl">
                                <Database className="text-indigo-600 w-6 h-6 mb-4" />
                                <h3 className="font-bold text-slate-900 mb-2">Data Science</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    All analytics are precomputed using deterministic ranking rules and equal-distribution syllabic mapping.
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Development Team</h2>
                            <div className="flex items-center gap-6 p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-900/20">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                                    <Github className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold">mghacker / thunderg0d</h4>
                                    <p className="text-slate-400 text-sm">System Architect & Data Engineer</p>
                                </div>
                            </div>
                        </div>

                        <p className="mt-12 text-sm text-center text-slate-400 italic">
                            "For the students who want to clear the noise and focus on the data."
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
