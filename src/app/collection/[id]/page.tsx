import React from 'react';
import { prisma } from '../../../lib/prisma';
import styles from './CollectionPage.module.css';
import Link from 'next/link';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function CollectionPage({ params }: PageProps) {
    // Decode the URL param
    const collectionName = decodeURIComponent(params.id);

    // Fetch from database
    const items = await prisma.product.findMany({
        where: {
            collection: {
                equals: collectionName,
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className={styles.pageContainer}>
            <div className="section-container">
                <h1 className="section-title" style={{ textTransform: 'capitalize' }}>
                    {collectionName} Collection
                </h1>

                {items.length > 0 ? (
                    <div className={styles.grid}>
                        {items.map((item) => (
                            <div key={item.id} className={styles.productCard}>
                                <div className={styles.imageContainer}>
                                    <img src={item.image} alt={item.name} className={styles.image} />
                                    {item.isNew && <span className={styles.badge}>New</span>}
                                </div>
                                <div className={styles.productInfo}>
                                    <h3 className={styles.productName}>{item.name}</h3>
                                    <p className={styles.productPrice}>₹{item.price.toLocaleString('en-IN')}</p>
                                    <Link href={`/product/${item.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', width: '100%', marginTop: '1rem', textDecoration: 'none' }}>
                                        View Product
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>New {collectionName} are coming soon!</p>
                        <Link href="/#collections" className="btn-outline" style={{ marginTop: '2rem' }}>
                            Back to Collections
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
