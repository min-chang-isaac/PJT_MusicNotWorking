export default function TrackList({ tracks, currentIndex, onSelect }) {
    return (
        <ol>
            {tracks.map((t, i) => (
                <li key={t.id} style={{ marginBottom: 6 }}>
                    <button
                        onClick={() => onSelect(i)}
                        style={{ fontWeight: i === currentIndex ? "bold" : "normal" }}
                    >
                        {i === currentIndex ? "♪ " : ""}
                        {t.title}
                    </button>
                </li>
            ))}
        </ol>
    );
}