import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit3, FiSearch, FiEye, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './PatientTable.css';

const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
        opacity: 1, x: 0,
        transition: { delay: i * 0.04, duration: 0.35, ease: 'easeOut' },
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

export default function PatientTable({ patients, onDelete, onEdit, onAddPatient, onViewPrescription, loading }) {
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [photo, setPhoto] = useState(null);

    const filteredPatients = patients.filter(p =>
        (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.disease || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.status || '').toLowerCase().includes(search.toLowerCase())
    );

    const handlePhotoChange = (e) => {
        if (e.target.files?.[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => setPhoto(ev.target.result);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const f = e.target;
        try {
            await onAddPatient({
                photo: photo || 'https://cdn-icons-png.flaticon.com/512/387/387561.png',
                name: f.patientName.value,
                age: parseInt(f.age.value),
                height: parseInt(f.height.value),
                weight: parseInt(f.weight.value),
                bp: f.bp.value,
                oxygen: parseInt(f.oxygen.value),
                disease: f.disease.value,
                heartrate: parseInt(f.heartrate.value),
                status: f.status.value,
                prescription: '',
            });
            toast.success('Patient added successfully! 🎉');
            f.reset();
            setPhoto(null);
            setShowForm(false);
        } catch {
            toast.error('Failed to add patient');
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete ${name}?`)) return;
        try {
            await onDelete(id);
            toast.success('Patient deleted');
        } catch {
            toast.error('Failed to delete');
        }
    };

    const getBadgeClass = (status) => {
        if (status === 'Critical') return 'badge badge-critical';
        if (status === 'Stable') return 'badge badge-stable';
        return 'badge';
    };

    return (
        <div className="patient-section">
            <div className="section-header">
                <motion.h1
                    className="page-title"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    Patients
                </motion.h1>
                <motion.button
                    className="add-btn"
                    onClick={() => setShowForm(!showForm)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    {showForm ? <FiX /> : <FiPlus />}
                    {showForm ? 'Cancel' : 'Add Patient'}
                </motion.button>
            </div>

            {/* Add Patient Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        className="add-form"
                        onSubmit={handleAdd}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Photo</label>
                                <input type="file" accept="image/*" onChange={handlePhotoChange} />
                            </div>
                            <div className="form-group">
                                <label>Name</label>
                                <input name="patientName" placeholder="Full name" required />
                            </div>
                            <div className="form-group">
                                <label>Age</label>
                                <input name="age" type="number" placeholder="Age" min="0" required />
                            </div>
                            <div className="form-group">
                                <label>Height (cm)</label>
                                <input name="height" type="number" placeholder="170" min="0" required />
                            </div>
                            <div className="form-group">
                                <label>Weight (kg)</label>
                                <input name="weight" type="number" placeholder="70" min="0" required />
                            </div>
                            <div className="form-group">
                                <label>Blood Pressure</label>
                                <input name="bp" placeholder="120/80" required />
                            </div>
                            <div className="form-group">
                                <label>Oxygen (%)</label>
                                <input name="oxygen" type="number" placeholder="98" min="0" max="100" required />
                            </div>
                            <div className="form-group">
                                <label>Disease</label>
                                <input name="disease" placeholder="Condition" required />
                            </div>
                            <div className="form-group">
                                <label>Heart Rate</label>
                                <input name="heartrate" type="number" placeholder="72" min="0" required />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" required>
                                    <option value="">Select…</option>
                                    <option value="Critical">Critical</option>
                                    <option value="Stable">Stable</option>
                                </select>
                            </div>
                        </div>
                        <motion.button type="submit" className="submit-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <FiPlus /> Add Patient
                        </motion.button>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Search */}
            <div className="search-bar">
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search patients by name, disease, status…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Loading Skeleton */}
            {loading && (
                <div className="skeleton-rows">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton-row">
                            <div className="skeleton-cell skeleton-avatar" />
                            <div className="skeleton-cell skeleton-text" />
                            <div className="skeleton-cell skeleton-text short" />
                            <div className="skeleton-cell skeleton-text short" />
                            <div className="skeleton-cell skeleton-badge" />
                        </div>
                    ))}
                </div>
            )}

            {/* Patient Cards */}
            {!loading && (
                <div className="patient-grid">
                    <AnimatePresence mode="popLayout">
                        {filteredPatients.map((p, idx) => (
                            <motion.div
                                key={p._id}
                                className="patient-card"
                                custom={idx}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={rowVariants}
                                layout
                                whileHover={{ y: -4 }}
                            >
                                <div className="card-header">
                                    <img
                                        src={p.photo || 'https://cdn-icons-png.flaticon.com/512/387/387561.png'}
                                        alt={p.name}
                                        className="card-avatar"
                                    />
                                    <div className="card-identity">
                                        <h3>{p.name}</h3>
                                        <span className={getBadgeClass(p.status)}>{p.status}</span>
                                    </div>
                                </div>
                                <div className="card-metrics">
                                    <div className="metric"><span className="metric-label">Age</span><span className="metric-value">{p.age}</span></div>
                                    <div className="metric"><span className="metric-label">Heart Rate</span><span className="metric-value">{p.heartrate} bpm</span></div>
                                    <div className="metric"><span className="metric-label">BP</span><span className="metric-value">{p.bp}</span></div>
                                    <div className="metric"><span className="metric-label">O₂</span><span className="metric-value">{p.oxygen}%</span></div>
                                    <div className="metric"><span className="metric-label">Disease</span><span className="metric-value">{p.disease}</span></div>
                                    <div className="metric"><span className="metric-label">Height</span><span className="metric-value">{p.height} cm</span></div>
                                    <div className="metric"><span className="metric-label">Weight</span><span className="metric-value">{p.weight} kg</span></div>
                                </div>
                                <div className="card-actions">
                                    <button className="action-btn edit" onClick={() => onEdit(p)} title="Edit">
                                        <FiEdit3 />
                                    </button>
                                    <button className="action-btn view" onClick={() => onViewPrescription(p._id)} title="Prescription">
                                        <FiEye />
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDelete(p._id, p.name)} title="Delete">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filteredPatients.length === 0 && (
                <div className="empty-state">
                    <p>No patients found{search ? ' matching your search' : ''}.</p>
                </div>
            )}
        </div>
    );
}
