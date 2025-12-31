"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, BarChart2, Trophy, Info, LogOut, User, Target, HelpCircle, Send, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase";
import { ref, push } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [helpData, setHelpData] = useState({ subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, protected: true },
        { name: "Analysis", href: "/analysis", icon: BarChart2, protected: true },
        { name: "Prediction", href: "/predictions", icon: Target, protected: true },
        { name: "Leaderboard", href: "/leaderboard", icon: Trophy, protected: false },
        { name: "About", href: "/about", icon: Info, protected: false },
    ];

    const linkClasses = (href) =>
        `text-sm font-medium flex items-center transition-colors ${pathname === href ? "text-blue-600 font-bold" : "text-slate-600 hover:text-blue-600"
        }`;

    const bottomNavClasses = (href) =>
        `flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === href ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
        }`;

    const handleHelpSubmit = async (e) => {
        e.preventDefault();
        if (!helpData.message.trim()) return;

        setIsSubmitting(true);
        try {
            await push(ref(db, 'help_requests'), {
                psid: user?.psid || 'anonymous',
                name: user?.name || 'Anonymous',
                subject: helpData.subject || 'General Inquiry',
                message: helpData.message,
                timestamp: Date.now(),
                status: 'pending'
            });
            setHelpData({ subject: '', message: '' });
            setIsHelpOpen(false);
            alert('Help request submitted successfully!');
        } catch (error) {
            console.error("Error submitting help request:", error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-bold text-blue-600">Evalyx</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map((link) => {
                                if (link.protected && !user) return null;
                                return (
                                    <Link key={link.name} href={link.href} className={linkClasses(link.href)}>
                                        <link.icon className="w-4 h-4 mr-1.5" />
                                        {link.name}
                                    </Link>
                                );
                            })}

                            <button
                                onClick={() => setIsHelpOpen(true)}
                                className="text-slate-500 hover:text-blue-600 transition-colors"
                                title="Get Help"
                            >
                                <HelpCircle className="w-5 h-5" />
                            </button>

                            {user ? (
                                <div className="flex items-center space-x-4 border-l pl-6 border-slate-200">
                                    <Link href="/profile" className="text-right hover:opacity-80 transition-opacity cursor-pointer">
                                        <p className="text-xs font-semibold text-slate-900 line-clamp-1 hover:text-blue-600 transition-colors">{user.name}</p>
                                        <p className="text-[10px] text-slate-500 font-mono">PSID: {user.psid}</p>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile Top Bar Actions */}
                        <div className="md:hidden flex items-center space-x-4">
                            <button
                                onClick={() => setIsHelpOpen(true)}
                                className="p-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                            >
                                <Info className="w-5 h-5" />
                            </button>
                            {user && (
                                <Link href="/profile" className="p-2 text-slate-500 hover:text-blue-600">
                                    <User className="w-5 h-5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {navLinks.map((link) => {
                        if (link.protected && !user) return null;
                        return (
                            <Link key={link.name} href={link.href} className={bottomNavClasses(link.href)}>
                                <link.icon className={`w-5 h-5 ${pathname === link.href ? 'fill-current' : ''}`} />
                                <span className="text-[10px] font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Help Modal */}
            <AnimatePresence>
                {isHelpOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                                <h3 className="font-bold text-lg flex items-center">
                                    <HelpCircle className="w-5 h-5 mr-2" /> Help & Support
                                </h3>
                                <button onClick={() => setIsHelpOpen(false)} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleHelpSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                                    <select
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={helpData.subject}
                                        onChange={(e) => setHelpData({ ...helpData, subject: e.target.value })}
                                    >
                                        <option value="">Select a topic...</option>
                                        <option value="Data Correction">Incorrect Marks / Subject Data</option>
                                        <option value="Technical Issue">App / Login Issues</option>
                                        <option value="Feedback">Suggestions & Feedback</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
                                    <textarea
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Describe your issue or feedback here..."
                                        value={helpData.message}
                                        onChange={(e) => setHelpData({ ...helpData, message: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Sending...' : (
                                        <>
                                            Submit Request <Send className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
