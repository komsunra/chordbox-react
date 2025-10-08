# ChordBox (React Static App)

### วิธีรันทดสอบ

1. แตกไฟล์ zip แล้วเปิด Terminal (หรือ CMD)
2. เข้าไปในโฟลเดอร์โปรเจกต์ เช่น
   ```bash
   cd chordbox-react
   ```
3. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
4. รันโหมดทดสอบ (dev server):
   ```bash
   npm run dev
   ```
   จากนั้นเปิดเบราว์เซอร์ไปที่ http://localhost:5173

5. ถ้าต้องการ build สำหรับ deploy บน NAS หรือ server:
   ```bash
   npm run build
   ```
   ไฟล์จะอยู่ในโฟลเดอร์ `dist/`

### Deploy บน Synology NAS

นำไฟล์ใน `dist/` ไปไว้ใน:
- `/var/services/web/chordbox` (สำหรับ Web Station)
หรือใช้ Docker:
```bash
docker run --name chordbox -d -p 8080:80   -v /volume1/web/chordbox/dist:/usr/share/nginx/html:ro   nginx:alpine
```