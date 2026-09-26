import { useCallback, useRef, useState } from "react";

interface SpeechRecogEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error?: { error: string };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecogEvent) => void) | null;
  onerror: ((event: SpeechRecogEvent) => void) | null;
  onend: (() => void) | null;
}

const SpeechRecognitionAPI =
  (window as any).SpeechRecognition ||
  (window as any).webkitSpeechRecognition;


export function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");

  const supported = typeof SpeechRecognitionAPI !== "undefined";

  const start = useCallback(
    (lang: string = "en-US") => {
      if (!supported) return;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      finalTranscriptRef.current = "";

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onresult = (event: SpeechRecogEvent) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript + " ";
          } else {
            interim += result[0].transcript;
          }
        }
        if (final) {
          finalTranscriptRef.current += final;
          setTranscript(finalTranscriptRef.current);
        }
        if (interim) {
          setTranscript(finalTranscriptRef.current + interim);
        }
      };

      recognition.onerror = () => {
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
      setTranscript("");
    },
    [supported]
  );

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = "";
    setTranscript("");
  }, []);

  return {
    start,
    stop,
    listening,
    transcript,
    resetTranscript,
    supported,
  };
}
