# 🏠 Virtual Together - Harvest Moon Style LDR Game

Game simulasi relationship daily life untuk pasangan LDR. Jalanin hari-hari virtual bareng, lakuin aktivitas bersama, dan bangun relationship level kalian!

## ✨ Features

### 🎮 Core Gameplay
- **Energy System**: Setiap aktivitas pakai energy, refill tiap hari (00:00)
- **Coins & Economy**: Dapat coins dari aktivitas, pakai untuk beli item
- **Relationship Level**: Naik level dari aktivitas bareng
- **Daily Activities**: 8 aktivitas berbeda dengan reward berbeda

### 🌱 Garden System
- **Tanam tanaman**: 4 jenis tanaman dengan growth time berbeda
- **Watering mechanic**: Siram tanaman setiap 12 jam
- **Harvest rewards**: Panen dapat coins setelah tanaman tumbuh
- **Maksimal 6 tanaman**: Kelola taman dengan bijak!

### 💬 Real-time Chat
- **Couple chat**: Ngobrol real-time dengan pasangan
- **Activity feed**: Lihat aktivitas yang dilakukan pasangan
- **Online indicator**: Tahu kapan pasangan online

### 🏆 Progression
- **Relationship Levels**: Mulai dari level 1, naik dengan aktivitas
- **Points system**: Setiap aktivitas kasih XP untuk level up
- **Achievements**: (Coming soon!)

## 🎯 Daily Activities

| Activity | Energy | Coins | XP | Duration |
|----------|--------|-------|-----|----------|
| ☕ Sarapan Bareng | 10 | 5 | 10 | 15 min |
| 🍳 Masak Bareng | 15 | 10 | 15 | 30 min |
| 🎬 Nonton Film | 10 | 5 | 12 | 120 min |
| 📚 Kerja/Belajar | 20 | 15 | 20 | 60 min |
| 💬 Ngobrol Santai | 5 | 3 | 8 | 20 min |
| 💧 Siram Tanaman | 5 | 2 | 5 | 5 min |
| 🎮 Main Game | 15 | 8 | 15 | 30 min |
| 🌙 Good Night | 5 | 3 | 10 | 10 min |

## 🌸 Garden Plants

| Plant | Days | Cost | Harvest |
|-------|------|------|---------|
| 🌹 Mawar | 3 | 10 | 20 |
| 🌻 Bunga Matahari | 2 | 8 | 15 |
| 🌷 Tulip | 2 | 7 | 12 |
| 🪻 Lavender | 4 | 12 | 25 |

## 🚀 Getting Started

### For Players

1. **Buat Couple Baru**
   - Klik "Buat Couple Baru"
   - Share 6-digit kode ke pasangan

2. **Join Couple**
   - Dapat kode dari pasangan
   - Klik "Join Pakai Kode"
   - Masukkan kode

3. **Setup Profile**
   - Isi nama panggilan
   - Isi kota asal
   - Pilih avatar

4. **Start Playing!**
   - Lakuin daily activities
   - Tanam & rawat tanaman
   - Chat dengan pasangan
   - Naik

kan relationship level!

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Hosting**: Vercel

## 📊 Database Schema

### Tables
- `couples` - Couple data & progress
- `couple_players` - Player profiles & resources
- `daily_activities` - Activity logs
- `garden_plants` - Garden state
- `couple_messages` - Chat messages
- `couple_achievements` - Unlocked achievements
- `couple_inventory` - Items & upgrades

## 🎨 Design Philosophy

### Lightweight & Mobile-First
- Simple pixel-art inspired UI
- Optimized for mobile devices
- Fast loading times
- Minimal assets

### Async-Friendly
- Can play solo when partner offline
- Progress syncs automatically
- Activity logs show what partner did

### Daily Engagement
- Energy refills daily (encourages daily login)
- Quick activities (5-30 minutes)
- Garden needs attention (watering)
- Chat notifications

### Relationship Building
- Activities give XP for couple level
- Shared goals (garden, level ups)
- Chat for communication
- Achievements for milestones

## 🔮 Roadmap (Future Updates)

### v1.1
- [ ] Achievement system
- [ ] More plant varieties
- [ ] Daily missions
- [ ] Streak counter

### v1.2
- [ ] Home customization
- [ ] Furniture shop
- [ ] Avatar customization
- [ ] Couple photo album

### v1.3
- [ ] Mini games
- [ ] Date planner
- [ ] Reminder system
- [ ] Special events (anniversaries)

### v1.4
- [ ] Pet system
- [ ] Cooking recipes
- [ ] Weather system
- [ ] Seasonal events

## 🐛 Known Issues

- Energy doesn't auto-refill at midnight (need manual refresh)
- Plant growth calculation based on calendar days, not 24h periods
- Chat doesn't scroll to bottom on new messages sometimes
- No notification for when partner is online

## 📝 Notes

- **Energy refills**: Happens at midnight (00:00) based on user's timezone
- **Activity duration**: Just for display, doesn't block other activities
- **Garden max**: 6 plants to prevent database bloat
- **Chat history**: Limited to 50 recent messages per couple

## 💕 Credits

Dibuat dengan cinta untuk pasangan LDR di mana pun kalian berada.

**Game Design Inspiration**: Harvest Moon, Stardew Valley, Animal Crossing

**Made for**: Airin & Tedi, dan semua pasangan LDR lainnya yang ingin rasanya "tinggal bareng" walau jauh.

---

*"Walau jauh, rasanya kayak tinggal bareng"* 💕🏠
