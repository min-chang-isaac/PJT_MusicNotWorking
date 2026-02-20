import { useState, useEffect, useRef } from "react";

const TRACKS = [
  {
    id: 1,
    title: "ランニング",
    artist: "BUMP OF CHICKEN",
    mood: "ちから", //
    src: "/audio/chikara.flac",
  },
  {
    id: 2,
    title: "集中モード",
    artist: "Utada Hikaru",
    mood: "Focus", //
    src: "/audio/focus.mp3",
  },
  {
    id: 3,
    title: "流す",
    artist: "Various Artists",
    mood: "melancholy", //
    src: "/audio/nagasu.mp3",
  },
];


function App() {
  const audioRef = useRef(null); //<audio>を参照
  const [currentIndex, setCurrentIndex] = useState(0); //再生中の曲 
  const [isPlaying, setIsPlaying] = useState(false); //再生、停止
  const [progress, setProgress] = useState(0); //再生位置
  const [currentTime, setCurrentTime] = useState(0); //現在秒数
  const [duration, setDuration] = useState(0); // 曲の長さ

  const currentTrack = TRACKS[currentIndex];

  //曲が変わると自動再生
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    //曲ソースが変わるとリセット
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      audio.play().catch(() => {

        setIsPlaying(false);
      });
    } else {
      audio.pause();

    }
  }, [currentIndex, isPlaying]);

  // 再生・一時停止ボタン
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  // 次の曲
  const playNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  // 前の曲
  const playPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? TRACKS.length - 1 : prev - 1
    );
    setIsPlaying(true);
  };

  // 再生位置が変化したとき（timeupdateイベント）
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const { currentTime, duration } = audio;

    setCurrentTime(currentTime);
    setDuration(duration || 0);

    if (duration) {
      setProgress((currentTime / duration) * 100);
    } else {
      setProgress(0);
    }
  };

  // 再生バーをドラッグしてシーク
  const handleSeek = (event) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const value = Number(event.target.value);
    const newTime = (value / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(value);
  };

  // 曲が終わったら自動で次へ
  const handleEnded = () => {
    playNext();
  };

  // 秒を mm:ss に変換
  const formatTime = (sec) => {
    if (!sec || Number.isNaN(sec)) return "00:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>Local Mood Player</h1>

      <div style={styles.playerCard}>
        {/* 現在のトラック情報 */}
        <div style={styles.trackInfo}>
          <div style={styles.trackTitle}>{currentTrack.title}</div>
          <div style={styles.trackMeta}>
            <span>{currentTrack.artist}</span>
            <span style={styles.moodBadge}>{currentTrack.mood}</span>
          </div>
        </div>

        {/* 再生バー */}
        <div style={styles.progressRow}>
          <span style={styles.timeText}>
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            style={styles.slider}
          />
          <span style={styles.timeText}>
            {formatTime(duration)}
          </span>
        </div>

        {/* コントロールボタン */}
        <div style={styles.controls}>
          <button style={styles.button} onClick={playPrev}>
            ◀︎
          </button>
          <button style={styles.mainButton} onClick={togglePlay}>
            {isPlaying ? "⏸ Pause" : "▶︎ Play"}
          </button>
          <button style={styles.button} onClick={playNext}>
            ▶︎
          </button>
        </div>
      </div>

      {/* プレイリスト */}
      <div style={styles.playlist}>
        <h2 style={styles.subTitle}>Playlist</h2>
        <ul style={styles.list}>
          {TRACKS.map((track, index) => (
            <li
              key={track.id}
              style={{
                ...styles.listItem,
                ...(index === currentIndex
                  ? styles.listItemActive
                  : {}),
              }}
              onClick={() => {
                setCurrentIndex(index);
                setIsPlaying(true);
              }}
            >
              <div>
                <div style={styles.listTitle}>{track.title}</div>
                <div style={styles.listMeta}>
                  {track.artist} · {track.mood}
                </div>
              </div>
              {index === currentIndex && (
                <span style={styles.nowPlayingBadge}>
                  Now
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 実際の <audio> 要素 */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}

// 気合いを入れないインラインスタイル
const styles = {
  app: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "32px 16px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "24px",
  },
  playerCard: {
    width: "100%",
    maxWidth: "480px",
    background: "#020617",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    marginBottom: "24px",
  },
  trackInfo: {
    marginBottom: "16px",
  },
  trackTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "4px",
  },
  trackMeta: {
    display: "flex",
    gap: "8px",
    fontSize: "12px",
    color: "#9ca3af",
    alignItems: "center",
  },
  moodBadge: {
    padding: "2px 8px",
    borderRadius: "999px",
    background: "#1d4ed8",
    color: "#dbeafe",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  progressRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  },
  slider: {
    flex: 1,
    cursor: "pointer",
  },
  timeText: {
    fontSize: "11px",
    color: "#9ca3af",
    width: "40px",
    textAlign: "center",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
  },
  button: {
    padding: "8px 12px",
    borderRadius: "999px",
    border: "1px solid #4b5563",
    background: "#020617",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: "14px",
  },
  mainButton: {
    padding: "8px 20px",
    borderRadius: "999px",
    border: "none",
    background:
      "linear-gradient(135deg, #22c55e, #16a34a, #22c55e)",
    color: "#ecfdf5",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  playlist: {
    width: "100%",
    maxWidth: "480px",
  },
  subTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    background: "transparent",
  },
  listItemActive: {
    background: "#111827",
  },
  listTitle: {
    fontWeight: "500",
  },
  listMeta: {
    fontSize: "11px",
    color: "#9ca3af",
  },
  nowPlayingBadge: {
    fontSize: "10px",
    color: "#bbf7d0",
    borderRadius: "999px",
    border: "1px solid #22c55e",
    padding: "2px 8px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
};

export default App;