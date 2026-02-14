import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './PrescriptionPanel.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function PrescriptionPanel({ patients, onRefresh }) {
    const [selectedId, setSelectedId] = useState(null);
    const [text, setText] = useState('');

    const selectedPatient = patients.find(p => p._id === selectedId);

    const selectPatient = (id) => {
        setSelectedId(id);
        const patient = patients.find(p => p._id === id);
        setText(patient?.prescription || '');
    };

    const savePrescription = async () => {
        if (!selectedId) return;
        try {
            await fetch(`${API_URL}/patients/${selectedId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prescription: text }),
            });
            toast.success('Prescription saved! 📋');
            onRefresh();
        } catch {
            toast.error('Failed to save prescription');
        }
    };

    return (
        <div className="prescription-section">
            <motion.h1
                className="page-title"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                Prescriptions
            </motion.h1>

            <div className="prescription-layout">
                {/* Patient list */}
                <motion.div
                    className="patient-list-panel"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3 className="panel-heading">Select Patient</h3>
                    <div className="patient-list-items">
                        <AnimatePresence>
                            {patients.map((p, idx) => (
                                <motion.button
                                    key={p._id}
                                    className={`patient-list-item ${selectedId === p._id ? 'selected' : ''}`}
                                    onClick={() => selectPatient(p._id)}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    whileHover={{ x: 4 }}
                                >
                                    <img
                                        src={p.photo || 'https://cdn-icons-png.flaticon.com/512/387/387561.png'}
                                        alt={p.name}
                                        className="list-avatar"
                                    />
                                    <div className="list-info">
                                        <span className="list-name">{p.name}</span>
                                        <span className="list-disease">{p.disease}</span>
                                    </div>
                                    {p.prescription && <FiFileText className="has-rx-icon" />}
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Editor */}
                <motion.div
                    className="prescription-editor"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {selectedPatient ? (
                        <>
                            <div className="editor-header">
                                <h3>Prescription for <span className="highlight">{selectedPatient.name}</span></h3>
                            </div>
                            <textarea
                                className="rx-textarea"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter prescription details, medications, dosages, instructions…"
                            />
                            <motion.button
                                className="save-rx-btn"
                                onClick={savePrescription}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiSave /> Save Prescription
                            </motion.button>
                        </>
                    ) : (
                        <div className="editor-placeholder">
                            <FiFileText className="placeholder-icon" />
                            <p>Select a patient to view or edit their prescription</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
