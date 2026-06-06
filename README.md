# 💕 Jarak Jadi Dekat

Game romantis online untuk pasangan LDR — dibuat khusus untuk **Airin** (Padang) & **Tedi** (Bandung).

> "Walau jauh, malam ini kita main di ruang yang sama."

## ✨ Fitur

- 🎮 **Real-time multiplayer** — Main bareng secara online
- 💌 **80+ kartu pertanyaan romantis** — 7 kategori: Truth Romantis, Challenge Manis, Memory LDR, This or That, Future Plan, Deep Talk, Fun Dare
- ❤️ **Love Meter** — Isi meter cinta dengan reaksi pasanganmu
- 🎙️ **Voice Chat** — Ngobrol pakai suara via Agora RTC
- 📱 **Mobile-first responsive** — Bisa dimainkan di HP
- 🎨 **UI romantis** — Warna soft pink, cream, lavender, gold

## 🛠️ Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database + Realtime)
- Agora Web RTC (Voice Chat)

## 🚀 Cara Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd jarak-jadi-dekat
npm install
```

### 2. Setup Supabase

1. Buka [supabase.com](https://supabase.com) dan buat project baru (GRATIS)
2. Copy **Project URL** dan **anon public key** dari Settings → API
3. Buka SQL Editor di Supabase Dashboard
4. Copy isi file `supabase-schema.sql` dan jalankan
5. **Aktifkan Realtime:**
   - Buka Database → Replication
   - Pastikan `supabase_realtime` publication sudah include semua tabel (rooms, players, reactions, answers)
   - Kalau belum, jalankan query ini di SQL Editor:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
   ALTER PUBLICATION supabase_realtime ADD TABLE players;
   ALTER PUBLICATION supabase_realtime ADD TABLE reactions;
   ALTER PUBLICATION supabase_realtime ADD TABLE answers;
   ```

### 3. Setup Environment Variables

Copy file `.env.local.example` jadi `.env.local`:

```bash
cp .env.local.example .env.local
```

Isi dengan data dari Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 4. (Opsional) Setup Agora Voice Chat

1. Buka [agora.io](https://www.agora.io) dan daftar (GRATIS tier tersedia)
2. Buat project baru dan dapatkan **App ID**
3. Tambahkan ke `.env.local`:

```env
NEXT_PUBLIC_AGORA_APP_ID=your-agora-app-id
```

> Kalau belum diisi, voice chat akan menampilkan pesan "Voice chat belum aktif" tanpa error.

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy ke Vercel

### Cara 1: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

### Cara 2: Deploy via GitHub + Vercel Dashboard

1. Push project ke GitHub
2. Buka [vercel.com](https://vercel.com) → Import Project
3. Pilih repository GitHub
4. Tambahkan Environment Variables di Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_AGORA_APP_ID` (opsional)
5. Klik **Deploy**

### Cara 3: Deploy ke Netlify

1. Push project ke GitHub
2. Buka [netlify.com](https://netlify.com) → Add new site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Tambahkan Environment Variables yang sama
6. Klik **Deploy**

## 📁 Struktur Folder

```
jarak-jadi-dekat/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Global styles
│   │   └── room/[code]/
│   │       └── page.tsx        # Game room page
│   ├── components/
│   │   ├── CreateRoomForm.tsx  # Form buat room
│   │   ├── JoinRoomForm.tsx    # Form join room
│   │   ├── PlayerStatus.tsx    # Status pemain
│   │   ├── GameCard.tsx        # Kartu pertanyaan
│   │   ├── ReactionBar.tsx     # Tombol reaksi
│   │   ├── LoveMeter.tsx       # Meter cinta
│   │   └── VoiceChatButton.tsx # Tombol voice chat
│   ├── hooks/
│   │   ├── useRealtimeGame.ts  # Hook realtime game
│   │   └── useVoiceChat.ts     # Hook voice chat Agora
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client & API
│   │   ├── utils.ts            # Utility functions
│   │   └── cards.ts            # Data kartu (fallback)
│   └── types/
│       └── index.ts            # TypeScript types
├── supabase-schema.sql         # SQL schema + seed data
├── .env.local.example          # Template env
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🎮 Cara Bermain

1. **Buat Room** — Salah satu pemain buat room dan dapatkan kode (contoh: `AIRIN-TEDI`)
2. **Kasih Kode** — Bagikan kode room ke pasangan
3. **Join Room** — Pasangan masuk pakai kode yang sama
4. **Mulai Game** — Klik "Mulai Game!" saat kedua pemain sudah masuk
5. **Ambil Kartu** — Giliranmu? Klik "Ambil Kartu" untuk dapat pertanyaan
6. **Jawab** — Tulis jawaban dengan tulus
7. **Kasih Reaksi** — Pasangan kasih reaksi ❤️😂🥺🔥
8. **Next Turn** — Lanjut ke giliran berikutnya
9. **Isi Love Meter** — Semakin banyak reaksi, semakin penuh Love Meter!

## 💡 Tips

- Gunakan **voice chat** supaya lebih berasa dekat
- Jawab dengan tulus dan jujur — itu yang bikin game ini spesial
- Kalau ada pertanyaan yang terlalu personal, bisa lewati dengan "Lewati"
- Love Meter bisa diisi berulang kali, nggak ada batasnya!

## 📝 License

Dibuat dengan cinta untuk Airin & Tedi 💕
