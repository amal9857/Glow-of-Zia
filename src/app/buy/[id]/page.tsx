"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './BuyPage.module.css';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    collection: string;
    category: string;
}

type FormKey = 'name' | 'email' | 'phone' | 'address' | 'city' | 'state' | 'country' | 'pincode' | 'landmark';

const initialForm: Record<FormKey, string> = {
    name: '', email: '', phone: '',
    address: '', city: '', state: '', country: '', pincode: '', landmark: ''
};

function validate(key: FormKey, value: string): string {
    if (key === 'email') {
        if (!value.trim()) return 'Email is required';
        if (!value.endsWith('@gmail.com')) return 'Email must end with @gmail.com';
    }
    if (key === 'phone') {
        if (!value.trim()) return 'Phone number is required';
        if (!/^\d{10}$/.test(value.trim())) return 'Phone number must be exactly 10 digits';
    }
    if (key !== 'landmark' && !value.trim()) return 'This field is required';
    return '';
}

export default function BuyPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [form, setForm] = useState(initialForm);
    const [touched, setTouched] = useState<Partial<Record<FormKey, boolean>>>({});
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(r => r.json())
            .then(data => { setProduct(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id]);

    const errors: Partial<Record<FormKey, string>> = {};
    (Object.keys(form) as FormKey[]).forEach(key => {
        const err = validate(key, form[key]);
        if (err) errors[key] = err;
    });

    const isValid = Object.keys(errors).length === 0;
    const total = product ? product.price * quantity : 0;

    const handleChange = (key: FormKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [key]: e.target.value }));
    };

    const handleBlur = (key: FormKey) => () => {
        setTouched(prev => ({ ...prev, [key]: true }));
    };

    const handleBuy = () => {
        // Touch all fields to show all errors
        const allTouched: Partial<Record<FormKey, boolean>> = {};
        (Object.keys(form) as FormKey[]).forEach(k => { allTouched[k] = true; });
        setTouched(allTouched);
        if (!isValid || !product) return;

        const msg =
            `*New Order — Glow of Zia*\n` +
            `--------------------------------\n` +
            `*Customer Details*\n` +
            `Name: ${form.name}\n` +
            `Email: ${form.email}\n` +
            `Phone: ${form.phone}\n\n` +
            `*Delivery Address*\n` +
            `${form.address}\n` +
            `${form.city}, ${form.state}\n` +
            `${form.country} - ${form.pincode}\n` +
            (form.landmark ? `Landmark: ${form.landmark}\n` : '') +
            `--------------------------------\n` +
            `*Order Details*\n` +
            `Product: ${product.name}\n` +
            `Collection: ${product.collection}\n` +
            `Category: ${product.category}\n` +
            `Quantity: ${quantity}\n` +
            `Price per item: Rs.${product.price.toLocaleString('en-IN')}\n` +
            `Total Amount: Rs.${total.toLocaleString('en-IN')}\n` +
            `--------------------------------\n` +
            `Please confirm my order. Thank you.\n\n` +
            `Please share the payment screenshot to proceed.\n\n` +
            `Note: Delivery charges may vary depending on your location and will be confirmed at the time of order.`;

        const phone = process.env.NEXT_PUBLIC_OWNER_WHATSAPP || '919999999999';
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const field = (key: FormKey) => ({
        value: form[key],
        onChange: handleChange(key),
        onBlur: handleBlur(key),
        className: touched[key] && errors[key] ? styles.inputError : '',
    });

    const showErr = (key: FormKey) =>
        touched[key] && errors[key]
            ? <span className={styles.errorMsg}>{errors[key]}</span>
            : null;

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (!product) return (
        <div className={styles.loading}>
            Product not found. <Link href="/">Go Home</Link>
        </div>
    );

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <Link href={`/product/${id}`} className={styles.back}>
                    <ChevronLeft size={18} /> Back to Product
                </Link>

                <h1 className={styles.title}>Complete Your Order</h1>

                <div className={styles.layout}>
                    {/* Form */}
                    <div className={styles.formCard}>
                        <h2 className={styles.cardTitle}>Your Details</h2>

                        <div className={styles.field}>
                            <label>Full Name *</label>
                            <input type="text" placeholder="Enter your full name" {...field('name')} />
                            {showErr('name')}
                        </div>
                        <div className={styles.field}>
                            <label>Email Address *</label>
                            <input type="email" placeholder="example@gmail.com" {...field('email')} />
                            {showErr('email')}
                        </div>
                        <div className={styles.field}>
                            <label>Phone Number *</label>
                            <input type="tel" placeholder="10-digit phone number" maxLength={10} {...field('phone')} />
                            {showErr('phone')}
                        </div>

                        <div className={styles.sectionLabel}>Delivery Address</div>

                        <div className={styles.field}>
                            <label>Street Address *</label>
                            <textarea placeholder="House no., street, area" rows={2} {...field('address')} />
                            {showErr('address')}
                        </div>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>City *</label>
                                <input type="text" placeholder="City" {...field('city')} />
                                {showErr('city')}
                            </div>
                            <div className={styles.field}>
                                <label>State *</label>
                                <input type="text" placeholder="State" {...field('state')} />
                                {showErr('state')}
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>Country *</label>
                                <input type="text" placeholder="Country" {...field('country')} />
                                {showErr('country')}
                            </div>
                            <div className={styles.field}>
                                <label>Pincode *</label>
                                <input type="text" placeholder="Pincode" {...field('pincode')} />
                                {showErr('pincode')}
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label>Landmark <span className={styles.optional}>(optional)</span></label>
                            <input type="text" placeholder="Nearby landmark" {...field('landmark')} />
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className={styles.summaryCard}>
                        <h2 className={styles.cardTitle}>Order Summary</h2>

                        <div className={styles.productRow}>
                            <img src={product.image} alt={product.name} className={styles.productImg} />
                            <div>
                                <p className={styles.productName}>{product.name}</p>
                                <p className={styles.productMeta}>{product.collection} · {product.category}</p>
                                <p className={styles.productPrice}>₹{product.price.toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        <div className={styles.quantityRow}>
                            <label>Quantity</label>
                            <div className={styles.quantityControl}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>
                        </div>

                        <div className={styles.divider} />

                        <div className={styles.totalRow}>
                            <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                            <span>₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Shipping</span>
                            <span className={styles.free}>Free</span>
                        </div>

                        <div className={styles.divider} />

                        <div className={styles.grandTotal}>
                            <span>Total</span>
                            <span>₹{total.toLocaleString('en-IN')}</span>
                        </div>

                        <button className={styles.buyBtn} onClick={handleBuy}>
                            💬 Buy Now on WhatsApp
                        </button>
                        <p className={styles.deliveryNote}>
                            Note: Delivery charges may vary depending on your location and will be confirmed at the time of order.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
