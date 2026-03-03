import { useEffect, useMemo, useRef, useState } from "react";

export function useAudioPlayer(tracks) {
    const audioRef = useRef(null);
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const current = useMemo(() => tracks[index] ?? null, [tracks, index]);

    useEffect(() => {
        // 曲が変わったら source を差し替える
        const audio = audioRef.current;
        if (!audio || !current) return;
        audio.src = current.src;

        // 連続再生したいならここで play を再開
        if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    }, [current, isPlaying]);

    const play = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    };

    const pause = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.pause();
        setIsPlaying(false);
    };

    const next = () => setIndex((i) => (i + 1) % tracks.length);
    const prev = () => setIndex((i) => (i - 1 + tracks.length) % tracks.length);

    return { audioRef, current, index, isPlaying, setIndex, play, pause, next, prev };
}