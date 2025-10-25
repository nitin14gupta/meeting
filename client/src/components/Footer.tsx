'use client';

import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <motion.h3
                            whileHover={{ scale: 1.05 }}
                            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
                        >
                            MOMify
                        </motion.h3>
                        <p className="text-gray-400 mb-4">
                            Turn your conversations into smart meeting notes with AI-powered transcription and summarization.
                        </p>
                        <p className="text-sm text-gray-500">
                            Built with ❤️ using React, Three.js & Gemini AI
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <motion.a
                                    href="#features"
                                    whileHover={{ x: 5 }}
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    Features
                                </motion.a>
                            </li>
                            <li>
                                <motion.a
                                    href="#about"
                                    whileHover={{ x: 5 }}
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    About
                                </motion.a>
                            </li>
                            <li>
                                <motion.a
                                    href="#contact"
                                    whileHover={{ x: 5 }}
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    Contact
                                </motion.a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="text-center md:text-left">
                        <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <motion.a
                                    href="#privacy"
                                    whileHover={{ x: 5 }}
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    Privacy Policy
                                </motion.a>
                            </li>
                            <li>
                                <motion.a
                                    href="#terms"
                                    whileHover={{ x: 5 }}
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    Terms of Service
                                </motion.a>
                            </li>
                            <li>
                                <motion.a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ x: 5 }}
                                    className="text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    GitHub
                                </motion.a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        © 2024 MOMify. All rights reserved.
                    </p>
                </div>
            </div>
        </motion.footer>
    );
}
