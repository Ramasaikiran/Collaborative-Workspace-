import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/utils';

export default function VoiceTaskInput({ onInput }) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setIsSupported(false);
        }
    }, []);

    const toggleListening = () => {
        if (!isSupported) {
            alert("Voice input is not supported in this browser. Try Chrome or Edge.");
            return;
        }

        if (isListening) {
            setIsListening(false);
            window.speechRecognition?.stop();
        } else {
            setIsListening(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                onInput(transcript);
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            window.speechRecognition = recognition;
            recognition.start();
        }
    };

    if (!isSupported) {
        return (
            <Button type="button" variant="secondary" size="sm" disabled className="gap-2 opacity-50 cursor-not-allowed" title="Voice input not supported in this browser">
                <MicOff className="w-4 h-4" /> Voice Input
            </Button>
        );
    }

    return (
        <Button
            type="button"
            variant={isListening ? "destructive" : "secondary"}
            size="sm"
            onClick={toggleListening}
            className={cn("gap-2 transition-all", isListening && "animate-pulse")}
            title="Click to speak task details"
        >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isListening ? "Listening..." : "Voice Input"}
        </Button>
    );
}
