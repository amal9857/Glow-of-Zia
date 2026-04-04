"use client";

import React, { useState } from 'react';
import styles from './ProductPage.module.css';

export default function ImageGallery({ images, name }: { images: string[]; name: string }) {
    const [active, setActive] = useState(0);

    return (
        <div className={styles.imagePanel}>
            <div className={styles.mainImageContainer}>
                <img src={images[active]} alt={name} className={styles.mainImage} />
            </div>
            {images.length > 1 && (
                <div className={styles.thumbnailGallery}>
                    {images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt={`${name} ${i + 1}`}
                            className={styles.thumbnail}
                            onClick={() => setActive(i)}
                            style={{ border: i === active ? '2px solid var(--gold-primary)' : '1px solid #222', cursor: 'pointer' }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
