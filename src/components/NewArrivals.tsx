"use client";

import React from 'react';
import styles from './NewArrivals.module.css';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    isNew: boolean;
}

interface NewArrivalsProps {
    products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
    if (products.length === 0) return null;

    return (
        <section className="section-container" id="new-arrivals">
            <h2 className="section-title">New Arrivals</h2>
            <div className={styles.grid}>
                {products.map((product) => (
                    <div key={product.id} className={styles.card}>
                        <Link href={`/product/${product.id}`} className={styles.imageLink}>
                            <div className={styles.imageContainer}>
                                <img src={product.image} alt={product.name} className={styles.image} />
                                <span className={styles.badge}>New</span>
                            </div>
                        </Link>
                        <div className={styles.info}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <p className={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>
                            <Link href={`/product/${product.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
