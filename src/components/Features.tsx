import React from 'react';
import { Truck, Gem, HeadphonesIcon } from 'lucide-react';
import styles from './Features.module.css';

const features = [
    {
        icon: <Truck size={40} className="gold-text" />,
        title: "Pan India Delivery",
        description: "Fast and secure delivery available all over India with tracking."
    },
    {
        icon: <Gem size={40} className="gold-text" />,
        title: "High Quality Products",
        description: "Premium handmade jewelry crafted with precision and care."
    },
    {
        icon: <HeadphonesIcon size={40} className="gold-text" />,
        title: "24/7 WhatsApp Support",
        description: "Always here for you. Reach out on WhatsApp anytime."
    }
];

export default function Features() {
    return (
        <section className={styles.featuresSection} id="features">
            <div className="section-container">
                <h2 className="section-title">Why Choose Us</h2>
                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.featureCard}>
                            <div className={styles.iconWrapper}>
                                {feature.icon}
                            </div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDesc}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
