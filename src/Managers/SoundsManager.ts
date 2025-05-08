import { Howl, Howler } from 'howler';

const ambients: Record<string, boolean> = {
    'Main_menu_ambient_sound.mp3': true,
    'Round_ambient_sound.mp3': true
};

export class SoundsManager {
  private static instance: SoundsManager;
  private sounds: Map<string, Howl> = new Map();
  private prevSound: Howl;

  private constructor() {}

  public static getInstance(): SoundsManager {
    if (!SoundsManager.instance) {
        SoundsManager.instance = new SoundsManager();
    }
    return SoundsManager.instance;
  }

  public load(name: string, src: string, options?: { volume?: number, loop: boolean }): void {
    const sound = new Howl({ src: [src], ...options, });
    this.sounds.set(name, sound);
  }

  public play(name: string): void {
    const sound = this.sounds.get(name);
    if (sound && !sound.playing()) {
        if (this.prevSound && ambients.hasOwnProperty(name) && this.prevSound.playing()) this.prevSound.stop();
        sound.play();
        this.prevSound = sound;
    }
  }

  public stop(name: string): void {
    const sound = this.sounds.get(name);
    if (sound) {
        sound.stop();
    }
  }

  public setVolume(volume: number) {
    Howler.volume(volume);
  }

  public mute(mute: boolean): void {
    Howler.mute(mute);
  }
}
