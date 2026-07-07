import { useCallback, useRef, useState } from "react";

const FEMALE_VOICE_PATTERNS = [
  "zira", "female", "google हिन्दी", "google हिंदी",
  "lekha", "heera", "hi-in", "hindi female",
  "samantha", "siri", "woman", "girl",
];

export function useTTS() {
  const [muted, setMuted] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<string[]>([]);
  const languageRef = useRef("en");
  const processingRef = useRef(false);

  const getVoice = useCallback((lang: string): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();

    const langCode = lang === "hi" || lang === "hiEn" ? "hi-IN" : "en-US";

    const femaleVoice = voices.find(
      (v) =>
        v.lang.startsWith(langCode) &&
        FEMALE_VOICE_PATTERNS.some((p) => v.name.toLowerCase().includes(p))
    );
    if (femaleVoice) return femaleVoice;

    const langFemale = voices.find(
      (v) =>
        v.lang.startsWith(langCode) &&
        (v.name.toLowerCase().includes("female") || v.name.includes("Zira"))
    );
    if (langFemale) return langFemale;

    const anyFemale = voices.find(
      (v) =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("samantha")
    );
    if (anyFemale) return anyFemale;

    const langVoice = voices.find((v) => v.lang.startsWith(langCode));
    if (langVoice) return langVoice;

    return voices[0] || null;
  }, []);

  const processQueue = useCallback(() => {
    if (processingRef.current || queueRef.current.length === 0) return;
    processingRef.current = true;

    const text = queueRef.current.shift()!;
    const synth = window.speechSynthesis;

    const isHindi = /[\u0900-\u097F]/.test(text) || languageRef.current === "hi" || languageRef.current === "hiEn";
    const lang = isHindi ? "hi-IN" : "en-US";

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    utterance.lang = lang;

    const voice = getVoice(isHindi ? "hi" : "en");
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      processingRef.current = false;
      if (queueRef.current.length > 0) processQueue();
    };
    utterance.onerror = () => {
      setSpeaking(false);
      processingRef.current = false;
      if (queueRef.current.length > 0) processQueue();
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  }, [getVoice]);

  const speak = useCallback(
    (text: string, lang?: string) => {
      if (muted || !text || typeof window === "undefined") return;
      window.speechSynthesis.cancel();
      queueRef.current = [];
      processingRef.current = false;

      const clean = text
        .replace(/[*_`•·‣⁃➤→●◆◇○▪▫–—·•★☆✅❌💡📋📊⏰⚡📱]/g, "")
        .replace(/\s+/g, " ")
        .replace(/[•·‣]/g, " ")
        .trim();

      if (!clean) return;

      languageRef.current = lang || (/[^\u0000-\u007F]/.test(clean) ? "hi" : "en");
      queueRef.current.push(clean);
      processQueue();
    },
    [muted, processQueue]
  );

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    queueRef.current = [];
    processingRef.current = false;
    setSpeaking(false);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      if (!prev) stop();
      return !prev;
    });
  }, [stop]);

  return { speak, stop, muted, toggleMute, speaking };
}
