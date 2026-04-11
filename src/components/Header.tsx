"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, Search } from 'lucide-react';
import styles from './Header.module.css';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { data: session } = useSession();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const isAdmin = (session?.user as any)?.role === "ADMIN";

    useEffect(() => {
        if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100);
        else { setQuery(''); setResults([]); }
    }, [searchOpen]);

    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                const filtered = (data.products || []).filter((p: any) =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.collection?.toLowerCase().includes(query.toLowerCase()) ||
                    p.category?.toLowerCase().includes(query.toLowerCase()) ||
                    p.description?.toLowerCase().includes(query.toLowerCase())
                );
                setResults(filtered.slice(0, 8));
            } catch { setResults([]); }
            setSearching(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <button onClick={toggleSidebar} className={styles.menuButton} aria-label="Menu">
                        <Menu size={28} />
                    </button>

                    <Link href="/" className={styles.logoContainer}>
                        <img src="/logo.png" alt="Glow of Joe Logo" className={styles.logoImage} />
                    </Link>

                    <button onClick={() => setSearchOpen(true)} className={styles.menuButton} aria-label="Search">
                        <Search size={24} />
                    </button>
                </div>
            </header>

            {/* Search Overlay */}
            {searchOpen && (
                <div className={styles.searchOverlay}>
                    <div className={styles.searchBox}>
                        <div className={styles.searchInputRow}>
                            <Search size={20} className={styles.searchIcon} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search products, collections..."
                                className={styles.searchInput}
                            />
                            <button onClick={() => setSearchOpen(false)} className={styles.closeButton}><X size={22} /></button>
                        </div>
                        <div className={styles.searchResults}>
                            {searching && <p className={styles.searchHint}>Searching...</p>}
                            {!searching && query && results.length === 0 && <p className={styles.searchHint}>No results found for "{query}"</p>}
                            {!searching && !query && <p className={styles.searchHint}>Start typing to search products...</p>}
                            {results.map(p => (
                                <Link key={p.id} href={`/product/${p.id}`} className={styles.searchResultItem} onClick={() => setSearchOpen(false)}>
                                    <img src={p.image} alt={p.name} className={styles.searchResultImg} />
                                    <div>
                                        <p className={styles.searchResultName}>{p.name}</p>
                                        <p className={styles.searchResultMeta}>{p.collection} · ₹{p.price.toLocaleString('en-IN')}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar Overlay */}
            <div
                className={`${styles.overlay} ${isSidebarOpen ? styles.overlayOpen : ''}`}
                onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Glow of Joe</h2>
                    <button onClick={toggleSidebar} className={styles.closeButton} aria-label="Close menu">
                        <X size={28} />
                    </button>
                </div>

                <nav className={styles.sidebarNav}>
                    <Link href="/" onClick={toggleSidebar}>Home</Link>
                    <Link href="/#collections" onClick={toggleSidebar}>Shop by Collection</Link>
                    <Link href="/#categories" onClick={toggleSidebar}>Men, Women & Kids</Link>
                    <Link href="/#features" onClick={toggleSidebar}>Why Choose Us</Link>

                    <div className={styles.sidebarDivider} />

                    {isAdmin && (
                        <Link href="/admin" onClick={toggleSidebar} className={styles.adminLink}>
                            Admin Dashboard
                        </Link>
                    )}

                    {isAdmin && (
                        <button
                            onClick={() => { signOut(); toggleSidebar(); }}
                            className={styles.logoutButton}
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </>
    );
}
