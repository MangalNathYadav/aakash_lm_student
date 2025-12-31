"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ChevronRight, CheckCircle2, BookOpen, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        {/* Simple Hero */}
        <div className="bg-white border-b border-slate-200 py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
              Track Your Test Performance Easily
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              A simple platform for students to check their scores, view rank history, and identify subjects that need more focus.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/login"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Sign In with PSID
              </Link>
              <Link
                href="/leaderboard"
                className="bg-white text-slate-700 border border-slate-300 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-50 transition-colors"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>

        {/* Standard Features Section */}
        <div className="py-20 px-6 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-12">Portal Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Subject Wise Analysis</h3>
              <p className="text-slate-600">See your score breakdown for Physics, Chemistry, and Biology across all tests.</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Trophy className="text-green-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Student Rankings</h3>
              <p className="text-slate-600">Track your standing among other students with our public and private leaderboards.</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle2 className="text-orange-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Target Weak Areas</h3>
              <p className="text-slate-600">Automatically identify which chapters you are struggling with and improve your score.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="font-bold text-xl mb-1">Evalyx Portal</p>
            <p className="text-slate-400 text-sm">© 2026 Evalyx</p>
          </div>
          <div className="flex gap-8 text-sm">
            <Link href="/about" className="hover:text-blue-400">About Us</Link>
            <Link href="/leaderboard" className="hover:text-blue-400">Public Rank</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
