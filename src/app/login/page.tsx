"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import styles from '../register/Auth.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        console.log('signIn result:', res);

        if (res?.ok) {
            window.location.href = '/admin';
        } else {
            setError(res?.error || "Invalid email or password.");
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h1 className={styles.authTitle}>Admin Login</h1>
                <p className={styles.authSubtitle}>Enter your credentials to continue</p>

                {error && <div className={styles.errorAlert}>{error}</div>}

                <form onSubmit={handleLogin} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Verifying..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
