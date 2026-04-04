import React from 'react';
import styles from './Categories.module.css';
import { prisma } from '../lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Categories() {
    let categories: any[] = [];
    try {
        categories = await prisma.category.findMany({ orderBy: { createdAt: 'asc' } });
    } catch (err) {
        console.error('Categories fetch error:', err);
    }

    return (
        <section className="section-container" id="categories">
            <h2 className="section-title">Shop by Category</h2>
            <div className={styles.categoryWrap}>
                {categories.map((cat) => (
                    <Link href={`/category/${cat.name}`} key={cat.id} className={styles.categoryCard}>
                        <img
                            src={cat.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'}
                            alt={cat.label}
                            className={styles.image}
                        />
                        <div className={styles.content}>
                            <h3 className={styles.name}>{cat.label}</h3>
                            <div className="btn-primary" style={{ marginTop: '1rem' }}>Shop Now</div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
