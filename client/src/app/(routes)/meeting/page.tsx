'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Trash2, Play, Square } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export default function MeetingPage() {
    const {
        isListening,
        currentText,
        chunks,
        startListening,
        stopListening,
        clearChunks,
        error,
    } = useSpeechRecognition();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    MOMify Meeting
                </h1>
            </div>

            <div className="container mx-auto px-6 py-8 max-w-4xl">
                {/* Microphone Controls */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-4">
                        {!isListening ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startListening}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
                            >
                                <Mic className="w-6 h-6" />
                                Start Recording
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={stopListening}
                                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
                            >
                                <Square className="w-6 h-6" />
                                Stop Recording
                            </motion.button>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={clearChunks}
                            className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                            title="Clear all chunks"
                        >
                            <Trash2 className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="text-center mb-6">
                    {isListening && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 text-green-400"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-3 h-3 bg-green-400 rounded-full"
                            />
                            Listening...
                        </motion.div>
                    )}
                    {error && (
                        <div className="text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Current Text Display Box */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-300">Current Speech</h2>
                    <motion.div
                        layout
                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 min-h-[200px] max-h-[300px] overflow-y-auto"
                    >
                        {currentText ? (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-white leading-relaxed"
                            >
                                {currentText}
                            </motion.p>
                        ) : (
                            <p className="text-gray-500 italic">
                                {isListening ? 'Speak now...' : 'Click "Start Recording" to begin'}
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* Chunks Display */}
                {chunks.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-300">
                                Speech Chunks ({chunks.length})
                            </h2>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {chunks.map((chunk, index) => (
                                <motion.div
                                    key={chunk.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm text-gray-400">
                                            Chunk {index + 1}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {chunk.timestamp.toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="text-white leading-relaxed">
                                        {chunk.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-12 text-center">
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-300 mb-2">How to use:</h3>
                        <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Click "Start Recording" to begin speech recognition</li>
                            <li>• Speak clearly into your microphone</li>
                            <li>• Click "Stop Recording" to save the current chunk</li>
                            <li>• Each chunk is saved separately for easy management</li>
                            <li>• Use the trash icon to clear all chunks</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
