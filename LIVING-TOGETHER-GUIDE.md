# 💕 Living Together - Tedi & Airin Life Simulator

## Complete User Guide & Setup Instructions

**The ultimate LDR life simulation game** - Experience living together despite the distance!

---

## 🎮 What is Living Together?

Living Together adalah game simulasi kehidupan sehari-hari khusus untuk **Tedi (Bandung)** dan **Airin (Padang)**. Bukan sekedar game - ini adalah pengalaman "tinggal bareng" virtual yang lengkap, dari bangun pagi sampai tidur malam.

### 🌟 Why Different from Other Games?

- ✅ **Hardcoded untuk Tedi & Airin** - Bukan multiplayer umum
- ✅ **Complete daily routine** - Morning → Night with all activities
- ✅ **Real care system** - Medicine reminders, meal reminders, comfort
- ✅ **Visual clarity** - Emojis + animations, not just text
- ✅ **Mobile-friendly** - Optimized for phones
- ✅ **Real-time sync** - Everything updates instantly
- ✅ **Intimacy tracking** - Relationship grows with activities

---

## 🚀 SETUP INSTRUCTIONS (CRITICAL!)

### Step 1: Database Setup ⚠️ MUST DO FIRST!

1. **Login to Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Login with your account
   - Select project: `hweosezdbayrcvchdvgo`

2. **Open SQL Editor**
   - Left sidebar → Click "SQL Editor"
   - Click "+ New Query"

3. **Execute Schema**
   - Copy **ALL** content from file: `tedi-airin-schema.sql`
   - Paste into SQL editor
   - Click "Run" button (or press Ctrl+Enter)
   - Wait until you see "Success. No rows returned"

4. **Verify Tables Created**
   - Left sidebar → Click "Table Editor"
   - You should see these 7 new tables:
     - ✅ `life_players`
     - ✅ `life_activities`
     - ✅ `care_actions`
     - ✅ `life_messages`
     - ✅ `life_reminders`
     - ✅ `relationship_stats`
     - ✅ `memory_lane`

5. **Check Initial Data**
   - Click on `life_players` table
   - You should see 2 rows:
     - **Tedi** (👨, Bandung)
     - **Airin** (👩, Padang)
   - Click on `relationship_stats` table
   - You should see 1 row with initial stats

### Step 2: Environment Variables ✅ Already Set

Your `.env.local` is already configured:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hweosezdbayrcvchdvgo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### Step 3: Test Locally

```bash
# Run development server
npm run dev

# Open browser
http://localhost:3000
```

1. Click "Living Together" button
2. Choose Tedi or Airin
3. Check if status bars appear
4. Try doing an activity
5. Check if partner status shows

### Step 4: Deploy to Vercel 🚀

```bash
# Commit all changes
git add .
git commit -m "Add Living Together game"
git push origin main
```

Vercel will auto-deploy! URL: https://jarak-jadi-dekat.vercel.app

---

## 🎯 HOW TO PLAY

### First Time Setup

1. **Open Game**
   - Go to: https://jarak-jadi-dekat.vercel.app
   - Click "Living Together 💕"

2. **Choose Character**
   - **Tedi**: Click Bandung card (👨)
   - **Airin**: Click Padang card (👩)

3. **Game Loads**
   - You'll see 3 panels:
     - Left: Your status bars
     - Middle: Activities/Care/Chat
     - Right: Partner's status

4. **Start Your Day!**

---

## 📊 Understanding Status Bars

### Health ❤️ (Kesehatan)
- **100-70**: Sehat 💪 (Green)
- **69-40**: Kurang fit (Yellow)
- **39-0**: Sakit 🤒 (Red)
- **Recovery**: Medicine, rest, good food

### Energy ⚡ (Energi)
- **100-70**: Penuh tenaga (Green)
- **69-40**: Mulai lelah (Yellow)
- **39-0**: Capek banget (Red)
- **Recovery**: Sleep, rest, coffee

### Hunger 🍽️ (Lapar)
- **100-70**: Kenyang (Green)
- **69-40**: Mulai lapar (Yellow)
- **39-0**: Kelaparan (Red)
- **Recovery**: Breakfast, lunch, dinner, snacks

