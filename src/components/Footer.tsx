"use client";

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Footer.module.css';

const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const InstagramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

export default function Footer() {
    const router = useRouter();
    const clickCount = useRef(0);
    const clickTimer = useRef<NodeJS.Timeout | null>(null);

    const handleCopyrightClick = () => {
        clickCount.current += 1;
        if (clickTimer.current) clearTimeout(clickTimer.current);
        if (clickCount.current >= 3) {
            clickCount.current = 0;
            router.push('/login');
        } else {
            clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 800);
        }
    };

    return (
        <footer className={styles.footer} id="contact">
            <div className={styles.footerContent}>
                <div className={styles.brand}>
                    <img src="/logo.png" alt="Glow of Joe Logo" className={styles.logoImage} />
                </div>

                <div className={styles.socialContainer}>
                    <h3 className={styles.socialTitle}>Find Us On</h3>
                    <div className={styles.socialLinks}>
                        <a href="https://www.facebook.com/profile.php?id=61575429970949" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                            <FacebookIcon />
                        </a>
                        <a href="https://www.instagram.com/glow_of_joe?igsh=MTV2dHdheGo2Y2xzdQ==" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                            <InstagramIcon />
                        </a>
                        <div className={styles.whatsappWrapper}>
                            <a href="https://wa.me/919074185755" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
                                <WhatsAppIcon />
                            </a>
                            <span className={styles.whatsappLabel}>Customer Support</span>
                        </div>
                    </div>
                </div>

                <div className={styles.copyright}>
                    <p onClick={handleCopyrightClick} style={{ cursor: 'default', userSelect: 'none' }}>
                        &copy; {new Date().getFullYear()} Glow of Joe. All Rights Reserved.
                    </p>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>Handmade Jewelry across India.</p>
                </div>
            </div>
        </footer>
    );
}