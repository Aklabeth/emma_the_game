// ==========================================
// EMMA THE DOGGO - Web Audio Synthesizer
// 100% self-contained: no external MP3/WAV needed!
// ==========================================

class SoundManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.musicPlaying = false;
        this.musicTimer = null;
        this.musicStep = 0;
        this.masterVolume = 0.28;
        this.realBarkBuffer = null;
        this.isBarkLoading = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.loadRealBark();
    }

    loadRealBark() {
        if (this.realBarkBuffer || this.isBarkLoading) return;
        this.isBarkLoading = true;

        if (window.REAL_DOG_BARK_BASE64 && this.ctx) {
            try {
                const binaryString = atob(window.REAL_DOG_BARK_BASE64);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                this.ctx.decodeAudioData(bytes.buffer.slice(0), (buffer) => {
                    this.realBarkBuffer = buffer;
                }, (err) => {
                    // Fallback to HTML Audio element if decode fails
                    console.warn('Real bark decode info:', err);
                });
            } catch (e) {
                console.warn('Real bark load info:', e);
            }
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopMusic();
        } else {
            this.startMusic();
        }
        return this.isMuted;
    }

    // --- Emma's Bark ("WUFF!") with Authentic Real Dog Sound ---
    playBark(isSuper = false) {
        if (this.isMuted) return;
        this.init();

        let playedReal = false;

        // 1. Play real dog bark from decoded Web Audio buffer (low latency)
        if (this.realBarkBuffer && this.ctx) {
            try {
                const now = this.ctx.currentTime;
                const src = this.ctx.createBufferSource();
                src.buffer = this.realBarkBuffer;

                // Subtle natural pitch variance (or higher pitch for Super Bark)
                const pitch = isSuper ? 1.22 : (0.95 + Math.random() * 0.1);
                src.playbackRate.setValueAtTime(pitch, now);

                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(isSuper ? 0.9 * this.masterVolume * 2.5 : 0.8 * this.masterVolume * 2.2, now);

                src.connect(gain);
                gain.connect(this.ctx.destination);
                src.start(now);
                playedReal = true;
            } catch (e) {
                playedReal = false;
            }
        }

        // 2. Fallback: play via HTML5 Audio element if buffer not decoded yet
        if (!playedReal) {
            try {
                const audio = new Audio('dog_bark.ogg');
                audio.volume = Math.min(1.0, this.masterVolume * 2.2);
                audio.playbackRate = isSuper ? 1.22 : (0.95 + Math.random() * 0.1);
                audio.play().catch(() => {});
                playedReal = true;
            } catch (e) {}
        }

        if (isSuper) {
            // Magical shimmer overtone
            this.playChime(660, 0.2);
            this.playChime(880, 0.25);
        }
    }

    // --- Jump Sound ---
    playJump() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.16);

        gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
    }

    // --- Bone Collect Chime ---
    playBoneCollect() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        const playBell = (freq, delay) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + delay);

            gain.gain.setValueAtTime(0.25 * this.masterVolume, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + delay);
            osc.stop(now + delay + 0.26);
        };

        playBell(659.25, 0);     // E5
        playBell(987.77, 0.07);  // B5
    }

    // --- Golden Super Bone ---
    playGoldenBone() {
        if (this.isMuted) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playChime(freq, 0.35);
            }, idx * 60);
        });
    }

    // --- Sausage Collect (Health restore) ---
    playSausageCollect() {
        if (this.isMuted) return;
        this.init();
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((f, i) => {
            setTimeout(() => this.playChime(f, 0.22), i * 50);
        });
    }

    // --- Trampoline Boing ---
    playBoing() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(680, now + 0.25);

        gain.gain.setValueAtTime(0.4 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.31);
    }

    // --- Enemy Defeated (Poof) ---
    playEnemyPoof() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Comical slide down
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);

        gain.gain.setValueAtTime(0.22 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        // Lowpass filter for softness
        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(900, now);

        osc.connect(lp);
        lp.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.21);
    }

    // --- Player Hurt (Whine) ---
    playHurt() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.22);

        gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(800, now);

        osc.connect(lp);
        lp.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.26);
    }

    // --- Level Complete Fanfare ---
    playVictory() {
        if (this.isMuted) return;
        this.init();
        const fanfare = [
            { f: 523.25, d: 0.12, pause: 0 },
            { f: 659.25, d: 0.12, pause: 130 },
            { f: 783.99, d: 0.12, pause: 260 },
            { f: 1046.50, d: 0.35, pause: 400 },
            { f: 880.00, d: 0.15, pause: 800 },
            { f: 1046.50, d: 0.55, pause: 980 },
        ];
        fanfare.forEach(note => {
            setTimeout(() => {
                this.playChime(note.f, note.d, 'square', 0.25);
            }, note.pause);
        });
    }

    // --- Game Over Jingle ---
    playGameOver() {
        if (this.isMuted) return;
        this.init();
        const notes = [
            { f: 440, t: 0 },
            { f: 415.3, t: 200 },
            { f: 392, t: 400 },
            { f: 349.2, t: 650 }
        ];
        notes.forEach(n => {
            setTimeout(() => this.playChime(n.f, 0.3, 'sawtooth', 0.18), n.t);
        });
    }

    // Generic chime generator
    playChime(freq, duration = 0.2, type = 'sine', volumeScale = 1.0) {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.2 * this.masterVolume * volumeScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.05);
    }

    // --- Cheerful Dynamic Chiptune BGM ---
    startMusic() {
        if (this.isMuted || this.musicPlaying) return;
        this.init();
        this.musicPlaying = true;
        this.musicStep = 0;

        // Upbeat, cute melody sequence (C major happy theme)
        // [Pitch in Hz or 0 for rest, bass note, drum type]
        const melody = [
            // Bar 1
            { note: 523.25, bass: 130.81, drum: 'kick' }, // C5
            { note: 0,      bass: 0,      drum: null },
            { note: 659.25, bass: 130.81, drum: 'hat' },  // E5
            { note: 783.99, bass: 0,      drum: null },  // G5
            { note: 880.00, bass: 174.61, drum: 'snare' },// A5 (F bass)
            { note: 783.99, bass: 0,      drum: null },  // G5
            { note: 659.25, bass: 174.61, drum: 'hat' },  // E5
            { note: 587.33, bass: 0,      drum: null },  // D5

            // Bar 2
            { note: 523.25, bass: 146.83, drum: 'kick' }, // C5 (D bass)
            { note: 587.33, bass: 0,      drum: null },  // D5
            { note: 659.25, bass: 146.83, drum: 'hat' },  // E5
            { note: 523.25, bass: 0,      drum: null },  // C5
            { note: 587.33, bass: 196.00, drum: 'snare' },// D5 (G bass)
            { note: 0,      bass: 0,      drum: null },
            { note: 659.25, bass: 196.00, drum: 'hat' },  // E5
            { note: 783.99, bass: 0,      drum: null },  // G5

            // Bar 3
            { note: 880.00, bass: 130.81, drum: 'kick' }, // A5
            { note: 1046.5, bass: 0,      drum: null },  // C6
            { note: 880.00, bass: 130.81, drum: 'hat' },  // A5
            { note: 783.99, bass: 0,      drum: null },  // G5
            { note: 659.25, bass: 174.61, drum: 'snare' },// E5
            { note: 587.33, bass: 0,      drum: null },  // D5
            { note: 523.25, bass: 174.61, drum: 'hat' },  // C5
            { note: 440.00, bass: 0,      drum: null },  // A4

            // Bar 4
            { note: 523.25, bass: 196.00, drum: 'kick' }, // C5 (G bass)
            { note: 587.33, bass: 0,      drum: null },  // D5
            { note: 659.25, bass: 196.00, drum: 'hat' },  // E5
            { note: 783.99, bass: 0,      drum: null },  // G5
            { note: 1046.5, bass: 130.81, drum: 'snare' },// C6
            { note: 0,      bass: 0,      drum: null },
            { note: 783.99, bass: 130.81, drum: 'hat' },  // G5
            { note: 0,      bass: 0,      drum: null }
        ];

        const stepTime = 135; // ms per 16th note

        this.musicTimer = setInterval(() => {
            if (this.isMuted) return;
            const current = melody[this.musicStep % melody.length];
            const now = this.ctx.currentTime;

            // Melody tone
            if (current.note > 0) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(current.note, now);

                gain.gain.setValueAtTime(0.07 * this.masterVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + (stepTime / 1000) * 0.9);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + (stepTime / 1000));
            }

            // Bass note
            if (current.bass > 0) {
                const bOsc = this.ctx.createOscillator();
                const bGain = this.ctx.createGain();
                bOsc.type = 'sawtooth';
                bOsc.frequency.setValueAtTime(current.bass, now);

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(250, now);

                bGain.gain.setValueAtTime(0.08 * this.masterVolume, now);
                bGain.gain.exponentialRampToValueAtTime(0.001, now + (stepTime / 1000) * 1.5);

                bOsc.connect(filter);
                filter.connect(bGain);
                bGain.connect(this.ctx.destination);

                bOsc.start(now);
                bOsc.stop(now + (stepTime / 1000) * 1.6);
            }

            // Drum beat
            if (current.drum === 'kick') {
                const kOsc = this.ctx.createOscillator();
                const kGain = this.ctx.createGain();
                kOsc.frequency.setValueAtTime(120, now);
                kOsc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

                kGain.gain.setValueAtTime(0.12 * this.masterVolume, now);
                kGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

                kOsc.connect(kGain);
                kGain.connect(this.ctx.destination);
                kOsc.start(now);
                kOsc.stop(now + 0.09);
            } else if (current.drum === 'snare') {
                const sOsc = this.ctx.createOscillator();
                const sGain = this.ctx.createGain();
                sOsc.type = 'triangle';
                sOsc.frequency.setValueAtTime(180, now);
                sGain.gain.setValueAtTime(0.06 * this.masterVolume, now);
                sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

                sOsc.connect(sGain);
                sGain.connect(this.ctx.destination);
                sOsc.start(now);
                sOsc.stop(now + 0.08);
            }

            this.musicStep++;
        }, stepTime);
    }

    stopMusic() {
        if (this.musicTimer) {
            clearInterval(this.musicTimer);
            this.musicTimer = null;
        }
        this.musicPlaying = false;
    }
}

window.sounds = new SoundManager();
