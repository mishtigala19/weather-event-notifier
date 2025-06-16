"use client";
import React, { useState } from "react";

const faqData = [
    {
        question: "What types of weather alerts can I subscribe to?",
        answer: "You can subscribe to a variety of weather alerts, including heat warnings, rain forecasts, and extreme weather events such as storms or heavy snowfall. Our system allows you to choose the specific types of alerts that matter most to you."
    },
    {
        question: "How will I receive weather notifications?",
        answer: "You can choose to receive notifications via email or SMS. During subscription, simply provide your preferred contact information and select your alert delivery method. We use trusted services like Nodemailer for emails and Twilio for SMS to ensure timely delivery."
    },
    {
        question: "How often will I get weather alerts?",
        answer: "You can opt for either one-time alerts for specific events or set up recurring notifications based on your preferences. We check real-time weather data at user defined intervals and send alerts as soon as relevant conditions are detected."
    },
    {
        question: "Can I customize alerts for my location?",
        answer: "Absolutely! When you subscribe, you can enter your city or location to receive weather alerts that are tailored just for your area. This way, you’ll always get updates that are relevant to where you live or work."
    },
    {
        question: "Is my contact information safe and can I unsubscribe anytime?",
        answer: "Yes, your privacy is important to us. Your contact details are securely stored and used only for sending weather alerts. Every notification includes an unsubscribe link, and you can update or remove your subscription at any time."
    },
];

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (idx: number) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <section className="my-10">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Frequently Asked Questions</h2>
            <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-4">
                {faqData.map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-xl shadow-md transition hover:shadow-lg"
                    >
                        <button
                            onClick={() => toggle(idx)}
                            className={`flex items-center justify-between w-full px-6 py-4 text-lg font-semibold focus:outline-none transition-colors duration-300
                                ${openIndex === idx ? "text-blue-700" : "text-gray-600 hover:text-blue-700"}
                            `}
                            onBlur={e => e.target.blur()}


                        >
                            <span>{item.question}</span>
                            <span className={`transform transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""}`}>
                                ▼
                            </span>
                        </button>
                        {openIndex === idx && (
                            <div className="px-6 pb-4 text-base text-gray-500 animate-fadeIn">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
        </section>
    );
};

export default FAQ;
