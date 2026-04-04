"use client";

import React, { useState } from 'react';
import styles from '../register/Auth.module.css';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess("OTP has been sent to your email!");
                // Store email in local storage or state to pass to reset page
                sessionStorage.setItem('resetEmail', email);
                setTimeout(() => {
                    router.push('/reset-password');
                }, 1500);
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
                <h1 className={styles.authTitle}>Forgot Password</h1>
                <p className={styles.authSubtitle}>Enter your email to receive a recovery OTP</p>

                {error && <div className={styles.errorAlert}>{error}</div>}
                {success && <div className={styles.successAlert}>{success}</div>}

                <form onSubmit={handleSendOTP} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                </form>

                <p className={styles.switchAuth}>
                    Remember your password? <a href="/login">Go back to login</a>
                </p>
            </div>
        </div>
    );
}
