'use client';

import { useState, useRef, useCallback } from 'react';

interface SpeechChunk {
    id: string;
    text: string;
    timestamp: Date;
}

interface UseSpeechRecognitionReturn {
    isListening: boolean;
    currentText: string;
    chunks: SpeechChunk[];
    startListening: () => void;
    stopListening: () => void;
    clearChunks: () => void;
    error: string | null;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
    const [isListening, setIsListening] = useState(false);
    const [currentText, setCurrentText] = useState('');
    const [chunks, setChunks] = useState<SpeechChunk[]>([]);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);
    const currentChunkRef = useRef<string>('');
    const isManualStopRef = useRef<boolean>(false);

    const startListening = useCallback(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setError('Speech recognition is not supported in this browser');
            return;
        }

        // Reset manual stop flag
        isManualStopRef.current = false;

        const startRecognition = () => {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                setError(null);
                if (currentChunkRef.current === '') {
                    setCurrentText('');
                }
            };

            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (finalTranscript) {
                    currentChunkRef.current += finalTranscript;
                    setCurrentText(currentChunkRef.current);
                } else {
                    setCurrentText(currentChunkRef.current + interimTranscript);
                }
            };

            recognition.onerror = (event: any) => {
                console.log('Speech recognition error:', event.error);
                // Only show error for critical errors, not silence/no-speech
                if (event.error === 'no-speech' || event.error === 'audio-capture') {
                    // These are not critical errors, just restart
                    if (!isManualStopRef.current) {
                        setTimeout(() => {
                            if (!isManualStopRef.current) {
                                startRecognition();
                            }
                        }, 100);
                    }
                } else {
                    setError(`Speech recognition error: ${event.error}`);
                    setIsListening(false);
                }
            };

            recognition.onend = () => {
                // Only stop if it was manually stopped
                if (isManualStopRef.current) {
                    setIsListening(false);
                } else {
                    // Auto-restart if not manually stopped
                    setTimeout(() => {
                        if (!isManualStopRef.current) {
                            startRecognition();
                        }
                    }, 100);
                }
            };

            recognitionRef.current = recognition;
            recognition.start();
        };

        startRecognition();
    }, []);

    const stopListening = useCallback(() => {
        // Set manual stop flag
        isManualStopRef.current = true;

        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);

            // Save current chunk if there's any text
            if (currentChunkRef.current.trim()) {
                const newChunk: SpeechChunk = {
                    id: Date.now().toString(),
                    text: currentChunkRef.current.trim(),
                    timestamp: new Date(),
                };
                setChunks(prev => [...prev, newChunk]);
                currentChunkRef.current = '';
                setCurrentText('');
            }
        }
    }, []);

    const clearChunks = useCallback(() => {
        setChunks([]);
        setCurrentText('');
        currentChunkRef.current = '';
        // Reset manual stop flag when clearing chunks
        isManualStopRef.current = false;
    }, []);

    return {
        isListening,
        currentText,
        chunks,
        startListening,
        stopListening,
        clearChunks,
        error,
    };
};

// Extend Window interface for TypeScript
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}
