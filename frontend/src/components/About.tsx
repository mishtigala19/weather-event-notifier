"use client";
import React, { useRef, useEffect, useState } from "react";

const About: React.FC = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined" || !cardRef.current) return;

        let timeoutId: NodeJS.Timeout | null = null;

        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (timeoutId) clearTimeout(timeoutId);
                // Debounce state change to avoid flicker
                timeoutId = setTimeout(() => {
                    setVisible(entry.isIntersecting);
                }, 80);
            },
            { threshold: 0.3 }
        );

        observer.observe(cardRef.current);

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, []);

    return (
        <section id="about" className="py-20 bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-100">
            <div
                ref={cardRef}
                className={`relative max-w-5xl mx-auto px-8 py-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200
          transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}
        `}
                style={{ willChange: "opacity, transform" }}
            >
                <div className="flex justify-center mb-6">
                    <span className="inline-block w-20 h-1 rounded bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-400"></span>
                </div>
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-4 tracking-tight">
                    About Weather Event Notifier
                </h2>
                <p className="text-lg text-gray-700 text-center mb-6 font-medium">
                    Stay ahead of the weather, always.
                </p>
                <p className="text-base text-gray-600 text-center mb-3">
                    <span className="font-semibold text-blue-700">Weather Event Notifier</span> is a modern web application designed to keep you informed about significant weather events in your area.
                    <br />
                    Receive timely, reliable alerts for heat waves, storms, rain, and more; delivered directly to your inbox or phone.
                </p>
                <p className="text-base text-gray-600 text-center">
                    With location based customization and flexible notification options, you’re always in control.
                </p>
                <p className="text-base text-gray-600 text-center">
                    Our mission is to ensure you never miss a critical weather update, helping you make safer and smarter decisions every day.
                </p>
            </div>
        </section>
    );
};

export default About;
