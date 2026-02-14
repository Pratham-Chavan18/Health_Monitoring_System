import { motion } from 'framer-motion';
import { FiGrid, FiUsers, FiFileText, FiLogOut, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'details', label: 'Patients', icon: FiUsers },
    { id: 'prescriptions', label: 'Prescriptions', icon: FiFileText },
];

export default function Sidebar({ activePage, onPageChange }) {
    const { logout } = useAuth();

    return (
        <motion.aside
            className="sidebar"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
            <div className="sidebar-brand">
                <FiActivity className="brand-icon" />
                <span className="brand-text">Health<br />Monitoring</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                        <motion.button
                            key={item.id}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => onPageChange(item.id)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {isActive && (
                                <motion.div
                                    className="nav-indicator"
                                    layoutId="activeIndicator"
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                />
                            )}
                            <Icon className="nav-icon" />
                            <span>{item.label}</span>
                        </motion.button>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <motion.button
                    className="logout-btn"
                    onClick={logout}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <FiLogOut className="nav-icon" />
                    <span>Logout</span>
                </motion.button>
            </div>
        </motion.aside>
    );
}
