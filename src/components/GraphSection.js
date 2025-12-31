"use client";
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function GraphSection({ psid }) {
    const [graphs, setGraphs] = useState([]);
    const [activeGraph, setActiveGraph] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!psid) return;

        fetch(`/api/students/${psid}/graphs/subject_trends.json`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load graphs");
                return res.json();
            })
            .then(data => {
                const validGraphs = data.graphs.filter(g => g.datasets && g.datasets.length > 0 && g.x_axis.values.length > 0);
                setGraphs(validGraphs);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [psid]);

    if (loading) return <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Loading trends...</div>;
    if (graphs.length === 0) return null;

    const currentGraph = graphs[activeGraph];

    const chartData = {
        labels: currentGraph.x_axis.values,
        datasets: currentGraph.datasets.map(ds => ({
            label: ds.subject.charAt(0).toUpperCase() + ds.subject.slice(1),
            data: ds.data,
            borderColor:
                ds.subject === 'physics' ? '#3B82F6' : // Blue
                    ds.subject === 'chemistry' ? '#EC4899' : // Pink
                        ds.subject === 'botany' ? '#10B981' : // Green
                            '#F59E0B', // Amber for Zoology
            backgroundColor: 'transparent',
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 6
        }))
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', align: 'end', labels: { boxWidth: 10, usePointStyle: true, font: { size: 11 } } },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                padding: 10
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 10 }, color: '#64748b' }
            },
            y: {
                min: 0,
                max: 180,
                border: { dash: [4, 4] },
                grid: { color: '#f1f5f9' },
                ticks: { stepSize: 30, font: { size: 10 }, color: '#64748b' }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">{currentGraph.title}</h3>
                    <p className="text-xs text-slate-500">Subject-wise performance over time</p>
                </div>

                {/* Graph Selector Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
                    {graphs.map((g, idx) => (
                        <button
                            key={g.graph_id}
                            onClick={() => setActiveGraph(idx)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${activeGraph === idx
                                ? 'bg-white text-blue-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                        >
                            {g.title.replace('Subject Performance', '').replace('Test', '').replace('Subject', '').trim()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-64 sm:h-80 md:h-96 w-full">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}
