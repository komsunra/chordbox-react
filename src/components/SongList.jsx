import React, { useState, useEffect } from "react";

export default function SongList({
  songs,
  currentUser,
  onSelect,
  onEdit,
  search,
}) {
  const [expanded, setExpanded] = useState({});
  const [favorites, setFavorites] = useState([]);

  // โหลด favorites จาก songs/fav_users ของ Strapi
  useEffect(() => {
    if (!currentUser) return;
    const favIds = songs
      .filter((s) => s.fav_users?.some((u) => u.id === currentUser.id))
      .map((s) => s.id);
    setFavorites(favIds);
  }, [currentUser?.id, songs]);

  const toggleExpand = (group) => {
    setExpanded((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const toggleFavorite = async (song) => {
    if (!currentUser) return;
    const token = localStorage.getItem("jwt") || currentUser?.jwt;
    if (!token) return;

    const isFav = favorites.includes(song.id);
    const prevFavorites = [...favorites];

    // อัปเดต Strapi ก่อน
    const updatedFavUsers = isFav
      ? (song.fav_users || []).filter((u) => u.id !== currentUser.id)
      : [...(song.fav_users || []), { id: currentUser.id }];

    try {
      const res = await fetch(
        `https://strapi.zector.myds.me/songs/${song.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fav_users: updatedFavUsers.map((u) => u.id),
          }),
        }
      );
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      const updatedSong = await res.json();

      // update state
      const newFavorites = updatedSong.fav_users.some(u => u.id === currentUser.id)
        ? [...new Set([...favorites, updatedSong.id])]
        : favorites.filter(id => id !== updatedSong.id);

      setFavorites(newFavorites);

    } catch (err) {
      console.error("Error updating favorite:", err);
      setFavorites(prevFavorites); // rollback
    }
  };

  // Filter & group
  const filtered = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      (song.artist || "Unknown Artist")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, song) => {
    const artist = song.artist || "Unknown Artist";
    if (!acc[artist]) acc[artist] = [];
    acc[artist].push(song);
    return acc;
  }, {});

  const favoriteGroup = filtered.filter((s) => favorites.includes(s.id));

  return (
    <div className="p-3 mt-2" style={{ fontFamily: "'Bai Jamjuree', sans-serif" }}>
      <table className="table-sm table-songlist">
        <tbody>
          {favoriteGroup.length > 0 && (
            <React.Fragment key="favorites">
              <tr
                onClick={() => toggleExpand("Favorites")}
                className="songlist-group-row"
              >
                <td className="align-middle">
                  <strong>
                    <i className={`fas ${expanded["Favorites"] ? "fa-caret-down" : "fa-caret-right"} me-1`}></i>
                    Favorites
                  </strong>
                </td>
                <td className="text-end align-middle pe-3">
                  <span className="badge bg-secondary">{favoriteGroup.length}</span>
                </td>
              </tr>
              {expanded["Favorites"] &&
                favoriteGroup.map((song) => (
                  <tr key={`fav-${song.id}`} className="songlist-data-row" onClick={() => onSelect(song)}>
                    <td className="align-middle">{song.title}</td>
                    <td className="text-end align-middle">
                      <button className="btn btn-sm btn-primary me-1" onClick={e => { e.stopPropagation(); onEdit(song); }}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className={`btn btn-sm ${favorites.includes(song.id) ? "btn-warning text-white" : "btn-outline-secondary"}`}
                        onClick={e => { e.stopPropagation(); toggleFavorite(song); }}
                      >
                        <i className="fas fa-star"></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          )}

          {Object.keys(grouped).map(artist => (
            <React.Fragment key={artist}>
              <tr onClick={() => toggleExpand(artist)} className="songlist-group-row">
                <td className="align-middle">
                  <strong>
                    <i className={`fas ${expanded[artist] ? "fa-caret-down" : "fa-caret-right"} me-1`}></i>{" "}
                    {artist}
                  </strong>
                </td>
                <td className="text-end align-middle pe-3">
                  <span className="badge bg-secondary">{grouped[artist].length}</span>
                </td>
              </tr>
              {expanded[artist] &&
                grouped[artist].map(song => (
                  <tr key={song.id} className="songlist-data-row" onClick={() => onSelect(song)}>
                    <td className="align-middle">{song.title}</td>
                    <td className="text-end align-middle">
                      <button className="btn btn-sm btn-primary me-1" onClick={e => { e.stopPropagation(); onEdit(song); }}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className={`btn btn-sm ${favorites.includes(song.id) ? "btn-warning text-white" : "btn-outline-secondary"}`}
                        onClick={e => { e.stopPropagation(); toggleFavorite(song); }}
                      >
                        <i className="fas fa-star"></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
