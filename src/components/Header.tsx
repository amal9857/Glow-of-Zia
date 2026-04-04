"use client";

import React, { useState } from 'react';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import styles from './Header.module.css';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { data: session } = useSession();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const isAdmin = (session?.user as any)?.role === "ADMIN";

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <button onClick={toggleSidebar} className={styles.menuButton} aria-label="Menu">
                        <Menu size={28} />
                    </button>

                    <Link href="/" className={styles.logoContainer}>
                        <img src="/logo.jpg" alt="Glow of Zia Logo" className={styles.logoImage} />
                    </Link>

                    <div style={{ width: '40px' }} />
                </div>
            </header>

            {/* Sidebar Overlay */}
            <div
                className={`${styles.overlay} ${isSidebarOpen ? styles.overlayOpen : ''}`}
                onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Glow of Zia</h2>
                    <button onClick={toggleSidebar} className={styles.closeButton} aria-label="Close menu">
                        <X size={28} />
                    </button>
                </div>

                <nav className={styles.sidebarNav}>
                    <Link href="/" onClick={toggleSidebar}>Home</Link>
                    <Link href="/#collections" onClick={toggleSidebar}>Shop by Collection</Link>
                    <Link href="/#categories" onClick={toggleSidebar}>Men, Women & Kids</Link>
                    <Link href="/#features" onClick={toggleSidebar}>Why Choose Us</Link>

                    <div className={styles.sidebarDivider} />

                    {isAdmin && (
                        <Link href="/admin" onClick={toggleSidebar} className={styles.adminLink}>
                            Admin Dashboard
                        </Link>
                    )}

                    {isAdmin && (
                        <button
                            onClick={() => { signOut(); toggleSidebar(); }}
                            className={styles.logoutButton}
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </>
    );
}
