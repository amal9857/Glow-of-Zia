"use client";

import React, { useState, useEffect } from 'react';
import styles from '../register/Auth.module.css';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('resetEmail');
        if (!storedEmail) {
            router.push('/forgot-password');
        } else {
            setEmail(storedEmail);
        }
    }, []);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess("Password reset successfully! Redirecting you to login...");
                sessionStorage.removeItem('resetEmail');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h1 className={styles.authTitle}>Secure Reset</h1>
                <p className={styles.authSubtitle}>Resetting account for: {email}</p>

                {error && <div className={styles.errorAlert}>{error}</div>}
                {success && <div className={styles.successAlert}>{success}</div>}

                <form onSubmit={handleReset} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label>OTP Code</label>
                        <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit code" required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Resetting..." : "Update Password"}
                    </button>
                </form>

                <p className={styles.switchAuth}>
                    Wait, I can remember it! <a href="/login">Back to login</a>
                </p>
            </div>
        </div>
    );
}