### Hydration 💧 (Hidrasi)
- **100-70**: Terhidrasi (Green)
- **69-40**: Mulai haus (Yellow)
- **39-0**: Dehidrasi (Red)
- **Recovery**: Drink water regularly

### Mood 😊
- 😊 **Happy**: Normal mood
- 🥰 **Love**: After romantic activities
- 😢 **Sad**: When stats are low
- 🤒 **Sick**: When health < 50
- 😴 **Tired**: When energy < 30
- 😰 **Stressed**: After work
- 🤩 **Excited**: After dates

---

## 🏠 DAILY ACTIVITIES (16 Types)

### Morning Activities 🌅 (5:00 - 12:00)

#### Bangun Tidur 🌅
- **Energy**: +20
- **Effect**: Wake up from sleep
- **Must do**: First activity after sleeping

#### Sarapan Bareng 🍳
- **Energy**: -5
- **Hunger**: +40
- **Hydration**: +20
- **Duration**: 20 minutes

### Afternoon Activities ☀️ (12:00 - 17:00)

#### Makan Siang 🍜
- **Energy**: -5
- **Hunger**: +50
- **Hydration**: +25
- **Duration**: 30 minutes

#### Kerja/Belajar 💻
- **Energy**: -15
- **Hunger**: -10
- **Duration**: 60 minutes
- **Productive time**

### Evening Activities 🌆 (17:00 - 21:00)

#### Makan Malam 🍽️
- **Energy**: -5
- **Hunger**: +50
- **Hydration**: +25
- **Duration**: 40 minutes

#### Nonton Bareng 🎬
- **Energy**: -8
- **Duration**: 120 minutes
- **Mood**: Happy
- **Requires**: Partner online (for bonus)

#### Date Virtual 💑
- **Energy**: -10
- **Duration**: 90 minutes
- **Mood**: Love
- **Requires**: Partner online
- **Best for**: Special moments

### Night Activities 🌙 (21:00 - 5:00)

#### Tidur 😴
- **Energy**: +100 (full restore)
- **Duration**: 8 hours
- **Important**: Can't do activities while sleeping
- **Must do**: Partner can wake you with message

### Anytime Activities 🎲

#### Ngopi Bareng ☕
- **Energy**: +10
- **Hydration**: +15
- **Duration**: 15 minutes

#### Ngemil 🍪
- **Energy**: -3
- **Hunger**: +20
- **Duration**: 10 minutes

#### Minum Air 💧
- **Energy**: 0
- **Hydration**: +30
- **Duration**: 2 minutes
- **Important**: Drink regularly!

#### Minum Obat 💊
- **Health**: +20
- **Duration**: 5 minutes
- **Only shows**: When needs_medicine = true

#### Istirahat 😌
- **Energy**: +25
- **Duration**: 30 minutes
- **Good for**: Energy boost without sleeping

#### Jalan-jalan 🚶
- **Energy**: -10
- **Health**: +5
- **Mood**: Happy
- **Duration**: 30 minutes

#### Ngobrol Santai 💬
- **Energy**: -3
- **Mood**: Love
- **Duration**: 20 minutes
- **Requires**: Partner online

#### Masak Bareng 👨‍🍳
- **Energy**: -12
- **Duration**: 45 minutes
- **Mood**: Happy
- **Requires**: Partner online
- **Special**: Can get taste feedback (salty, sweet, delicious)

---

## 💝 CARE SYSTEM (10 Types)

### Reminders (When Partner Needs Help)

#### Ngingetin Minum Obat 💊
- **Intimacy**: +10 points
- **When**: Partner is sick or needs medicine
- **Message**: "Jangan lupa minum obat ya sayang 💕"

#### Ngingetin Makan 🍽️
- **Intimacy**: +5 points
- **When**: Partner's hunger < 30
- **Message**: "Udah makan belum? Jangan lupa makan ya!"

#### Ngingetin Minum 💧
- **Intimacy**: +3 points
- **When**: Partner's hydration < 30
- **Message**: "Minum air putih dulu yuk!"

