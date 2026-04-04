import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero} id="home">
            <div className={styles.heroContent}>
                <div className={styles.logoBadge}>
                    <img src="/logo.jpg" alt="Glow of Zia Logo" className={styles.logoImage} />
                </div>
                <div className={styles.ctaWrapper}>
                    <a href="#collections" className="btn-primary">Explore Collections</a>
                </div>
            </div>
        </section>
    );
}
