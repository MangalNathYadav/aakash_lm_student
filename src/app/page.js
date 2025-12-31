"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                Precision Intelligence for <span className="text-blue-600">NEET Aspirants</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Unlock deep insights into your test performance. Our platform analyzes thousands of data points to identify your core strengths and critical weaknesses.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/login"
                  className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all flex items-center"
                >
                  Enter PSID to Start <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link href="/about" className="text-sm font-semibold leading-6 text-slate-900">
                  How it works <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Subtle Background Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 blur-3xl opacity-20 pointer-events-none">
            <div className="w-[800px] h-[400px] bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full" />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="bg-slate-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Chapter Mastery</h3>
                <p className="mt-4 text-slate-600">
                  See exactly which chapters in Physics, Chemistry, and Biology are solid and where you need focus.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="text-indigo-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Trend Analysis</h3>
                <p className="mt-4 text-slate-600">
                  Track your growth over time with stable, improving, and declining indicators across every test.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="text-emerald-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Private & Secure</h3>
                <p className="mt-4 text-slate-600">
                  Access your data securely with your unique PSID. We prioritize your privacy and data accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-2xl bg-slate-900 p-8 sm:p-12 text-center text-white overflow-hidden relative">
              <h2 className="text-3xl font-bold tracking-tight">Important Disclaimer</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
                Chapter-wise performance is estimated based on an equal distribution of marks across the test syllabus. This is an analytical estimate and may not reflect specific question-level weighting.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>© 2025 Student Performance Intelligence. Created by mghacker / thunderg0d.</p>
          <p className="mt-2 italic">Not affiliated with Aakash Institute. Usage for educational analytics only.</p>
        </div>
      </footer>
    </div>
  );
}
