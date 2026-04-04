import React from "react";
import Hero from "../components/Hero";
import Collections from "../components/Collections";
import Categories from "../components/Categories";
import Features from "../components/Features";
import FAQ from "../components/FAQ";
import NewArrivals from "../components/NewArrivals";
import { prisma } from "../lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
    let latestArrivals: any[] = [];
    try {
        latestArrivals = await prisma.product.findMany({
            where: { isNew: true },
            orderBy: { createdAt: 'desc' },
            take: 4
        });
    } catch (err) {
        console.error("Database not ready yet:", err);
    }

    return (
        <>
            <Hero />
            <NewArrivals products={latestArrivals} />
            <Collections />
            <Categories />
            <Features />
            <FAQ />
        </>
    );
}
