import { useState, useCallback, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function usePatients(isAuthenticated) {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPatients = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/patients`);
            if (!res.ok) throw new Error('Failed to fetch patients');
            const data = await res.json();
            setPatients(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const addPatient = useCallback(async (patient) => {
        const res = await fetch(`${API_URL}/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...patient, prescriptions: [] }),
        });
        if (!res.ok) throw new Error('Failed to add patient');
        await fetchPatients();
    }, [fetchPatients]);

    const updatePatient = useCallback(async (id, data) => {
        const res = await fetch(`${API_URL}/patients/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update patient');
        await fetchPatients();
    }, [fetchPatients]);

    const deletePatient = useCallback(async (id) => {
        const res = await fetch(`${API_URL}/patients/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete patient');
        await fetchPatients();
    }, [fetchPatients]);

    return { patients, loading, error, fetchPatients, addPatient, updatePatient, deletePatient };
}
