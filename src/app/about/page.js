"use client";
import Navbar from '@/components/Navbar';
import { Shield, Book, Users, HelpCircle, Mail } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-slate-900 mb-4">About the Student Portal</h1>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            The Evalyx Student Portal is a platform designed to help students track their preparation journey for competitive exams like NEET.
                        </p>
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center border-b pb-2">
                                <Book className="mr-3 text-blue-600" /> Our Purpose
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                We believe that meaningful data can help students improve faster. By analyzing test results at a chapter level, we identify exactly which topics you need to study more to increase your final score.
                            </p>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
                                    <Shield className="mr-2 text-green-600" size={20} /> Data Privacy
                                </h3>
                                <p className="text-xs text-slate-600 leading-loose">
                                    Your data is private. You can only access your own profile using your unique PSID. We do not share your individual scores with anyone except your assigned mentors.
                                </p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
                                    <Users className="mr-2 text-blue-500" size={20} /> Peer Ranking
                                </h3>
                                <p className="text-xs text-slate-600 leading-loose">
                                    The leaderboard helps you understand where you stand in a healthy competitive environment. It shows only the top 100 students to encourage everyone to strive for improvement.
                                </p>
                            </div>
                        </section>

                        <section className="bg-blue-600 p-8 rounded-xl text-white">
                            <h2 className="text-xl font-bold mb-4 flex items-center tracking-tight">
                                <Mail className="mr-3" /> Need Support?
                            </h2>
                            <p className="text-blue-100 text-sm mb-6 font-medium">
                                If you have any issues with your PSID or notice any incorrect test marks, please reach out to the administration desk.
                            </p>
                            <div className="text-xs font-bold text-blue-200 uppercase tracking-widest">
                                Contact: mangalnath123k@gmail.com
                            </div>
                        </section>
                    </div>

                    {/* Analytics Guide Section */}
                    <section className="bg-slate-900 p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-8 flex items-center text-white">
                                <HelpCircle className="mr-3 text-blue-400" /> Guide to Analytics
                            </h2>

                            <div className="space-y-12">
                                {/* CPI Section */}
                                <div>
                                    <div className="flex items-center mb-4">
                                        <div className="w-1 h-6 bg-blue-500 rounded mr-3"></div>
                                        <h3 className="text-sm font-bold text-blue-200 uppercase tracking-widest">Chapter Proficiency Index (CPI)</h3>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                        A precise 1-10 scale measuring your command over specific chapters, calculated using a weighted average of your test accuracy and question difficulty.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                            <div className="text-emerald-400 font-bold text-xl mb-1">8.0 - 10.0</div>
                                            <div className="text-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-2 opacity-80">Mastered</div>
                                            <p className="text-emerald-100/60 text-[10px] leading-relaxed">Exceptional command with minimal errors. Maintain revision.</p>
                                        </div>
                                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                            <div className="text-amber-400 font-bold text-xl mb-1">5.0 - 7.9</div>
                                            <div className="text-amber-200 text-[10px] font-bold uppercase tracking-wider mb-2 opacity-80">Needs Practice</div>
                                            <p className="text-amber-100/60 text-[10px] leading-relaxed">Good conceptual base but prone to errors in complex problems.</p>
                                        </div>
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                            <div className="text-red-400 font-bold text-xl mb-1">0.0 - 4.9</div>
                                            <div className="text-red-200 text-[10px] font-bold uppercase tracking-wider mb-2 opacity-80">Critical Attention</div>
                                            <p className="text-red-100/60 text-[10px] leading-relaxed">Significant gaps. Requires immediate re-learning of core concepts.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Consistency Section */}
                                    <div>
                                        <div className="flex items-center mb-3">
                                            <div className="w-1 h-6 bg-purple-500 rounded mr-3"></div>
                                            <h3 className="text-sm font-bold text-purple-200 uppercase tracking-widest">Consistency Index</h3>
                                        </div>
                                        <p className="text-slate-400 text-xs leading-relaxed mb-4">
                                            Measures the stability of your performance over the last 2 tests. Stability is key to predictable results in final exams.
                                        </p>
                                        <ul className="space-y-2 text-xs text-slate-300">
                                            <li className="flex items-start"><span className="text-green-400 mr-2">●</span> <strong>High:</strong> Variance &lt; 10%. Highly predictable performance.</li>
                                            <li className="flex items-start"><span className="text-amber-400 mr-2">●</span> <strong>Medium:</strong> Variance 10-20% or recent drop.</li>
                                            <li className="flex items-start"><span className="text-red-400 mr-2">●</span> <strong>Low:</strong> Variance &gt; 20% or sharp decline.</li>
                                        </ul>
                                    </div>

                                    {/* Readiness Section */}
                                    <div>
                                        <div className="flex items-center mb-3">
                                            <div className="w-1 h-6 bg-teal-500 rounded mr-3"></div>
                                            <h3 className="text-sm font-bold text-teal-200 uppercase tracking-widest">Exam Readiness</h3>
                                        </div>
                                        <p className="text-slate-400 text-xs leading-relaxed mb-4">
                                            An AI estimate of your preparedness based on your trajectory (Trend) and stability (Consistency).
                                        </p>
                                        <ul className="space-y-2 text-xs text-slate-300">
                                            <li className="flex items-start"><span className="text-teal-400 mr-2">●</span> <strong>Ready:</strong> Improving trend + High consistency.</li>
                                            <li className="flex items-start"><span className="text-amber-400 mr-2">●</span> <strong>Moderate:</strong> Stable but flat trend.</li>
                                            <li className="flex items-start"><span className="text-red-400 mr-2">●</span> <strong>Needs Work:</strong> Declining trend or low consistency.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tech Stack & Credits */}
                    <section className="mt-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                                <Users className="mr-3 text-indigo-600" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                    Engineering & Credits
                                </span>
                            </h2>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Core Technology</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Next.js 14', 'React', 'Tailwind CSS', 'Python 3.11', 'Chart.js', 'Firebase', 'Vercel'].map((tech) => (
                                            <span key={tech} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="mt-6 text-sm text-slate-600 leading-relaxed">
                                        The <strong>Evalyx Engine</strong> (Python) processes raw test data to generate high-precision analytics, which are then visualized by the <strong>Next.js</strong> frontend.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Credits</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs mr-3">
                                                MH
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">mghacker (Thunderg0d)</div>
                                                <div className="text-xs text-slate-500">Lead Developer & Concept</div>
                                            </div>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xs mr-3">
                                                AI
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">Antigravity (Google DeepMind)</div>
                                                <div className="text-xs text-slate-500">Agentic Co-Pilot & Implementation</div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="mt-16 text-center border-t pt-8">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Built for Academic Excellence
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
