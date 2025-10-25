'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
    {
        icon: '🎙️',
        title: 'Record Speech in Real Time',
        description: 'High-quality audio recording with noise cancellation and automatic gain control.'
    },
    {
        icon: '💬',
        title: 'Live Transcription',
        description: 'Real-time speech-to-text conversion with support for multiple languages and accents.'
    },
    {
        icon: '🧠',
        title: 'AI-Powered MOM Summaries',
        description: 'Intelligent summarization using advanced AI to extract key points and action items.'
    },
    {
        icon: '🌐',
        title: 'Supports Multiple Languages',
        description: 'Break language barriers with support for 50+ languages and dialects.'
    }
];

export default function FeaturesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="features" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Powerful Features
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Everything you need to transform your meetings into actionable insights
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            whileHover={{
                                scale: 1.05,
                                y: -10,
                                transition: { duration: 0.2 }
                            }}
                            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-all duration-300"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
