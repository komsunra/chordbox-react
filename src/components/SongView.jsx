import React from "react";
import { transposeLine } from "../utils/transpose";

export default function SongView({ song, keyShift, onTranspose, onBack, isDesktop }) {
  if (!song) {
    return (
      <div className="p-4" style={{ fontFamily: "'Bai Jamjuree', sans-serif" }}>
        <div className="alert alert-secondary" role="alert">
          เลือกเพลงจากรายการ
        </div>
      </div>
    );
  }

  const renderChordLine = (line) => {
    if (/\[?[A-G][#b]?\]?/.test(line)) {
      const transposedLine = transposeLine(line, keyShift);
      return transposedLine.replace(
        /\[([A-G][#b]?m?(maj7|sus4|dim|add9)?)\]/g,
        (_, chord) => `<span class='txt-chord'>${chord}</span>`
      );
    }
    return line;
  };

  return (
    <>
      {/* ✅ Action Bar เฉพาะมือถือ */}
      {!isDesktop && (
        <div
          className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm"
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "#000",
            color: "#fff",
            zIndex: 5000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {/* 🎵 ชื่อเพลง */}
          <h3
            className="song-title mb-0 text-truncate"
            style={{
              fontWeight: 700,
              fontSize: "1.4rem",
              color: "#fff",
              fontFamily: "'Bai Jamjuree', sans-serif",
              maxWidth: "80%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {song.title} ({song.artist})
          </h3>

          {/* ❌ ปุ่มปิด */}
          <button
            className="btn btn-sm border-0 text-white"
            style={{
              background: "transparent",
              fontSize: "1.5rem",
              lineHeight: "1",
            }}
            onClick={onBack}
            title="ปิดหน้าจอ"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* 🎵 เนื้อเพลง */}
      <div
        className="overflow-hidden songview-container"
        style={{ fontFamily: "'Bai Jamjuree', sans-serif" }}
      >
        {/* Header (desktop เท่านั้น) */}
        {isDesktop && (
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex flex-column mb-2">
              <h3
                className="song-title"
                style={{ fontWeight: 700, marginBottom: "0 !important" }}
              >
                {song.title} ({song.artist})
              </h3>
            </div>
          </div>
        )}

        {/* เนื้อเพลง */}
        <div
          style={{
            overflowX: "auto",
            whiteSpace: "pre",
            minWidth: "800px",
            fontFamily: "'Bai Jamjuree', sans-serif",
            fontSize: "1.1em",
          }}
          dangerouslySetInnerHTML={{
            __html: song.content.split("\n").map(renderChordLine).join("\n"),
          }}
        />
      </div>

      {/* 🎹 ปุ่ม Transpose แบบ Floating เฉพาะมือถือ */}
      { (
        <div
          style={{
            position: "fixed",
            top: "100px",
            right: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            zIndex: 5100,
          }}
        >
          {/* ♯ เพิ่มคีย์ */}
          <button
            className="btn btn-dark rounded-circle shadow"
            style={{
              width: "50px",
              height: "50px",
              fontSize: "1.3rem",
              backgroundColor: "#222",
              color: "#fff",
            }}
            onClick={() => onTranspose(1)}
            title="เพิ่มคีย์ขึ้นครึ่งเสียง (♯)"
          >
            ♯
          </button>

          {/* 🔄 รีเซ็ต */}
          <button
            className="btn btn-secondary rounded-circle shadow"
            style={{
              width: "50px",
              height: "50px",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
            onClick={() => onTranspose(-keyShift)}
            title={`Reset key (ปัจจุบัน: ${keyShift >= 0 ? `+${keyShift}` : keyShift})`}
          >
            {keyShift !== 0 ? (keyShift > 0 ? `+${keyShift}` : keyShift) : "0"}
          </button>

          {/* ♭ ลดคีย์ */}
          <button
            className="btn btn-dark rounded-circle shadow"
            style={{
              width: "50px",
              height: "50px",
              fontSize: "1.3rem",
              backgroundColor: "#222",
              color: "#fff",
            }}
            onClick={() => onTranspose(-1)}
            title="ลดคีย์ลงครึ่งเสียง (♭)"
          >
            ♭
          </button>
        </div>
      )}
    </>
  );
}
