"use client";

import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import { Package, ShoppingBag, Tag, Layers } from 'lucide-react';

type Tab = 'products' | 'categories' | 'collections' | 'orders';

function NewOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data.orders || []);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this order?')) return;
        await fetch('/api/orders', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        fetchOrders();
    };

    if (loading) return <p style={{ color: '#aaa' }}>Loading orders...</p>;
    if (!orders.length) return <p style={{ color: '#aaa' }}>No orders yet.</p>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {orders.map(o => (
                <div key={o.id} style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                        <span style={{ color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                            {new Date(o.createdAt).toLocaleString('en-IN')}
                        </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem 1.5rem', fontSize: '0.88rem' }}>
                        <div><span style={{ color: '#888' }}>Name: </span><span style={{ color: '#fff' }}>{o.customerName}</span></div>
                        <div><span style={{ color: '#888' }}>Phone: </span><span style={{ color: '#fff' }}>{o.phone}</span></div>
                        <div><span style={{ color: '#888' }}>Email: </span><span style={{ color: '#fff' }}>{o.email}</span></div>
                        <div><span style={{ color: '#888' }}>Pincode: </span><span style={{ color: '#fff' }}>{o.pincode}</span></div>
                        <div style={{ gridColumn: '1/-1' }}><span style={{ color: '#888' }}>Address: </span><span style={{ color: '#fff' }}>{o.address}, {o.city}, {o.state}, {o.country}{o.landmark ? ` (${o.landmark})` : ''}</span></div>
                        <div style={{ gridColumn: '1/-1', borderTop: '1px solid #222', marginTop: '0.4rem', paddingTop: '0.6rem' }} />
                        <div><span style={{ color: '#888' }}>Product No: </span><span style={{ color: '#fff' }}>{o.productNumber}</span></div>
                        <div><span style={{ color: '#888' }}>Product: </span><span style={{ color: '#fff' }}>{o.productName}</span></div>
                        <div><span style={{ color: '#888' }}>Collection: </span><span style={{ color: '#fff' }}>{o.collection}</span></div>
                        <div><span style={{ color: '#888' }}>Category: </span><span style={{ color: '#fff' }}>{o.category}</span></div>
                        {o.material && <div><span style={{ color: '#888' }}>Material: </span><span style={{ color: '#fff' }}>{o.material}</span></div>}
                        {o.weight && <div><span style={{ color: '#888' }}>Weight: </span><span style={{ color: '#fff' }}>{o.weight}</span></div>}
                        {o.size && <div><span style={{ color: '#888' }}>Size: </span><span style={{ color: '#fff' }}>{o.size}</span></div>}
                        <div><span style={{ color: '#888' }}>Qty: </span><span style={{ color: '#fff' }}>{o.quantity}</span></div>
                        <div><span style={{ color: '#888' }}>Price/item: </span><span style={{ color: '#fff' }}>₹{o.pricePerItem.toLocaleString('en-IN')}</span></div>
                        <div><span style={{ color: '#888' }}>Total: </span><span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>₹{o.totalAmount.toLocaleString('en-IN')}</span></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AdminDashboard() {
    const [tab, setTab] = useState<Tab>('products');
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentImages, setCurrentImages] = useState<string[]>([]);

    // Category form
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryLabel, setNewCategoryLabel] = useState('');
    const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
    const [editingCatId, setEditingCatId] = useState<string | null>(null);
    const [editCatLabel, setEditCatLabel] = useState('');
    const [editCatImage, setEditCatImage] = useState<File | null>(null);

    // Collection form
    const [newCollectionName, setNewCollectionName] = useState('');
    const [newCollectionImage, setNewCollectionImage] = useState<File | null>(null);
    const [editingColId, setEditingColId] = useState<string | null>(null);
    const [editColName, setEditColName] = useState('');
    const [editColImage, setEditColImage] = useState<File | null>(null);

    // Product form states
    const [name, setName] = useState('');
    const [productNumber, setProductNumber] = useState('');
    const [category, setCategory] = useState('');
    const [collection, setCollection] = useState('');
    const [price, setPrice] = useState('');
    const [isNew, setIsNew] = useState(true);
    const [inStock, setInStock] = useState(true);
    const [image, setImage] = useState<File | null>(null);
    const [extraImages, setExtraImages] = useState<(File | null)[]>([null, null, null, null]);

    // Extra fields
    const [description, setDescription] = useState('');
    const [material, setMaterial] = useState('');
    const [weight, setWeight] = useState('');
    const [size, setSize] = useState('');
    const [stockCount, setStockCount] = useState('1');
    const [careInstructions, setCareInstructions] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchCollections();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (data.products) setProducts(data.products);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (data.categories) {
                setCategories(data.categories);
                if (data.categories.length > 0) setCategory(data.categories[0].name);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCollections = async () => {
        try {
            const res = await fetch('/api/collections');
            const data = await res.json();
            if (data.collections) {
                setCollections(data.collections);
                if (data.collections.length > 0) setCollection(data.collections[0].name);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newCategoryName);
            formData.append('label', newCategoryLabel);
            if (newCategoryImage) formData.append('image', newCategoryImage);
            const res = await fetch('/api/categories', { method: 'POST', body: formData });
            if (res.ok) {
                setNewCategoryName('');
                setNewCategoryLabel('');
                setNewCategoryImage(null);
                fetchCategories();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Delete this category?')) return;
        await fetch('/api/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        fetchCategories();
    };

    const handleAddCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newCollectionName);
            if (newCollectionImage) formData.append('image', newCollectionImage);
            const res = await fetch('/api/collections', { method: 'POST', body: formData });
            if (res.ok) {
                setNewCollectionName('');
                setNewCollectionImage(null);
                fetchCollections();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCollection = async (id: string) => {
        if (!confirm('Delete this collection?')) return;
        await fetch('/api/collections', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        fetchCollections();
    };

    const handleEditCategory = async (id: string) => {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('label', editCatLabel);
        if (editCatImage) formData.append('image', editCatImage);
        const res = await fetch('/api/categories', { method: 'PUT', body: formData });
        if (res.ok) { setEditingCatId(null); setEditCatImage(null); fetchCategories(); }
    };

    const handleEditCollection = async (id: string) => {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', editColName);
        if (editColImage) formData.append('image', editColImage);
        const res = await fetch('/api/collections', { method: 'PUT', body: formData });
        if (res.ok) { setEditingColId(null); setEditColImage(null); fetchCollections(); }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setProductNumber('');
        setCategory(categories[0]?.name || '');
        setCollection(collections[0]?.name || '');
        setPrice('');
        setIsNew(true);
        setInStock(true);
        setImage(null);
        setExtraImages([null, null, null, null]);
        setCurrentImages([]);
        setDescription('');
        setMaterial('');
        setWeight('');
        setSize('');
        setStockCount('1');
        setCareInstructions('');
        setMessage('');
    };

    const startEdit = (product: any) => {
        setEditingId(product.id);
        setName(product.name);
        setProductNumber(product.productNumber || '');
        setCategory(product.category);
        setCollection(product.collection);
        setPrice(product.price.toString());
        setIsNew(product.isNew);
        setInStock(product.inStock ?? true);
        setDescription(product.description || '');
        setMaterial(product.material || '');
        setWeight(product.weight || '');
        setSize(product.size || '');
        setStockCount(product.stock?.toString() || '1');
        setCareInstructions(product.careInstructions || '');
        setImage(null);
        setExtraImages([null, null, null, null]);
        let imgs: string[] = [];
        try { imgs = JSON.parse(product.images || '[]'); } catch { imgs = []; }
        if (!imgs.length && product.image) imgs = [product.image];
        setCurrentImages(imgs);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessage("Product deleted!");
                fetchProducts();
            }
        } catch (err) {
            setMessage("Error deleting product.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (editingId) {
                // Edit Mode
                const formData = new FormData();
                formData.append('name', name);
                formData.append('productNumber', productNumber);
                formData.append('category', category);
                formData.append('collection', collection);
                formData.append('price', price);
                formData.append('isNew', String(isNew));
                formData.append('inStock', String(inStock));
                formData.append('description', description);
                formData.append('material', material);
                formData.append('weight', weight);
                formData.append('size', size);
                formData.append('stock', stockCount);
                formData.append('careInstructions', careInstructions);
                if (image) formData.append('images', image);
                extraImages.forEach(f => { if (f) formData.append('images', f); });

                const res = await fetch(`/api/products/${editingId}`, {
                    method: 'PUT',
                    body: formData,
                });
                if (res.ok) {
                    setMessage('Product updated successfully!');
                    fetchProducts();
                    resetForm();
                } else {
                    const data = await res.json();
                    setMessage(data.error || 'Update failed');
                }
            } else {
                // Add Mode
                const formData = new FormData();
                formData.append('name', name);
                formData.append('productNumber', productNumber);
                formData.append('category', category);
                formData.append('collection', collection);
                formData.append('price', price);
                formData.append('isNew', String(isNew));
                formData.append('inStock', String(inStock));
                formData.append('description', description);
                formData.append('material', material);
                formData.append('weight', weight);
                formData.append('size', size);
                formData.append('stock', stockCount);
                formData.append('careInstructions', careInstructions);
                if (image) formData.append('images', image);
                extraImages.forEach(f => { if (f) formData.append('images', f); });

                const res = await fetch('/api/products', {
                    method: 'POST',
                    body: formData,
                });

                if (res.ok) {
                    setMessage('Product added successfully!');
                    fetchProducts();
                    resetForm();
                } else {
                    const data = await res.json();
                    setMessage(data.error || 'Failed to add product');
                }
            }
        } catch (err: any) {
            setMessage('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const navItems: { key: Tab; label: string; icon: React.ReactNode }[] = [
        { key: 'products', label: 'Products', icon: <Package size={18} /> },
        { key: 'categories', label: 'Categories', icon: <Tag size={18} /> },
        { key: 'collections', label: 'Collections', icon: <Layers size={18} /> },
        { key: 'orders', label: 'New Orders', icon: <ShoppingBag size={18} /> },
    ];

    return (
        <div className={styles.adminWrapper}>
            {/* Sidebar */}
            <div className={styles.adminSidebar}>
                {navItems.map(item => (
                    <button
                        key={item.key}
                        onClick={() => setTab(item.key)}
                        className={`${styles.sidebarItem} ${tab === item.key ? styles.sidebarItemActive : ''}`}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className={styles.adminMain}>

                {tab === 'orders' && (
                    <div className={styles.card}>
                        <h2 style={{ color: 'var(--gold-primary)', marginBottom: '1.5rem' }}>New Orders</h2>
                        <NewOrders />
                    </div>
                )}

                {tab === 'products' && <div className={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ color: 'var(--gold-primary)', margin: 0 }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                        {editingId && <button onClick={resetForm} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Cancel Edit</button>}
                    </div>

                    {message && <div className={styles.alert}>{message}</div>}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.rowGroup}>
                            <div className={styles.formGroup}>
                                <label>Product Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Gold Anklet" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Product Number</label>
                                <input type="text" value={productNumber} onChange={e => setProductNumber(e.target.value)} placeholder="e.g. GZ-001" />
                            </div>
                        </div>

                        <div className={styles.rowGroup}>
                            <div className={styles.formGroup}>
                                <label>Price (₹)</label>
                                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 1500" required />
                            </div>
                        </div>

                        <div className={styles.rowGroup}>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <select value={category} onChange={e => setCategory(e.target.value)}>
                                    {categories.map(c => <option key={c.id} value={c.name}>{c.label}</option>)}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Collection</label>
                                <select value={collection} onChange={e => setCollection(e.target.value)}>
                                    {collections.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px', padding: '0.5rem' }} />
                        </div>

                        <div className={styles.rowGroup}>
                            <div className={styles.formGroup}>
                                <label>Material</label>
                                <input type="text" value={material} onChange={e => setMaterial(e.target.value)} placeholder="e.g. 18k Gold Plated" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Weight</label>
                                <input type="text" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 15g" />
                            </div>
                        </div>

                        <div className={styles.rowGroup}>
                            <div className={styles.formGroup}>
                                <label>Size / Fit</label>
                                <input type="text" value={size} onChange={e => setSize(e.target.value)} placeholder="e.g. Adjustable" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Initial Stock Count</label>
                                <input type="number" value={stockCount} onChange={e => setStockCount(e.target.value)} />
                            </div>
                        </div>

                        <div className={styles.rowGroup} style={{ gap: '2rem' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input type="checkbox" checked={isNew} onChange={e => setIsNew(e.target.checked)} />
                                    New Arrival
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
                                    In Stock
                                </label>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Product Images <span style={{ color: '#888', fontSize: '0.8rem' }}>{editingId ? '(upload new to replace existing)' : '(up to 5 — first is main)'}</span></label>
                            {editingId && currentImages.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                                    {currentImages.map((src, i) => (
                                        <div key={i} style={{ position: 'relative' }}>
                                            <img src={src} alt={`current ${i}`} style={{ height: '60px', width: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #444' }} />
                                            <span style={{ position: 'absolute', top: '-4px', left: '2px', fontSize: '0.6rem', color: '#aaa' }}>{i === 0 ? 'main' : `#${i + 1}`}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {[0, 1, 2, 3, 4].map(i => {
                                    const file = i === 0 ? image : extraImages[i - 1];
                                    return (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <span style={{ color: '#888', fontSize: '0.8rem', minWidth: '60px' }}>{i === 0 ? (editingId ? 'New Main' : 'Main *') : `Extra ${i}`}</span>
                                            <input
                                                type="file" accept="image/*"
                                                required={i === 0 && !editingId}
                                                onChange={e => {
                                                    const f = e.target.files?.[0] || null;
                                                    if (i === 0) setImage(f);
                                                    else setExtraImages(prev => { const n = [...prev]; n[i - 1] = f; return n; });
                                                }}
                                            />
                                            {file && <img src={URL.createObjectURL(file)} alt={`preview ${i}`} style={{ height: '50px', width: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem' }}>
                            {loading ? 'Processing...' : (editingId ? 'Update Product' : 'Add Product')}
                        </button>
                    </form>
                </div>}

                {tab === 'categories' && <div className={styles.card}>
                    <h2 style={{ color: 'var(--gold-primary)', marginBottom: '1.5rem' }}>Manage Categories</h2>
                    <form onSubmit={handleAddCategory} className={styles.form}>
                        <div className={styles.rowGroup}>
                            <div className={styles.formGroup}>
                                <label>Name (slug)</label>
                                <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="e.g. women" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Label</label>
                                <input type="text" value={newCategoryLabel} onChange={e => setNewCategoryLabel(e.target.value)} placeholder="e.g. Women's Collection" required />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Category Image</label>
                            <input type="file" accept="image/*" onChange={e => setNewCategoryImage(e.target.files?.[0] || null)} />
                            {newCategoryImage && <img src={URL.createObjectURL(newCategoryImage)} alt="preview" style={{ height: '80px', marginTop: '0.5rem', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />}
                        </div>
                        <button type="submit" className="btn-primary">Add Category</button>
                    </form>
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {categories.map(c => (
                            <div key={c.id} style={{ background: '#111', padding: '0.7rem 1rem', borderRadius: '6px', border: '1px solid #222' }}>
                                {editingCatId === c.id ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            {c.image && <img src={c.image} alt={c.label} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #333' }} />}
                                            <input value={editCatLabel} onChange={e => setEditCatLabel(e.target.value)} style={{ flex: 1, background: '#1a1a1a', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '0.4rem 0.6rem' }} />
                                        </div>
                                        <input type="file" accept="image/*" onChange={e => setEditCatImage(e.target.files?.[0] || null)} style={{ fontSize: '0.8rem' }} />
                                        {editCatImage && <img src={URL.createObjectURL(editCatImage)} alt="preview" style={{ height: '60px', objectFit: 'cover', borderRadius: '4px' }} />}
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEditCategory(c.id)} className="btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Save</button>
                                            <button onClick={() => setEditingCatId(null)} className="btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            {c.image && <img src={c.image} alt={c.label} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #333' }} />}
                                            <span style={{ color: '#fff' }}>{c.label} <span style={{ color: '#666', fontSize: '0.8rem' }}>({c.name})</span></span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => { setEditingCatId(c.id); setEditCatLabel(c.label); setEditCatImage(null); }} className={styles.editBtn}>Edit</button>
                                            <button onClick={() => handleDeleteCategory(c.id)} className={styles.deleteBtn}>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>}

                {tab === 'collections' && <div className={styles.card}>
                    <h2 style={{ color: 'var(--gold-primary)', marginBottom: '1.5rem' }}>Manage Collections</h2>
                    <form onSubmit={handleAddCollection} className={styles.form}>
                        <div className={styles.rowGroup}>
                            <div className={styles.formGroup}>
                                <label>Collection Name</label>
                                <input type="text" value={newCollectionName} onChange={e => setNewCollectionName(e.target.value)} placeholder="e.g. necklaces" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Collection Image</label>
                                <input type="file" accept="image/*" onChange={e => setNewCollectionImage(e.target.files?.[0] || null)} />
                            </div>
                        </div>
                        {newCollectionImage && <img src={URL.createObjectURL(newCollectionImage)} alt="preview" style={{ height: '80px', marginBottom: '0.5rem', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />}
                        <button type="submit" className="btn-primary">Add Collection</button>
                    </form>
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {collections.map(c => (
                            <div key={c.id} style={{ background: '#111', padding: '0.7rem 1rem', borderRadius: '6px', border: '1px solid #222' }}>
                                {editingColId === c.id ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            {c.image && <img src={c.image} alt={c.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #333' }} />}
                                            <input value={editColName} onChange={e => setEditColName(e.target.value)} style={{ flex: 1, background: '#1a1a1a', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '0.4rem 0.6rem' }} />
                                        </div>
                                        <input type="file" accept="image/*" onChange={e => setEditColImage(e.target.files?.[0] || null)} style={{ fontSize: '0.8rem' }} />
                                        {editColImage && <img src={URL.createObjectURL(editColImage)} alt="preview" style={{ height: '60px', objectFit: 'cover', borderRadius: '4px' }} />}
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEditCollection(c.id)} className="btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Save</button>
                                            <button onClick={() => setEditingColId(null)} className="btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            {c.image && <img src={c.image} alt={c.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #333' }} />}
                                            <span style={{ color: '#fff', textTransform: 'capitalize' }}>{c.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => { setEditingColId(c.id); setEditColName(c.name); setEditColImage(null); }} className={styles.editBtn}>Edit</button>
                                            <button onClick={() => handleDeleteCollection(c.id)} className={styles.deleteBtn}>Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>}

                {tab === 'products' && <div className={styles.card}>
                    <h2 style={{ color: 'var(--gold-primary)', marginBottom: '1.5rem' }}>Manage Inventory</h2>
                    <div className={styles.productList}>
                        {products.map(p => (
                            <div key={p.id} className={styles.productListItem}>
                                <img src={p.image} alt={p.name} className={styles.listImage} />
                                <div className={styles.listInfo}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h4 style={{ margin: 0 }}>{p.name}</h4>
                                        {!p.inStock && <span style={{ fontSize: '0.6rem', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '1px 3px', borderRadius: '4px' }}>OUT OF STOCK</span>}
                                    </div>
                                    <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>₹{p.price.toLocaleString('en-IN')} | {p.collection} | {p.stock} left</p>
                                </div>
                                <div className={styles.actions}>
                                    <button onClick={() => startEdit(p)} className={styles.editBtn}>Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className={styles.deleteBtn}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>}

            </div>
        </div>
    );
}
