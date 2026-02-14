import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle, FiUsers, FiActivity } from 'react-icons/fi';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);

function AnimatedCounter({ target, duration = 1200 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        let start = 0;
        const end = target;
        if (end === 0) { setCount(0); return; }
        const step = Math.ceil(end / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);

    return <span ref={ref}>{count}</span>;
}

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
    }),
};

export default function Dashboard({ patients }) {
    const critical = patients.filter(p => p.status === 'Critical').length;
    const stable = patients.filter(p => p.status === 'Stable').length;
    const total = patients.length;

    const avgHeartRate = total > 0
        ? Math.round(patients.reduce((sum, p) => sum + (p.heartrate || 0), 0) / total)
        : 0;

    const stats = [
        { label: 'Total Patients', value: total, icon: FiUsers, color: '#6c63ff', bg: 'rgba(108,99,255,0.12)' },
        { label: 'Critical', value: critical, icon: FiAlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
        { label: 'Stable', value: stable, icon: FiCheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
        { label: 'Avg Heart Rate', value: avgHeartRate, icon: FiActivity, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    ];

    const doughnutData = {
        labels: ['Critical', 'Stable'],
        datasets: [{
            data: [critical || 0, stable || 0],
            backgroundColor: ['#ef4444', '#22c55e'],
            borderColor: ['rgba(239,68,68,0.3)', 'rgba(34,197,94,0.3)'],
            borderWidth: 2,
            cutout: '75%',
        }],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
    };

    // Build heart rate data for chart
    const heartRateData = {
        labels: patients.slice(0, 8).map(p => p.name?.split(' ')[0] || 'N/A'),
        datasets: [{
            label: 'Heart Rate',
            data: patients.slice(0, 8).map(p => p.heartrate || 0),
            borderColor: '#6c63ff',
            backgroundColor: 'rgba(108,99,255,0.08)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#6c63ff',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
        }],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'Inter' } },
                grid: { color: 'rgba(255,255,255,0.04)' },
            },
            y: {
                ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'Inter' } },
                grid: { color: 'rgba(255,255,255,0.04)' },
            },
        },
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <div className="dashboard">
            <motion.h1
                className="page-title"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                Dashboard
            </motion.h1>

            <div className="stats-grid">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            className="stat-card"
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            whileHover={{ y: -4, boxShadow: `0 12px 40px ${stat.bg}` }}
                        >
                            <div className="stat-icon-wrap" style={{ background: stat.bg }}>
                                <Icon style={{ color: stat.color, fontSize: '1.4rem' }} />
                            </div>
                            <div className="stat-info">
                                <h3><AnimatedCounter target={stat.value} /></h3>
                                <p>{stat.label}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="charts-row">
                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <h3 className="chart-title">Patient Status</h3>
                    <div className="doughnut-wrap">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                        <div className="doughnut-center">
                            <span className="doughnut-total">{total}</span>
                            <span className="doughnut-label">Total</span>
                        </div>
                    </div>
                    <div className="chart-legend">
                        <div className="legend-item">
                            <span className="legend-dot" style={{ background: '#ef4444' }} />
                            Critical ({critical})
                        </div>
                        <div className="legend-item">
                            <span className="legend-dot" style={{ background: '#22c55e' }} />
                            Stable ({stable})
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="chart-card chart-card-wide"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <h3 className="chart-title">Heart Rate Overview</h3>
                    <div className="line-chart-wrap">
                        <Line data={heartRateData} options={lineOptions} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
