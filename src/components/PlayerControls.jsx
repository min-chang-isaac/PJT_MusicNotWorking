export default function PlayerControls({ isPlaying, onPlay, onPause, onPrev, onNext }) {
    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={onPrev}>◀︎</button>
            {!isPlaying ? (
                <button onClick={onPlay}>▶︎</button>
            ) : (
                <button onClick={onPause}>⏸</button>
            )}
            <button onClick={onNext}>▶︎▶︎</button>
        </div>
    );
}