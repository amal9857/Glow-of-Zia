"use client";

import React from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from './CartContext';

export default function CartDrawer() {
    const { items, removeItem, updateQty, total, count, isOpen, setIsOpen, clearCart } = useCart();

    const handleBuyWhatsApp = async () => {
        if (items.length === 0) return;

        const phone = process.env.NEXT_PUBLIC_OWNER_WHATSAPP || '919999999999';

        const itemLines = items.map((item, i) =>
            `${i + 1}. *${item.name}*\n   Collection: ${item.collection} | Category: ${item.category}\n   Price: ₹${item.price.toLocaleString('en-IN')} × ${item.qty} = ₹${(item.price * item.qty).toLocaleString('en-IN')}`
        ).join('\n\n');

        const message =
            `🛍️ *New Order from Glow of Zia*\n\n` +
            `${itemLines}\n\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `🧾 *Total Items:* ${count}\n` +
            `💰 *Grand Total: ₹${total.toLocaleString('en-IN')}*\n` +
            `━━━━━━━━━━━━━━━━━━\n\n` +
            `Please confirm my order and share payment details. Thank you! 🙏`;

        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        // On mobile: open WhatsApp with message, then share images via Web Share
        if (navigator.canShare && items.length > 0) {
            try {
                const imageFiles = await Promise.all(
                    items.map(async (item) => {
                        const res = await fetch(item.image);
                        const blob = await res.blob();
                        const ext = item.image.split('.').pop()?.split('?')[0] || 'jpg';
                        return new File([blob], `${item.name}.${ext}`, { type: blob.type });
                    })
                );
                if (navigator.canShare({ files: imageFiles })) {
                    window.open(waUrl, '_blank');
                    await new Promise(r => setTimeout(r, 1500));
                    await navigator.share({ files: imageFiles, title: 'Order Images - Glow of Zia' });
                    return;
                }
            } catch (_) { }
        }

        window.open(waUrl, '_blank');
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200 }}
                />
            )}

            {/* Drawer */}
            <div style={{
                position: 'fixed', top: 0, right: isOpen ? 0 : '-420px', width: '420px',
                maxWidth: '100vw', height: '100vh', background: '#0a0a0a',
                borderLeft: '1px solid var(--border-color)', zIndex: 201,
                transition: 'right 0.3s ease', display: 'flex', flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <h2 style={{ margin: 0, color: 'var(--gold-primary)', fontSize: '1.3rem' }}>Your Order ({count})</h2>
                    <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    {items.length === 0 ? (
                        <p style={{ color: '#666', textAlign: 'center', marginTop: '3rem' }}>Your cart is empty</p>
                    ) : (
                        items.map(item => (
                            <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #1a1a1a' }}>
                                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ color: '#fff', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.95rem' }}>{item.name}</p>
                                    <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'capitalize' }}>{item.collection} · {item.category}</p>
                                    <p style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '4px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Minus size={12} />
                                        </button>
                                        <span style={{ color: '#fff', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '4px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Plus size={12} />
                                        </button>
                                        <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', marginLeft: 'auto' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                            <span style={{ color: '#aaa', fontSize: '1rem' }}>Grand Total</span>
                            <span style={{ color: 'var(--gold-primary)', fontWeight: 700, fontSize: '1.3rem' }}>₹{total.toLocaleString('en-IN')}</span>
                        </div>
                        <button onClick={handleBuyWhatsApp} className="btn-primary" style={{ width: '100%', fontSize: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            🛒 Order via WhatsApp
                        </button>
                        <button onClick={clearCart} style={{ width: '100%', marginTop: '0.7rem', background: 'none', border: '1px solid #333', color: '#888', padding: '0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
