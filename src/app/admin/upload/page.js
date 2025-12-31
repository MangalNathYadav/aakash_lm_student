"use client";
import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function AdminUploadPage() {
    const [file, setFile] = useState(null);
    const [metadata, setMetadata] = useState({
        test_id: '',
        test_type: 'FT',
        test_date: '',
        max_marks: 720
    });
    const [status, setStatus] = useState('idle'); // idle, uploading, processing, success, error
    const [logs, setLogs] = useState([]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !metadata.test_id || !metadata.test_date) return;

        setStatus('uploading');
        setLogs([]);

        const formData = new FormData();
        formData.append('pdf_file', file);
        formData.append('test_id', metadata.test_id);
        formData.append('test_type', metadata.test_type);
        formData.append('test_date', metadata.test_date);
        formData.append('max_marks', metadata.max_marks);

        try {
            const res = await fetch('/api/admin/ingest', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setStatus('success');
            setLogs(data.logs || []);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setLogs([`Error: ${err.message}`]);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                        <Upload className="mr-3 text-blue-600" /> Admin Data Ingestion
                    </h1>
                    <p className="text-slate-500 text-sm">Upload result PDFs to automatically update student records.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upload Form */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Upload Configuration</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Test Type</label>
                                <select
                                    className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                                    value={metadata.test_type}
                                    onChange={(e) => setMetadata({ ...metadata, test_type: e.target.value })}
                                >
                                    <option value="FT">Fortnightly Test (FT)</option>
                                    <option value="NBTS">NCERT Booster (NBTS)</option>
                                    <option value="AIATS">AIATS</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Test ID (Unique)</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-slate-300 rounded-lg text-sm font-mono"
                                    placeholder="e.g. FT_08_2025"
                                    value={metadata.test_id}
                                    onChange={(e) => setMetadata({ ...metadata, test_id: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Test Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                                    value={metadata.test_date}
                                    onChange={(e) => setMetadata({ ...metadata, test_date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Result PDF</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="pdf-upload"
                                    />
                                    <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                                        <FileText className="text-slate-400 mb-2" size={32} />
                                        <span className="text-sm font-semibold text-blue-600">
                                            {file ? file.name : "Click to select PDF"}
                                        </span>
                                        <span className="text-xs text-slate-400 mt-1">
                                            {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports standard Aakash Result formats"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'uploading' || status === 'processing'}
                                className={`w-full py-3 rounded-lg text-white font-bold flex items-center justify-center gap-2 ${status === 'uploading' || status === 'processing' ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {(status === 'uploading' || status === 'processing') ? (
                                    <><Loader2 className="animate-spin" size={20} /> Processing...</>
                                ) : (
                                    <>Start Ingestion Pipeline</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Status & Logs */}
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl text-white">
                        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center">
                            Console Output
                        </h2>

                        <div className="h-64 lg:h-[400px] overflow-y-auto font-mono text-xs bg-black/30 p-4 rounded-lg border border-slate-700/50 space-y-2">
                            {status === 'idle' && (
                                <p className="text-slate-500 italic">Waiting for job...</p>
                            )}

                            {logs.map((log, idx) => (
                                <div key={idx} className="border-l-2 border-slate-700 pl-3">
                                    <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>{" "}
                                    <span className="text-slate-300">{log}</span>
                                </div>
                            ))}

                            {status === 'success' && (
                                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 mt-4 flex items-center">
                                    <CheckCircle size={16} className="mr-2" /> Pipeline Completed Successfully
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 mt-4 flex items-center">
                                    <AlertTriangle size={16} className="mr-2" /> Pipeline Failed
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
