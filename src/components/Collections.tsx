import React from 'react';
import styles from './Collections.module.css';
import { prisma } from '../lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Collections() {
    let collections: any[] = [];
    try {
        collections = await prisma.collection.findMany({ orderBy: { createdAt: 'asc' } });
    } catch (err) {
        console.error('Collections fetch error:', err);
    }

    return (
        <section className="section-container" id="collections">
            <h2 className="section-title">Shop by Collection</h2>
            <div className={styles.grid}>
                {collections.map((col) => (
                    <Link href={`/collection/${encodeURIComponent(col.name)}`} key={col.id} className={styles.card}>
                        <div className={styles.imageContainer}>
                            <img
                                src={col.image || 'https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&w=600&q=80'}
                                alt={col.name}
                                className={styles.image}
                            />
                            <div className={styles.overlay}>
                                <button className="btn-outline">View Collection</button>
                            </div>
                        </div>
                        <h3 className={styles.cardTitle}>{col.name}</h3>
                    </Link>
                ))}
            </div>
        </section>
    );
}
