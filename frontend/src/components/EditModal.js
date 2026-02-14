import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './EditModal.css';

export default function EditModal({ patient, onSave, onClose }) {
    const [form, setForm] = useState({});

    useEffect(() => {
        if (patient) {
            setForm({
                name: patient.name || '',
                age: patient.age || '',
                height: patient.height || '',
                weight: patient.weight || '',
                bp: patient.bp || '',
                oxygen: patient.oxygen || '',
                disease: patient.disease || '',
                heartrate: patient.heartrate || '',
                status: patient.status || '',
            });
        }
    }, [patient]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(patient._id, {
                ...form,
                age: parseInt(form.age),
                height: parseInt(form.height),
                weight: parseInt(form.weight),
                oxygen: parseInt(form.oxygen),
                heartrate: parseInt(form.heartrate),
                photo: patient.photo,
                prescription: patient.prescription,
            });
            toast.success('Patient updated! ✅');
            onClose();
        } catch {
            toast.error('Failed to update patient');
        }
    };

    return (
        <AnimatePresence>
            {patient && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="modal-box"
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>Edit Patient</h2>
                            <button className="close-btn" onClick={onClose}><FiX /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="modal-grid">
                                {[
                                    { label: 'Name', key: 'name', type: 'text' },
                                    { label: 'Age', key: 'age', type: 'number' },
                                    { label: 'Height (cm)', key: 'height', type: 'number' },
                                    { label: 'Weight (kg)', key: 'weight', type: 'number' },
                                    { label: 'Blood Pressure', key: 'bp', type: 'text' },
                                    { label: 'Oxygen (%)', key: 'oxygen', type: 'number' },
                                    { label: 'Disease', key: 'disease', type: 'text' },
                                    { label: 'Heart Rate', key: 'heartrate', type: 'number' },
                                ].map(({ label, key, type }) => (
                                    <div className="modal-field" key={key}>
                                        <label>{label}</label>
                                        <input
                                            type={type}
                                            value={form[key] || ''}
                                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                            required
                                        />
                                    </div>
                                ))}
                                <div className="modal-field">
                                    <label>Status</label>
                                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} required>
                                        <option value="">Select…</option>
                                        <option value="Critical">Critical</option>
                                        <option value="Stable">Stable</option>
                                    </select>
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                className="save-btn"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiSave /> Save Changes
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
