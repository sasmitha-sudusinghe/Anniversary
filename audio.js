/**
 * Romantic Audio Engine with Christina Perri - "A Thousand Years"
 * Supports high-fidelity local MP3 playback with loop & smooth volume ramp,
 * plus Web Audio API sound effects (wax seal break, chimes, fireworks).
 */

class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    
    // Song metadata
    this.trackTitle = "A Thousand Years";
    this.artist = "Christina Perri";
    this.audioSrc = "assets/audio/a_thousand_years.mp3";
    
    // HTML5 Audio element for MP3 playback
    this.bgAudio = new Audio();
    this.bgAudio.src = this.audioSrc;
    this.bgAudio.loop = true;
    this.bgAudio.volume = 0.55;
    this.bgAudio.preload = "auto";
    
    // Fallback synth state
    this.fallbackTimerId = null;
    this.fallbackChordIndex = 0;
    this.fallbackStep = 0;
    this.usingFallback = false;
    
    // Melodic chord progression inspired by A Thousand Years (Bb - F - Gm - Eb)
    this.chordProgression = [
      [233.08, 293.66, 349.23, 466.16], // Bb
      [174.61, 261.63, 349.23, 440.00], // F
      [196.00, 293.66, 392.00, 466.16], // Gm
      [155.56, 233.08, 311.13, 392.00]  // Eb
    ];

    // Listeners for audio state
    this.bgAudio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.notifyStateChange(false);
    });

    this.bgAudio.addEventListener('error', (e) => {
      console.warn("Could not play audio file, using romantic synth fallback", e);
      this.usingFallback = true;
      if (this.isPlaying) {
        this.startFallbackSynth();
      }
    });
  }

  // Initialize Web Audio Context for sound effects
  initWebAudio() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Toggle playback
  async toggleMusic() {
    this.initWebAudio();

    if (this.isPlaying) {
      this.stopMusic();
      return false;
    } else {
      const success = await this.startMusic();
      return success;
    }
  }

  async startMusic() {
    this.initWebAudio();
    this.isPlaying = true;

    try {
      // Fade in volume smoothly
      this.bgAudio.volume = 0.05;
      await this.bgAudio.play();
      this.fadeVolume(0.55, 1200);
      return true;
    } catch (err) {
      console.warn("Audio play prevented or file error, using fallback synth:", err);
      this.usingFallback = true;
      this.startFallbackSynth();
      return true;
    }
  }

  stopMusic() {
    this.isPlaying = false;
    if (!this.usingFallback) {
      // Fade out volume before pausing
      this.fadeVolume(0.01, 400, () => {
        this.bgAudio.pause();
      });
    } else {
      this.stopFallbackSynth();
    }
  }

  fadeVolume(targetVolume, durationMs, onComplete) {
    const startVolume = this.bgAudio.volume;
    const startTime = performance.now();

    const ramp = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      this.bgAudio.volume = startVolume + (targetVolume - startVolume) * progress;

      if (progress < 1) {
        requestAnimationFrame(ramp);
      } else {
        if (onComplete) onComplete();
      }
    };

    requestAnimationFrame(ramp);
  }

  /* ==========================================================================
     FALLBACK PIANO SYNTHESIZER
     ========================================================================== */
  startFallbackSynth() {
    if (this.fallbackTimerId) return;
    this.fallbackChordIndex = 0;
    this.fallbackStep = 0;
    this.tickFallback();
  }

  stopFallbackSynth() {
    if (this.fallbackTimerId) {
      clearTimeout(this.fallbackTimerId);
      this.fallbackTimerId = null;
    }
  }

  tickFallback() {
    if (!this.isPlaying || !this.ctx) return;

    const chord = this.chordProgression[this.fallbackChordIndex];
    const pattern = [0, 1, 2, 3, 2, 1];
    const note = chord[pattern[this.fallbackStep % pattern.length]];

    this.playTone(note, 0.9, 0.15);

    if (this.fallbackStep === 0) {
      this.playTone(chord[0] / 2, 2.0, 0.12);
    }

    this.fallbackStep++;
    if (this.fallbackStep >= 6) {
      this.fallbackStep = 0;
      this.fallbackChordIndex = (this.fallbackChordIndex + 1) % this.chordProgression.length;
    }

    this.fallbackTimerId = setTimeout(() => this.tickFallback(), 420);
  }

  playTone(freq, duration = 1.0, volume = 0.2) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(volume * 0.3, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  /* ==========================================================================
     SOUND EFFECTS
     ========================================================================== */
  playWaxSealBreak() {
    this.initWebAudio();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.16);

    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.6, 0.12), i * 60);
    });
  }

  playChime(success = true) {
    this.initWebAudio();
    if (!this.ctx) return;
    if (success) {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((f, i) => {
        setTimeout(() => this.playTone(f, 0.5, 0.12), i * 80);
      });
    } else {
      this.playTone(392.00, 0.4, 0.1);
      setTimeout(() => this.playTone(349.23, 0.4, 0.1), 120);
    }
  }

  playFireworkPop() {
    this.initWebAudio();
    if (!this.ctx) return;
    const notes = [659.25, 783.99, 880.00, 1046.50, 1318.51];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.8, 0.08), i * 70);
    });
  }
}

window.romanticAudio = new RomanticAudioEngine();
