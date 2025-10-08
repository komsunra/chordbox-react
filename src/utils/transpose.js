// ฟังก์ชัน Transpose คอร์ด
const CHORDS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_MAP = { Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#" };

export function transpose(chord, shift) {
  if (!chord) return chord;

  // แปลง flat เป็น sharp
  if (FLAT_MAP[chord]) chord = FLAT_MAP[chord];

  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return chord;

  const [_, root, suffix] = match;
  const index = CHORDS.indexOf(root);
  if (index === -1) return chord;

  let newIndex = (index + shift) % CHORDS.length;
  if (newIndex < 0) newIndex += CHORDS.length;

  return CHORDS[newIndex] + suffix;
}

/**
 * ✅ ฟังก์ชัน Transpose ทั้งบรรทัด พร้อมลบช่องว่างหลังคอร์ด (# หรือ b)
 * เช่น:  D   →  D# แล้วลบ space ด้านหลังออก 1 ตัว
 */

export function transposeLine(line, shift) {
  if (!line) return line;

  // ใช้ regex หา chord ทั้งหมด
  let result = "";
  let lastIndex = 0;

  const regex = /\[([A-G][b#]?(?:m|maj|min|dim|aug|sus|add)?\d*)\]/g;
  let match;

  while ((match = regex.exec(line)) !== null) {
    const before = line.slice(lastIndex, match.index);
    const originalChord = match[1];
    const transposedChord = transpose(originalChord, shift);

    // ✅ ชดเชยความยาว
    const diff = originalChord.length - transposedChord.length;
    let adjustedChord = transposedChord;

    if (diff > 0) {
      // ถ้า transpose แล้วสั้นลง → เติม space ด้านหลังให้เท่าความยาวเดิม
      adjustedChord += " ".repeat(diff);
    } else if (diff < 0) {
      // ถ้ายาวขึ้น → ตัดช่องว่างถัดจากคอร์ดออก (-diff) ตัว
      let afterText = line.slice(match.index + match[0].length);
      afterText = afterText.replace(/^ {1,}/, (spaces) =>
        spaces.slice(0, Math.max(0, spaces.length + diff))
      );
      line =
        line.slice(0, match.index + match[0].length) +
        afterText; // อัปเดต line ทันที
    }

    result += before + `[${adjustedChord}]`;
    lastIndex = regex.lastIndex;
  }

  result += line.slice(lastIndex);

  // ✅ ลบช่องว่างหลังเครื่องหมาย # หรือ b
  result = result.replace(/#\s/g, "#");
  result = result.replace(/b\s/g, "b");

  return result;
}

