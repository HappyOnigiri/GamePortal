export declare class AudioEngine {
    private ctx;
    private masterGain;
    private isInitialized;
    private notes;
    init(): Promise<void>;
    playNote(intensity: number, panning: number): void;
    resume(): void;
}
//# sourceMappingURL=audio.d.ts.map