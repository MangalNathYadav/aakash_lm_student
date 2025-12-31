"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, User, BarChart2, Trophy, Info, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, protected: true },
        { name: 'Analysis', href: '/analysis', icon: BarChart2, protected: true },
        { name: 'Leaderboard', href: '/leaderboard', icon: Trophy, protected: false },
        { name: 'About', href: '/about', icon: Info, protected: false },
    ];

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                SPI Analytics
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navLinks.map((link) => {
                            if (link.protected && !user) return null;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 flex items-center transition-colors"
                                >
                                    <link.icon className="w-4 h-4 mr-2" />
                                    {link.name}
                                </Link>
                            );
                        })}
                        {user ? (
                            <button
                                onClick={logout}
                                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 flex items-center transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 py-2">
                    {navLinks.map((link) => {
                        if (link.protected && !user) return null;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 flex items-center"
                            >
                                <link.icon className="w-5 h-5 mr-3" />
                                {link.name}
                            </Link>
                        );
                    })}
                    {user ? (
                        <button
                            onClick={() => { logout(); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2 text-base font-medium text-slate-600 hover:text-red-600 hover:bg-slate-50 flex items-center"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-base font-medium text-blue-600 font-bold"
                        >
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
