const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

function getCollection() {
    return getDB().collection('patients');
}

// GET all patients
const getAllPatients = async (req, res, next) => {
    try {
        const patients = await getCollection().find().toArray();
        res.json(patients);
    } catch (err) {
        next(err);
    }
};

// POST a new patient
const createPatient = async (req, res, next) => {
    try {
        const newPatient = { ...req.body, prescriptions: [] };
        const result = await getCollection().insertOne(newPatient);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

// PUT update a patient
const updatePatient = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await getCollection().updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// DELETE a patient
const deletePatient = async (req, res, next) => {
    try {
        const result = await getCollection().deleteOne({
            _id: new ObjectId(req.params.id),
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET all prescriptions for a patient
const getPrescriptions = async (req, res, next) => {
    try {
        const patient = await getCollection().findOne({
            _id: new ObjectId(req.params.id),
        });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(patient.prescriptions || []);
    } catch (err) {
        next(err);
    }
};

// POST a new prescription for a patient
const addPrescription = async (req, res, next) => {
    try {
        const result = await getCollection().updateOne(
            { _id: new ObjectId(req.params.id) },
            { $push: { prescriptions: req.body } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// PUT update a prescription for a patient
const updatePrescription = async (req, res, next) => {
    try {
        const { patientId, prescriptionId } = req.params;
        const result = await getCollection().updateOne(
            { _id: new ObjectId(patientId), 'prescriptions._id': prescriptionId },
            { $set: { 'prescriptions.$': req.body } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Patient or prescription not found' });
        }
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// DELETE a prescription for a patient
const deletePrescription = async (req, res, next) => {
    try {
        const { patientId, prescriptionId } = req.params;
        const result = await getCollection().updateOne(
            { _id: new ObjectId(patientId) },
            { $pull: { prescriptions: { _id: prescriptionId } } }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Patient or prescription not found' });
        }
        res.json({ message: 'Prescription deleted successfully' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllPatients,
    createPatient,
    updatePatient,
    deletePatient,
    getPrescriptions,
    addPrescription,
    updatePrescription,
    deletePrescription,
};
