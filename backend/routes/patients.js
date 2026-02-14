const express = require('express');
const router = express.Router();
const {
    getAllPatients,
    createPatient,
    updatePatient,
    deletePatient,
    getPrescriptions,
    addPrescription,
    updatePrescription,
    deletePrescription,
} = require('../controllers/patientController');

// Patient CRUD
router.get('/', getAllPatients);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

// Prescription sub-routes
router.get('/:id/prescriptions', getPrescriptions);
router.post('/:id/prescriptions', addPrescription);
router.put('/:patientId/prescriptions/:prescriptionId', updatePrescription);
router.delete('/:patientId/prescriptions/:prescriptionId', deletePrescription);

module.exports = router;
