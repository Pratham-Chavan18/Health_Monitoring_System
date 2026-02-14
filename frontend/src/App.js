import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from './context/AuthContext';
import { usePatients } from './hooks/usePatients';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientTable from './components/PatientTable';
import EditModal from './components/EditModal';
import PrescriptionPanel from './components/PrescriptionPanel';
import './App.css';

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { patients, loading, fetchPatients, addPatient, updatePatient, deletePatient } = usePatients(isAuthenticated);
  const [page, setPage] = useState('dashboard');
  const [editPatient, setEditPatient] = useState(null);

  if (!isAuthenticated) return <Auth />;

  return (
    <div className="app-layout">
      <Sidebar activePage={page} onPageChange={setPage} />
      <main className="app-main">
        <AnimatePresence mode="wait">
          {page === 'dashboard' && (
            <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <Dashboard patients={patients} />
            </motion.div>
          )}

          {page === 'details' && (
            <motion.div key="details" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <PatientTable
                patients={patients}
                loading={loading}
                onDelete={deletePatient}
                onEdit={(p) => setEditPatient(p)}
                onAddPatient={addPatient}
                onViewPrescription={(id) => {
                  setPage('prescriptions');
                }}
              />
            </motion.div>
          )}

          {page === 'prescriptions' && (
            <motion.div key="prescriptions" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <PrescriptionPanel patients={patients} onRefresh={fetchPatients} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <EditModal
        patient={editPatient}
        onSave={updatePatient}
        onClose={() => setEditPatient(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <>
      <AppContent />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
