import React from 'react';
import { prisma } from '../../../lib/prisma';
import styles from './ProductPage.module.css';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ImageGallery from './ImageGallery';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function ProductPage({ params }: PageProps) {
    const product = await prisma.product.findUnique({
        where: { id: params.id }
    });

    if (!product) {
        return (
            <div className="section-container" style={{ textAlign: 'center', minHeight: '60vh', paddingTop: '10rem' }}>
                <h1 className="section-title">Product Not Found</h1>
                <Link href="/#collections" className="btn-primary">Return Home</Link>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className="section-container">

                <Link href={`/collection/${encodeURIComponent(product.collection)}`} className={styles.backButton}>
                    <ChevronLeft size={20} />
                    Back to {product.collection}
                </Link>

                <div className={styles.productLayout}>

                    <ImageGallery
                        images={(() => { try { const arr = JSON.parse(product.images || '[]'); return arr.length > 0 ? arr : [product.image]; } catch { return [product.image]; } })()}
                        name={product.name}
                    />

                    {/* Product Details Panel */}
                    <div className={styles.detailsPanel}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            {product.isNew && <span className={styles.badge}>New Arrival</span>}
                            {!product.inStock && <span className={styles.outOfStockBadge}>Out of Stock</span>}
                        </div>
                        <h1 className={styles.productName}>{product.name}</h1>
                        <p className={styles.productPrice}>₹{product.price.toLocaleString('en-IN')}</p>

                        <div className={styles.description}>
                            <p>{product.description || `Experience the sheer elegance of this beautifully handcrafted ${product.name}. Perfect for any occasion and meticulously styled to add a radiant glow to your attire.`}</p>

                            <ul className={styles.featureList}>
                                <li>Collection: <strong><span style={{ textTransform: 'capitalize' }}>{product.collection}</span></strong></li>
                                <li>Category: <strong><span style={{ textTransform: 'capitalize' }}>{product.category}</span></strong></li>
                                {(product as any).productNumber && <li>Product No: <strong>{(product as any).productNumber}</strong></li>}
                                {product.material && <li>Material: <strong>{product.material}</strong></li>}
                                {product.weight && <li>Weight: <strong>{product.weight}</strong></li>}
                                {product.size && <li>Size / Fit: <strong>{product.size}</strong></li>}

                            </ul>

                            {product.careInstructions && (
                                <div style={{ marginTop: '1rem' }}>
                                    <strong>Care Instructions:</strong>
                                    <p style={{ marginTop: '0.3rem', color: 'var(--text-secondary)' }}>{product.careInstructions}</p>
                                </div>
                            )}
                        </div>

                        <Link href={`/buy/${product.id}`} className={`${styles.addToCartBtn} btn-primary`} style={{ textAlign: 'center', marginTop: '3rem' }}>
                            Buy Now
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    );
}