### Affection (Anytime)

#### Peluk Virtual 🤗
- **Intimacy**: +15 points
- **Message**: "Peluk erat-erat 🤗💕"
- **Good for**: Everyday love

#### Cium Virtual 😘
- **Intimacy**: +20 points
- **Message**: "Muach! 😘💋"
- **Good for**: Sweet moments

#### Kasih Bunga 💐
- **Intimacy**: +25 points
- **Message**: "Bunga buat kamu 💐✨"
- **Good for**: Making partner happy

#### Kasih Hadiah 🎁
- **Intimacy**: +30 points
- **Message**: "Ada hadiah nih buat kamu! 🎁"
- **Good for**: Special occasions

#### Hibur 🥰
- **Intimacy**: +20 points
- **When**: Partner is sad or sick
- **Message**: "Kamu gapapa kok, aku di sini 🥰"

#### Semangatin 💪
- **Intimacy**: +15 points
- **When**: Partner is stressed or tired
- **Message**: "Semangat ya sayang! Kamu pasti bisa! 💪✨"

#### Love Note 💌
- **Intimacy**: +25 points
- **Message**: "Aku sayang kamu 💌💕"
- **Good for**: Random love moments

---

## 💕 RELATIONSHIP SYSTEM

### Intimacy Points & Levels

- **Level 1**: 0-99 points - 💝 New Love
- **Level 2-4**: 100-499 points - 💓 Getting Closer
- **Level 5-9**: 500-999 points - 💗 Very Sweet
- **Level 10-19**: 1000-1999 points - 💕 Super Close
- **Level 20-29**: 2000-2999 points - 💖 Best Couple
- **Level 30-49**: 3000-4999 points - 💖 Best Couple
- **Level 50+**: 5000+ points - 💍 Soulmates

### How to Earn Points

1. **Activities**: +5 points per activity
2. **Together Activities**: +10 points (when both online)
3. **Care Actions**: +3 to +30 points (depends on type)
4. **Chat Messages**: +1 point per message
5. **Daily Login**: +10 points

### Stats Tracked

- 💕 **Intimacy Level**: Current relationship level
- 📅 **Days Together**: How many days playing
- 🎯 **Total Activities**: All activities count
- 💝 **Care Actions**: How many times you cared
- 💬 **Messages**: Total messages sent

---

## 📱 MOBILE UI GUIDE

### Bottom Navigation

- 🏠 **Aktivitas** (Home): Daily activities panel
- 💝 **Perhatian** (Care): Send care to partner
- 💬 **Chat**: Real-time messaging

### Three-Panel Layout

**Left Panel**: Your Status
- Your avatar & name
- Online/offline status
- All status bars
- Current activity
- Medicine reminders
- Warnings (low stats)

**Middle Panel**: Main Content
- **Home**: Activity grid + recent feed
- **Care**: Send care + received care
- **Chat**: Message history + input

**Right Panel**: Partner Status
- Partner's avatar & name
- Their online status
- Their status bars (read-only)
- Quick care buttons
- Special reminders (if partner needs help)

---

## 🎮 GAMEPLAY TIPS

### Daily Routine Suggestion

**Morning** (Wake up at 6-8 AM)
1. Bangun Tidur 🌅
2. Minum Air 💧
3. Sarapan Bareng 🍳
4. Ngopi Bareng ☕

**Afternoon** (12-5 PM)
1. Makan Siang 🍜
2. Kerja/Belajar 💻 (or Istirahat if tired)
3. Minum Air 💧
4. Ngemil 🍪 (if hungry)

**Evening** (5-9 PM)
1. Makan Malam 🍽️
2. Jalan-jalan 🚶 or Ngobrol 💬
3. Nonton Bareng 🎬 or Date 💑
4. Masak Bareng 👨‍🍳 (with partner)

**Night** (9 PM - 12 AM)
1. Ngobrol Santai 💬
2. Say good night
3. Tidur 😴

### Pro Tips

1. **Check Partner Often**
   - Look at right panel
   - Send care when needed
   - Do activities together for bonus

