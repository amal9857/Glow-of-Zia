"use client";

import React from 'react';
import styles from './ProductPage.module.css';

interface Props {
    phone: string;
    message: string;
    imageUrl: string;
    productName: string;
}

export default function OrderOnWhatsApp({ phone, message, imageUrl, productName }: Props) {
    const handleOrder = async () => {
        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        if (navigator.canShare) {
            try {
                const res = await fetch(imageUrl);
                const blob = await res.blob();
                const ext = imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
                const file = new File([blob], `${productName}.${ext}`, { type: blob.type });

                if (navigator.canShare({ files: [file] })) {
                    window.open(waUrl, '_blank');
                    await new Promise(r => setTimeout(r, 1500));
                    await navigator.share({ files: [file], title: 'Order Image - Glow of Zia' });
                    return;
                }
            } catch (_) { }
        }

        window.open(waUrl, '_blank');
    };

    return (
        <button onClick={handleOrder} className={`${styles.whatsappBtn} btn-outline`}>
            Order on WhatsApp
        </button>
    );
}
