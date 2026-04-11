import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
    title: "Glow of Joe | Handmade Jewelry",
    description: "High quality handmade jewelry for men, women, and kids. All India delivery available. Support on WhatsApp.",
};

import { Providers } from "../components/Providers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <Header />
                    <main style={{ paddingTop: '80px' }}>
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
