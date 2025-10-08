const BASE_URL = "https://strapi.zector.myds.me";

export async function fetchSongs(token) {
  try {
    const res = await fetch(`${BASE_URL}/songs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("ไม่สามารถโหลดเพลงได้");

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      id: item.id,
      title: item.title || "Untitled",
      artist: item.artist || "Unknown",
      content: item.content || "",
      fav_users: item.fav_users || [], // เพิ่ม fav_users สำหรับ favorite
    }));
  } catch (err) {
    console.error("fetchSongs error:", err);
    return [];
  }
}

export async function saveSong(song, token) {
  try {
    const res = await fetch(`${BASE_URL}/songs${song.id ? `/${song.id}` : ""}`, {
      method: song.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(song),
    });
    if (!res.ok) throw new Error("ไม่สามารถบันทึกเพลงได้");
    return await res.json();
  } catch (err) {
    console.error("saveSong error:", err);
    return null;
  }
}
