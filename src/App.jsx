// src/App.jsx
import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import SongList from "./components/SongList";
import SongView from "./components/SongView";
import EditorModal from "./components/EditorModal";
import LoginForm from "./components/LoginForm";
import { fetchSongs, saveSong } from "./services/songService";
import "./css/App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [keyShift, setKeyShift] = useState(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editSong, setEditSong] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isDetail, setIsDetail] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  /** ✅ โหลด user จาก localStorage หากเคย login แล้ว */
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const storedUser = localStorage.getItem("user");
    if (jwt && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.warn("⚠️ เกิดปัญหาในการอ่านข้อมูล user");
      }
    }
  }, []);

  /** ✅ Monitor window resize */
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /** ✅ ฟังก์ชันแสดงแจ้งเตือน */
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  /** ✅ โหลดเพลงจาก Strapi หลัง login */
  useEffect(() => {
    if (!user) return;
    const loadSongs = async () => {
      const token = localStorage.getItem("jwt");
      const data = await fetchSongs(token);
      if (data) setSongs(data);
    };
    loadSongs();
  }, [user]);

  /** ✅ ฟิลเตอร์เพลงตามคำค้น */
  const filteredSongs = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase())
  );

  /** ✅ เมื่อเลือกเพลง */
  const handleSelect = (song) => {
    setSelected(song);
    if (windowWidth < 992) setIsDetail(true);
  };

  /** ✅ ออกจากระบบ */
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
  };

  /** ✅ toggle favorite และบันทึกลง Strapi */
  const handleToggleFavorite = async (songId) => {
    if (!user) return;

    const updatedFavorites = favorites.includes(songId)
      ? favorites.filter((id) => id !== songId)
      : [...favorites, songId];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`https://strapi.zector.myds.me/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ favorites: updatedFavorites }),
      });

      if (!res.ok) throw new Error("Failed to update favorites");

      const updatedUser = await res.json();
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  /** ✅ บันทึกเพลงใหม่หรืออัปเดต */
  const handleSave = async (newSong) => {
    const token = localStorage.getItem("jwt");
    const saved = await saveSong(newSong, token);
    if (!saved) {
      showNotification("เกิดข้อผิดพลาดในการบันทึกเพลง", "danger");
      return;
    }

    if (newSong.id) {
      setSongs((prev) => prev.map((s) => (s.id === saved.id ? saved : s)));
      if (selected?.id === saved.id) setSelected(saved);
    } else {
      setSongs((prev) => [...prev, saved]);
    }

    setIsEditorOpen(false);
    setEditSong(null);
    showNotification("บันทึกเพลงสำเร็จ!", "success");
  };

  const handleEdit = (song) => {
    setEditSong(song);
    setIsEditorOpen(true);
  };

  const isDesktop = windowWidth >= 992;

  /** ✅ ยังไม่ login */
  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <LoginForm
          onLogin={(u) => {
            setUser(u);
            localStorage.setItem("user", JSON.stringify(u));
          }}
        />
      </div>
    );
  }

  /** ✅ Layout หลัก */
  return (
    <div className="app-container">
      {/* 🔍 แถบค้นหา + สร้างเพลง + Logout */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        onCreate={() => {
          setEditSong(null);
          setIsEditorOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* 🔔 Toast Notification */}
      {notification.message && (
        <div
          className={`toast text-bg-${notification.type} border-0 position-fixed top-0 end-0 m-3 show`}
          role="alert"
          style={{ zIndex: 1055 }}
        >
          <div className="d-flex">
            <div className="toast-body">{notification.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setNotification({ message: "", type: "" })}
            />
          </div>
        </div>
      )}

      {/* 🧩 Layout Desktop / Mobile */}
      <div className="row app-main">
        {isDesktop ? (
          // 💻 Desktop Layout
          <>
            <div className="col-md-3 app-songlist">
              <SongList
                songs={filteredSongs}
                currentUser={user}
                favorites={favorites}
                onSelect={handleSelect}
                onToggleFavorite={handleToggleFavorite}
                onEdit={handleEdit}
                search={search}
                selected={selected}
                expandedDefault
              />
            </div>

            <div className="col-md-9 app-songview">
              <SongView
                song={selected}
                keyShift={keyShift}
                onTranspose={(n) => setKeyShift(keyShift + n)}
                isDesktop={true} // ✅ แสดงใน Desktop ไม่มีปุ่ม Back
              />
            </div>
          </>
        ) : (
          // 📱 Mobile Layout
          <div className="col-12 position-relative songlist-mobile">
            <SongList
              songs={filteredSongs}
              currentUser={user}
              favorites={favorites}
              onSelect={handleSelect}
              onToggleFavorite={handleToggleFavorite}
              onEdit={handleEdit}
              search={search}
              selected={selected}
              expandedDefault
            />

            {/* ✅ หน้ารายละเอียดเพลง (มีปุ่ม Back เฉพาะมือถือ) */}
            {isDetail && selected && (
              <div className="app-mobile-detail">
                <SongView
                  song={selected}
                  keyShift={keyShift}
                  onTranspose={(n) => setKeyShift(keyShift + n)}
                  onBack={() => setIsDetail(false)}
                  isDesktop={false} // ✅ แสดงปุ่ม Back เฉพาะในมือถือ
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 📝 Editor Modal */}
      {isEditorOpen && (
        <EditorModal
          song={editSong}
          onSave={handleSave}
          onClose={() => {
            setIsEditorOpen(false);
            setEditSong(null);
          }}
        />
      )}
    </div>
  );
}
