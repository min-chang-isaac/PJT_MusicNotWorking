import PlayerControls from "./components/PlayerControls.jsx";
import TrackList from "./components/TrackList.jsx";
import { TRACKS } from "./data/tracks.js";
import { useAudioPlayer } from "./hooks/useAudioPlayer.js";

export default function App() {
  const { audioRef, current, index, isPlaying, setIndex, play, pause, next, prev } =
    useAudioPlayer(TRACKS);

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Local Player</h1>

      <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Now Playing</div>
          <div style={{ fontSize: 18 }}>{current?.title ?? "(no track)"}</div>
        </div>

        <PlayerControls
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onPrev={prev}
          onNext={next}
        />

        {/* 実体はHTMLAudio。SPAでも最小で鳴らせる */}
        <audio ref={audioRef} controls style={{ width: "100%", marginTop: 12 }} />
      </div>

      <h2 style={{ marginTop: 24 }}>Tracks</h2>
      <TrackList tracks={TRACKS} currentIndex={index} onSelect={setIndex} />
    </div>
  );
}