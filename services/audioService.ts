export interface SpeechOptions {
    text: string;
    voice?: SpeechSynthesisVoice | null;
    rate?: number; // 0.1 to 10
    pitch?: number; // 0 to 2
    volume?: number; // 0 to 1
    onEnd?: () => void;
    onStart?: () => void;
    onPause?: () => void;
    onResume?: () => void;
    onError?: (e: any) => void;
}

class AudioService {
    private synth: SpeechSynthesis;
    private voices: SpeechSynthesisVoice[] = [];
    private currentUtterance: SpeechSynthesisUtterance | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.synth = window.speechSynthesis;
            this.loadVoices();
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = this.loadVoices.bind(this);
            }
        } else {
            // Fallback for SSR
            this.synth = {} as any;
        }
    }

    private loadVoices() {
        this.voices = this.synth.getVoices();
    }

    getVoices(): SpeechSynthesisVoice[] {
        // Ensure we have latest voices
        if (this.voices.length === 0) {
            this.voices = this.synth.getVoices();
        }
        return this.voices;
    }

    speak(options: SpeechOptions) {
        if (!this.synth) return;

        // Cancel current speaking
        this.stop();

        const utterance = new SpeechSynthesisUtterance(options.text);

        // Preference for Portuguese/Brazil voices if available and no voice selected
        if (!options.voice) {
            const ptVoice = this.voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt'));
            if (ptVoice) utterance.voice = ptVoice;
        } else {
            utterance.voice = options.voice;
        }

        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;

        // Event Listeners
        if (options.onStart) utterance.onstart = options.onStart;
        if (options.onEnd) utterance.onend = options.onEnd;
        if (options.onPause) utterance.onpause = options.onPause;
        if (options.onResume) utterance.onresume = options.onResume;
        if (options.onError) utterance.onerror = options.onError;

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
    }

    pause() {
        if (this.synth && this.synth.speaking) {
            this.synth.pause();
        }
    }

    resume() {
        if (this.synth && this.synth.paused) {
            this.synth.resume();
        }
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
            this.currentUtterance = null;
        }
    }

    isSpeaking(): boolean {
        return this.synth ? this.synth.speaking : false;
    }

    isPaused(): boolean {
        return this.synth ? this.synth.paused : false;
    }
}

export const audioService = new AudioService();
