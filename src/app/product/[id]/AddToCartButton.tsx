"use client";

import React from 'react';
import { useCart } from '../../../components/CartContext';
import styles from './ProductPage.module.css';

interface Props {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
        collection: string;
        category: string;
    };
}

export default function AddToCartButton({ product }: Props) {
    const { addItem } = useCart();

    return (
        <button
            className={`${styles.addToCartBtn} btn-primary`}
            onClick={() => addItem(product)}
        >
            Add to Order
        </button>
    );
}
