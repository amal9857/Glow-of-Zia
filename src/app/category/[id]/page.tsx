import React from 'react';
import { prisma } from '../../../lib/prisma';
import styles from '../../collection/[id]/CollectionPage.module.css';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface PageProps {
    params: { id: string };
}

export default async function CategoryPage({ params }: PageProps) {
    const categoryName = decodeURIComponent(params.id);

    const items = await prisma.product.findMany({
        where: { category: { equals: categoryName } },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className={styles.pageContainer}>
            <div className="section-container">
                <Link href="/#categories" className={styles.backButton || ''} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2rem' }}>
                    <ChevronLeft size={18} /> Back to Categories
                </Link>

                <h1 className="section-title" style={{ textTransform: 'capitalize' }}>
                    {categoryName}
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
                                    <Link href={`/product/${item.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', width: '100%', marginTop: '1rem' }}>
                                        View Product
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>No products found in {categoryName}.</p>
                        <Link href="/#categories" className="btn-outline" style={{ marginTop: '2rem', display: 'inline-block' }}>
                            Back to Categories
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
