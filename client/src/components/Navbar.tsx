'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex-shrink-0"
                    >
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            MOMify
                        </Link>
                    </motion.div>

                    {/* Navigation Links */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <motion.a
                                href="#features"
                                whileHover={{ scale: 1.05 }}
                                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
                            >
                                Features
                            </motion.a>
                            <motion.a
                                href="#about"
                                whileHover={{ scale: 1.05 }}
                                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
                            >
                                About
                            </motion.a>
                            <motion.a
                                href="#contact"
                                whileHover={{ scale: 1.05 }}
                                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
                            >
                                Contact
                            </motion.a>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href="/meeting"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                        >
                            Start Meeting
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    );
}
