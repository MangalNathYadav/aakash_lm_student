"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ChevronRight, CheckCircle2, BookOpen, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        {/* Simple Hero */}
        <div className="bg-white border-b border-slate-200 py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
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
          </motion.div>
        </div>

        {/* Standard Features Section */}
        <div className="py-20 px-6 max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center text-slate-800 mb-12"
          >
            Portal Features
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: BookOpen, color: "blue", title: "Subject Wise Analysis", desc: "See your score breakdown for Physics, Chemistry, and Biology across all tests." },
              { icon: Trophy, color: "green", title: "Student Rankings", desc: "Track your standing among other students with our public and private leaderboards." },
              { icon: CheckCircle2, color: "orange", title: "Target Weak Areas", desc: "Automatically identify which chapters you are struggling with and improve your score." },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
                }}
                className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`bg-${feature.color}-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon className={`text-${feature.color}-600 w-6 h-6`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
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
