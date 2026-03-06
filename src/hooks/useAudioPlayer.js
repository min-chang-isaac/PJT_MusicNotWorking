import { useEffect, useMemo, useRef, useState } from "react";

export function useAudioPlayer(tracks) {
    const audioRef = useRef(null);
    const sleepTimeoutRef = useRef(null);


    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [sleepMinutes, setSleepMinutes] = useState(null);

    const current = useMemo(() => tracks[index] ?? null, [tracks, index]);

    useEffect(() => {
        // 曲が変わったら source を差し替える
        const audio = audioRef.current;
        if (!audio || !current) return;

        audio.src = current.src;
        audio.loop = isLooping;

        // 連続再生したいならここで play を再開
        if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    }, [current, isPlaying, isLooping]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.loop = isLooping;

    }, [isLooping]);

    const play = () => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
    };

    const pause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.pause();
        setIsPlaying(false);
    };

    const next = () => {
        if (!tracks?.length) return;
        setIndex((i) => (i + 1) % tracks.length);
    };

    const prev = () => {
        if (!tracks?.length) return;
        setIndex((i) => (i - 1 + tracks.length) % tracks.length);
    };

    const toggleLoop = () => {
        setIsLooping((prev) => !prev);
    };

    const startSleepTimer = (minutes = 20) => {
        if (sleepTimeoutRef.current) {
            clearTimeout(sleepTimeoutRef.current);
        }

        setSleepMinutes(minutes);

        sleepTimeoutRef.current = setTimeout(() => {
            pause();
            setSleepMinutes(null);
            sleepTimeoutRef.current = null;
        }, minutes * 60 * 1000);
    };

    const cancelSleepTimer = () => {
        if (sleepTimeoutRef.current) {
            clearTimeout(sleepTimeoutRef.current);
            sleepTimeoutRef.current = null;
        }
        setSleepMinutes(null);
    };

    useEffect(() => {
        return () => {
            if (sleepTimeoutRef.current) {
                clearTimeout(sleepTimeoutRef.current);
            }
        };
    }, []);



    return {
        audioRef,
        current,
        index,
        isPlaying,
        setIndex,
        play,
        pause,
        next,
        prev,
        toggleLoop,
        startSleepTimer,
        cancelSleepTimer,

    };
}