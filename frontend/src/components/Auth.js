import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiLogIn, FiUserPlus, FiEye, FiEyeOff, FiShield, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Password strength rules
const passwordRules = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
    { label: 'One number', test: (p) => /\d/.test(p) },
    { label: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

function getStrength(password) {
    const passed = passwordRules.filter((r) => r.test(password)).length;
    if (passed <= 1) return { level: 'weak', label: 'Weak', color: '#ef4444', percent: 20 };
    if (passed <= 2) return { level: 'fair', label: 'Fair', color: '#f59e0b', percent: 40 };
    if (passed <= 3) return { level: 'good', label: 'Good', color: '#eab308', percent: 60 };
    if (passed <= 4) return { level: 'strong', label: 'Strong', color: '#22c55e', percent: 80 };
    return { level: 'excellent', label: 'Excellent', color: '#10b981', percent: 100 };
}

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState(null);
    const { login } = useAuth();

    const strength = useMemo(() => getStrength(password), [password]);
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const isLocked = lockoutUntil && Date.now() < lockoutUntil;

    const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    const canSubmit = () => {
        if (isLocked) return false;
        if (!isValidEmail(email)) return false;
        if (isLogin) return password.length > 0;
        // For signup: strong password + matching confirm
        return strength.percent >= 60 && passwordsMatch;
    };

    const handleAuth = async (e) => {
        e.preventDefault();

        if (isLocked) {
            const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
            toast.error(`Too many attempts. Try again in ${remaining}s`);
            return;
        }

        if (!isValidEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        if (!isLogin) {
            if (strength.percent < 60) {
                toast.error('Please use a stronger password');
                return;
            }
            if (!passwordsMatch) {
                toast.error('Passwords do not match');
                return;
            }
        }

        setLoading(true);
        try {
            const endpoint = isLogin ? `${API_URL}/login` : `${API_URL}/signup`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (data.token) {
                setAttempts(0);
                login(data.token);
                toast.success('Welcome back! 🎉');
            } else if (data.message) {
                setAttempts(0);
                toast.success(data.message);
                if (!isLogin) {
                    setIsLogin(true);
                    setPassword('');
                    setConfirmPassword('');
                }
            } else {
                const newAttempts = attempts + 1;
                setAttempts(newAttempts);

                if (newAttempts >= 5) {
                    const lockTime = Date.now() + 30000; // 30s lockout
                    setLockoutUntil(lockTime);
                    toast.error('Account locked for 30 seconds due to failed attempts');
                    setTimeout(() => { setLockoutUntil(null); setAttempts(0); }, 30000);
                } else {
                    toast.error(data.error || `Invalid credentials (${5 - newAttempts} attempts left)`);
                }
            }
        } catch {
            toast.error('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirm(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-blob auth-blob-1" />
            <div className="auth-blob auth-blob-2" />
            <div className="auth-blob auth-blob-3" />

            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {/* Logo & Title */}
                <div className="auth-logo">
                    <motion.div
                        className="logo-shield"
                        initial={{ rotate: -20, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        <FiShield className="shield-icon" />
                    </motion.div>
                </div>
                <h2 className="auth-title">Health Monitoring System</h2>
                <p className="auth-subtitle">
                    {isLogin ? 'Secure login to your account' : 'Create a secure account'}
                </p>

                {/* Lockout warning */}
                <AnimatePresence>
                    {isLocked && (
                        <motion.div
                            className="lockout-banner"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            🔒 Account temporarily locked due to too many failed attempts
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleAuth} className="auth-form">
                    {/* Email */}
                    <div className="input-group">
                        <FiMail className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                        {email.length > 0 && (
                            <span className={`input-validation ${isValidEmail(email) ? 'valid' : 'invalid'}`}>
                                {isValidEmail(email) ? <FiCheck /> : <FiX />}
                            </span>
                        )}
                    </div>

                    {/* Password */}
                    <div className="input-group">
                        <FiLock className="input-icon" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    {/* Password Strength (signup only) */}
                    <AnimatePresence>
                        {!isLogin && password.length > 0 && (
                            <motion.div
                                className="strength-section"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className="strength-bar-track">
                                    <motion.div
                                        className="strength-bar-fill"
                                        style={{ background: strength.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${strength.percent}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <span className="strength-label" style={{ color: strength.color }}>
                                    {strength.label}
                                </span>
                                <ul className="password-rules">
                                    {passwordRules.map((rule, i) => (
                                        <li key={i} className={rule.test(password) ? 'passed' : ''}>
                                            {rule.test(password) ? <FiCheck /> : <FiX />}
                                            {rule.label}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Confirm Password (signup only) */}
                    <AnimatePresence>
                        {!isLogin && (
                            <motion.div
                                className="input-group"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <FiLock className="input-icon" />
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required={!isLogin}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    tabIndex={-1}
                                >
                                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                                </button>
                                {confirmPassword.length > 0 && (
                                    <span className={`input-validation confirm-check ${passwordsMatch ? 'valid' : 'invalid'}`}>
                                        {passwordsMatch ? <FiCheck /> : <FiX />}
                                    </span>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        type="submit"
                        className={`auth-btn ${isLocked ? 'locked' : ''}`}
                        disabled={loading || !canSubmit()}
                        whileHover={canSubmit() ? { scale: 1.02 } : {}}
                        whileTap={canSubmit() ? { scale: 0.98 } : {}}
                    >
                        {loading ? (
                            <span className="btn-spinner" />
                        ) : isLocked ? (
                            <>🔒 Locked</>
                        ) : (
                            <>
                                {isLogin ? <FiLogIn /> : <FiUserPlus />}
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Security notice */}
                <div className="security-notice">
                    <FiShield className="notice-icon" />
                    <span>256-bit SSL encrypted connection</span>
                </div>

                <p className="auth-toggle">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <span onClick={switchMode}>
                        {isLogin ? ' Register' : ' Login'}
                    </span>
                </p>
            </motion.div>
        </div>
    );
}