2. **Keep Stats Balanced**
   - Never let hunger/hydration below 30
   - Sleep when energy below 20
   - Drink water every few hours

3. **Build Intimacy Fast**
   - Do "together" activities (requires partner online)
   - Send care actions regularly
   - Chat frequently

4. **Medicine Reminders**
   - Set reminder in partner panel
   - Partner will see alert
   - They can take medicine

5. **Cooking Together**
   - Only available when both online
   - Can get different tastes
   - Great for intimacy points

6. **Energy Management**
   - Sleep restores 100 energy
   - Coffee gives +10
   - Rest gives +25 (quick boost)
   - Plan activities based on energy cost

---

## 🐛 TROUBLESHOOTING

### Partner Not Showing Online?
1. Check if partner actually opened game
2. Refresh browser (F5)
3. Check internet connection
4. Verify both using latest deployment

### Status Bars Not Updating?
1. Check Supabase Realtime is enabled
2. Look at browser console for errors
3. Verify database schema is executed
4. Check RLS policies in Supabase

### Can't Do Activities?
- Check if you have enough energy
- If sleeping, wake up first (Bangun Tidur)
- Check if activity available for current time of day

### Care Actions Not Received?
- Check if recipient is online
- Look at "Belum Dibaca" section in Care panel
- Refresh browser
- Check Supabase care_actions table

### Build Errors?
```bash
npm run build
```
Check TypeScript errors and fix them

### Database Schema Failed?
- Make sure you're in correct Supabase project
- Check if tables already exist (drop them first)
- Copy full SQL schema
- Run in SQL Editor, not table editor

---

## 📊 TECHNICAL DETAILS

### Database Tables

1. **life_players**
   - 2 fixed players (Tedi, Airin)
   - Status bars (health, energy, hunger, hydration)
   - States (online, sleeping, sick)
   - Medicine tracking
   - Timestamps

2. **life_activities**
   - Activity logging
   - Together mode tracking
   - Partner joined status

3. **care_actions**
   - From/to player
   - Care type
   - Read status
   - Timestamp

4. **life_messages**
   - Chat messages
   - System messages
   - Care messages
   - Read tracking

5. **life_reminders**
   - Medicine reminders
   - Meal reminders
   - Water reminders

6. **relationship_stats**
   - Single row for couple
   - Intimacy level & points
   - Activity counts
   - Stats tracking

7. **memory_lane**
   - Special moments
   - Milestones
   - Photos (future)

### Real-time Features

- Player status updates (online, activity, mood)
- Partner status sync
- Care action notifications
- Chat messages
- Relationship stats
- Activity feed

### Performance

- Mobile-optimized
- Fast loading
- Efficient queries
- Minimal re-renders
- Optimistic UI updates

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Deploy

- ✅ Execute `tedi-airin-schema.sql` in Supabase
- ✅ Verify 2 players created (Tedi, Airin)
- ✅ Check relationship_stats row exists
- ✅ Test locally first (`npm run dev`)
- ✅ Run build (`npm run build`)
- ✅ Fix any TypeScript errors

### After Deploy

- ✅ Test with both characters (Tedi & Airin)
- ✅ Verify real-time sync works
- ✅ Test all activities
- ✅ Test care system
- ✅ Test chat
- ✅ Check mobile responsiveness
- ✅ Verify status bars update
- ✅ Test together activities

### Environment Variables on Vercel

```
NEXT_PUBLIC_SUPABASE_URL=https://hweosezdbayrcvchdvgo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## 💝 CREDITS

**Made with love for:**
- 👨 **Tedi** - Bandung
- 👩 **Airin** - Padang

**Game Design**: Complete life simulator for LDR couples
**Inspiration**: Real relationships need care, attention, and daily routines
**Goal**: Make distance feel closer through virtual togetherness

---

## 📞 SUPPORT

If you encounter issues:

1. Check this guide first
2. Verify database setup
3. Check browser console
4. Test with simple activity first
5. Check Supabase dashboard for data

---

*"Walau jauh di Bandung dan Padang, tapi rasanya kayak tinggal bareng"* 💕🏠

**May this game bring you closer!** 🌏❤️
