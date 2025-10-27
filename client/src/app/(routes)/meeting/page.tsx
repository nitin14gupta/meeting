'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Trash2, Play, Square, FileText, Download, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { generateMeetingSummary, generateQuickSummary, MeetingSummary } from '@/services/geminiService';
import Image from 'next/image';

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

    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [meetingSummary, setMeetingSummary] = useState<MeetingSummary | null>(null);
    const [quickSummary, setQuickSummary] = useState<string>('');
    const [summaryError, setSummaryError] = useState<string>('');

    const handleGenerateSummary = async () => {
        if (chunks.length === 0) {
            setSummaryError('No speech chunks available. Please record some speech first.');
            return;
        }

        setIsGeneratingSummary(true);
        setSummaryError('');

        try {
            const chunkTexts = chunks.map(chunk => chunk.text);
            const summary = await generateMeetingSummary(chunkTexts);
            setMeetingSummary(summary);
        } catch (error) {
            setSummaryError(error instanceof Error ? error.message : 'Failed to generate summary');
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const handleGenerateQuickSummary = async () => {
        if (chunks.length === 0) {
            setSummaryError('No speech chunks available. Please record some speech first.');
            return;
        }

        setIsGeneratingSummary(true);
        setSummaryError('');

        try {
            const chunkTexts = chunks.map(chunk => chunk.text);
            const summary = await generateQuickSummary(chunkTexts);
            setQuickSummary(summary);
        } catch (error) {
            setSummaryError(error instanceof Error ? error.message : 'Failed to generate quick summary');
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const downloadSummary = () => {
        if (!meetingSummary) return;

        const content = `
MEETING MINUTES
===============

Title: ${meetingSummary.title}

Summary:
${meetingSummary.summary}

Key Points:
${meetingSummary.keyPoints.map(point => `• ${point}`).join('\n')}

Decisions:
${meetingSummary.decisions.map(decision => `• ${decision}`).join('\n')}

Action Items:
${meetingSummary.actionItems.map(item => `• ${item}`).join('\n')}

Next Steps:
${meetingSummary.nextSteps.map(step => `• ${step}`).join('\n')}

Participants:
${meetingSummary.participants.map(participant => `• ${participant}`).join('\n')}

Generated on: ${new Date().toLocaleString()}
        `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meeting-minutes-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-center">
                <Image src="/logo.png" alt="MOMify Meeting" width={100} height={100} />
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

                        {/* Summary Generation Buttons */}
                        {chunks.length > 0 && (
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleGenerateSummary}
                                    disabled={isGeneratingSummary}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
                                >
                                    {isGeneratingSummary ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <FileText className="w-4 h-4" />
                                    )}
                                    Generate MOM
                                </motion.button>
                            </div>
                        )}
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

                {/* Summary Error */}
                {summaryError && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6"
                    >
                        <p className="text-red-400 text-sm">{summaryError}</p>
                    </motion.div>
                )}

                {/* Quick Summary */}
                {quickSummary && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h2 className="text-xl font-semibold mb-4 text-gray-300">Quick Summary</h2>
                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                            <p className="text-green-100 leading-relaxed">{quickSummary}</p>
                        </div>
                    </motion.div>
                )}

                {/* Meeting Summary (MOM) */}
                {meetingSummary && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-300">Meeting Minutes (MOM)</h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={downloadSummary}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </motion.button>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 space-y-6">
                            {/* Title */}
                            <div>
                                <h3 className="text-lg font-semibold text-blue-300 mb-2">Title</h3>
                                <p className="text-white">{meetingSummary.title}</p>
                            </div>

                            {/* Summary */}
                            <div>
                                <h3 className="text-lg font-semibold text-blue-300 mb-2">Summary</h3>
                                <p className="text-gray-200 leading-relaxed">{meetingSummary.summary}</p>
                            </div>

                            {/* Key Points */}
                            <div>
                                <h3 className="text-lg font-semibold text-blue-300 mb-2">Key Points</h3>
                                <ul className="space-y-1">
                                    {meetingSummary.keyPoints.map((point, index) => (
                                        <li key={index} className="text-gray-200 flex items-start">
                                            <span className="text-blue-400 mr-2">•</span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Decisions */}
                            <div>
                                <h3 className="text-lg font-semibold text-blue-300 mb-2">Decisions</h3>
                                <ul className="space-y-1">
                                    {meetingSummary.decisions.map((decision, index) => (
                                        <li key={index} className="text-gray-200 flex items-start">
                                            <span className="text-green-400 mr-2">✓</span>
                                            {decision}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action Items */}
                            <div>
                                <h3 className="text-lg font-semibold text-blue-300 mb-2">Action Items</h3>
                                <ul className="space-y-1">
                                    {meetingSummary.actionItems.map((item, index) => (
                                        <li key={index} className="text-gray-200 flex items-start">
                                            <span className="text-yellow-400 mr-2">→</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Next Steps */}
                            <div>
                                <h3 className="text-lg font-semibold text-blue-300 mb-2">Next Steps</h3>
                                <ul className="space-y-1">
                                    {meetingSummary.nextSteps.map((step, index) => (
                                        <li key={index} className="text-gray-200 flex items-start">
                                            <span className="text-purple-400 mr-2">▶</span>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Participants */}
                            <div>
                                <h3 className="text-lg font-semibold text-blue-300 mb-2">Participants</h3>
                                <div className="flex flex-wrap gap-2">
                                    {meetingSummary.participants.map((participant, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-900/30 text-blue-200 px-3 py-1 rounded-full text-sm"
                                        >
                                            {participant}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
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
                            <li>• Use "Generate MOM" for detailed meeting minutes with AI</li>
                            <li>• Use "Quick Summary" for a brief overview</li>
                            <li>• Download the full meeting minutes as a text file</li>
                            <li>• Use the trash icon to clear all chunks</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
