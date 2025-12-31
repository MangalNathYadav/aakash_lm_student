"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, BarChart2, Trophy, Info, LogOut, Menu, X, User, Target } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

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

    const mobileLinkClasses = (href) =>
        `block px-3 py-2 text-base font-medium flex items-center transition-colors ${pathname === href ? "text-blue-600 font-bold" : "text-slate-600 hover:text-blue-600"
        }`;

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-blue-600">Evalyx Student Portal</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
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

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-500 hover:text-blue-600 p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 py-4 px-4 space-y-2">
                    {navLinks.map((link) => {
                        if (link.protected && !user) return null;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={mobileLinkClasses(link.href)}
                            >
                                <link.icon className="w-5 h-5 mr-3" />
                                {link.name}
                            </Link>
                        );
                    })}

                    {user ? (
                        <button
                            onClick={() => {
                                logout();
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-slate-50 rounded-md flex items-center"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 text-base font-bold text-blue-600"
                        >
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
