"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './FAQ.module.css';

const faqs = [
    {
        question: "What materials are used in your jewelry?",
        answer: "Our handmade jewelry is crafted using pure, high-quality materials — ensuring every piece is genuine, long-lasting, and true to the feel of fine jewelry."
    },
    {
        question: "How durable is the jewelry?",
        answer: "Each piece is designed for longevity. The anti-tarnish coating ensures everyday durability. With proper care—such as avoiding direct contact with harsh chemicals and perfumes—your jewelry will maintain its glowing shine for years."
    },
    {
        question: "Do you offer Pan India delivery?",
        answer: "Yes, we proudly offer safe and secure delivery all over India. You will receive a tracking link as soon as your order is dispatched."
    },
    {
        question: "How can I contact customer support?",
        answer: "We offer 24/7 customer support via WhatsApp. You can reach out to us for any queries regarding your order, styling advice, or custom requests."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        if (openIndex === index) {
            setOpenIndex(null);
        } else {
            setOpenIndex(index);
        }
    };

    return (
        <section className="section-container" id="faq">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className={styles.faqContainer}>
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
                    >
                        <button
                            className={styles.questionButton}
                            onClick={() => toggleFAQ(index)}
                            aria-expanded={openIndex === index}
                        >
                            <span className={styles.questionText}>{faq.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className={styles.icon} />
                            ) : (
                                <ChevronDown className={styles.icon} />
                            )}
                        </button>
                        <div className={styles.answerContainer}>
                            <p className={styles.answerText}>{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
