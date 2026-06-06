-- =====================================================
-- SQL Schema untuk Game "Jarak Jadi Dekat"
-- Supabase Database Setup
-- =====================================================

-- Enable Row Level Security (RLS) on all tables
-- Note: Untuk game ini, kita gunakan anon key dengan policies yang permissive
-- karena tidak ada sistem login yang rumit

-- 1. Tabel Rooms
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_turn VARCHAR(50) DEFAULT '',
  current_card_id VARCHAR(50) DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished'))
);

-- Index untuk pencarian room by code
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);

-- 2. Tabel Players
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk pencarian player by room
CREATE INDEX IF NOT EXISTS idx_players_room_id ON players(room_id);

-- 3. Tabel Cards (Pertanyaan)
CREATE TABLE IF NOT EXISTS cards (
  id VARCHAR(50) PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  type VARCHAR(20) NOT NULL
);

-- 4. Tabel Reactions
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  player_name VARCHAR(50) NOT NULL,
  card_id VARCHAR(50) NOT NULL,
  reaction VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reactions_room_card ON reactions(room_id, card_id);

-- 5. Tabel Answers
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  player_name VARCHAR(50) NOT NULL,
  card_id VARCHAR(50) NOT NULL,
  answer_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_answers_room_card ON answers(room_id, card_id);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anonymous users (game ini tidak pakai auth)
CREATE POLICY "Allow all" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON cards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON reactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON answers FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- Realtime Setup
-- =====================================================

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE answers;

-- =====================================================
-- Seed Data: 80+ Kartu Pertanyaan Romantis
-- =====================================================

INSERT INTO cards (id, category, question, type) VALUES
-- Truth Romantis (15)
('tr-1', 'Truth Romantis', 'Apa hal kecil dari aku yang paling kamu rindukan?', 'truth'),
('tr-2', 'Truth Romantis', 'Sebutkan 3 hal yang kamu suka dari aku.', 'truth'),
('tr-3', 'Truth Romantis', 'Kapan pertama kali kamu sadar kalau kamu sayang sama aku?', 'truth'),
('tr-4', 'Truth Romantis', 'Apa mimpi paling indah yang pernah kamu punya tentang kita?', 'truth'),
('tr-5', 'Truth Romantis', 'Apa yang membuatmu tetap semangat menjalani LDR sama aku?', 'truth'),
('tr-6', 'Truth Romantis', 'Apa lagu yang selalu bikin kamu ingat aku?', 'truth'),
('tr-7', 'Truth Romantis', 'Kalau aku bisa teleport ke kamu sekarang, apa yang pertama kali kamu lakukan?', 'truth'),
('tr-8', 'Truth Romantis', 'Apa sifat aku yang paling kamu banggakan?', 'truth'),
('tr-9', 'Truth Romantis', 'Ceritain momen paling romantis yang pernah kita lalui bareng.', 'truth'),
('tr-10', 'Truth Romantis', 'Apa yang kamu rasain waktu pertama kali lihat aku?', 'truth'),
('tr-11', 'Truth Romantis', 'Kalau aku jadi makanan, aku bakal jadi apa dan kenapa?', 'truth'),
('tr-12', 'Truth Romantis', 'Apa hal paling random yang pernah kamu pikirin tentang aku?', 'truth'),
('tr-13', 'Truth Romantis', 'Kalau kita punya lagu tema, lagu apa yang cocok buat kita?', 'truth'),
('tr-14', 'Truth Romantis', 'Apa yang bikin kamu senyum-senyum sendiri pas inget aku?', 'truth'),
('tr-15', 'Truth Romantis', 'Sebutkan 5 hal yang kamu syukuri dari hubungan kita.', 'truth'),

-- Challenge Manis (12)
('cm-1', 'Challenge Manis', 'Kirim voice note 10 detik bilang "aku kangen kamu" dengan gaya paling lucu.', 'challenge'),
('cm-2', 'Challenge Manis', 'Tulis puisi singkat 4 baris tentang aku, lalu kirim ke chat.', 'challenge'),
('cm-3', 'Challenge Manis', 'Ambil foto selfie dengan ekspresi paling lucu dan kirim ke aku.', 'challenge'),
('cm-4', 'Challenge Manis', 'Nyanyiin lagu favorit kita lewat voice note.', 'challenge'),
('cm-5', 'Challenge Manis', 'Gambar doodle sederhana tentang kita dan kirim fotonya.', 'challenge'),
('cm-6', 'Challenge Manis', 'Tulis surat cinta singkat di notes HP, screenshot, dan kirim ke aku.', 'challenge'),
('cm-7', 'Challenge Manis', 'Rekam video 15 detik sambil bilang 3 hal yang kamu syukuri tentang aku.', 'challenge'),
('cm-8', 'Challenge Manis', 'Buat playlist Spotify dengan 5 lagu yang menggambarkan perasaan kamu ke aku.', 'challenge'),
('cm-9', 'Challenge Manis', 'Tulis status WhatsApp tentang aku yang paling romantis, screenshot, dan tunjukkan.', 'challenge'),
('cm-10', 'Challenge Manis', 'Kirim foto makanan favoritmu sekarang dan ceritain kenapa itu bikin kamu inget aku.', 'challenge'),
('cm-11', 'Challenge Manis', 'Rekam suara ketawa kamu yang paling lepas dan kirim ke aku.', 'challenge'),
('cm-12', 'Challenge Manis', 'Tulis janji kecil yang bakal kamu tepatin buat aku minggu ini.', 'challenge'),

-- Memory LDR (12)
('ml-1', 'Memory LDR', 'Ceritain momen paling berkesan waktu kita video call.', 'memory'),
('ml-2', 'Memory LDR', 'Apa hal paling lucu yang pernah terjadi pas kita LDR?', 'memory'),
('ml-3', 'Memory LDR', 'Kenangan mana yang paling kamu kangenin dari kunjungan terakhir kita?', 'memory'),
('ml-4', 'Memory LDR', 'Apa kebiasaan kita pas LDR yang paling kamu suka?', 'memory'),
('ml-5', 'Memory LDR', 'Ceritain hari paling sulit pas LDR dan gimana kita lewatin bareng.', 'memory'),
('ml-6', 'Memory LDR', 'Apa barang yang paling sering bikin kamu inget aku?', 'memory'),
('ml-7', 'Memory LDR', 'Kenangan mana yang bikin kamu yakin kalau kita bakal bertahan?', 'memory'),
('ml-8', 'Memory LDR', 'Apa kejadian paling tidak terduga pas kita ketemu kemarin?', 'memory'),
('ml-9', 'Memory LDR', 'Ceritain momen waktu kita saling kirim paket atau surat.', 'memory'),
('ml-10', 'Memory LDR', 'Apa hal paling sederhana yang pernah kita lakuin bareng tapi paling berarti?', 'memory'),
('ml-11', 'Memory LDR', 'Kenangan mana yang bikin kamu nangis karena kangen?', 'memory'),
('ml-12', 'Memory LDR', 'Apa hal yang paling kamu tunggu dari kunjungan kita berikutnya?', 'memory'),

-- This or That (12)
('tt-1', 'This or That', 'Video call tiap hari tapi pendek, atau seminggu sekali tapi lama banget?', 'choice'),
('tt-2', 'This or That', 'Kirim pesan manis tiap pagi, atau tiap malam sebelum tidur?', 'choice'),
('tt-3', 'This or That', 'Ketemu di Padang atau ketemu di Bandung?', 'choice'),
('tt-4', 'This or That', 'Makan bareng di restoran mewah atau masak bareng di rumah?', 'choice'),
('tt-5', 'This or That', 'Nonton film bareng online atau main game bareng?', 'choice'),
('tt-6', 'This or That', 'Dapat surat cinta tulisan tangan atau voice note panjang?', 'choice'),
('tt-7', 'This or That', 'Pulang kerja langsung video call atau chat dulu sambil istirahat?', 'choice'),
('tt-8', 'This or That', 'Liburan ke pantai atau ke pegunungan bareng aku?', 'choice'),
('tt-9', 'This or That', 'Dapat kejutan dari aku atau kasih kejutan ke aku?', 'choice'),
('tt-10', 'This or That', 'Chat sepanjang hari atau saling kirim foto aja?', 'choice'),
('tt-11', 'This or That', 'Makan malam romantis atau jalan-jalan sore bareng?', 'choice'),
('tt-12', 'This or That', 'Dapat good morning text atau good night call?', 'choice'),

-- Future Plan (12)
('fp-1', 'Future Plan', 'Apa rencana kecil kita yang paling kamu tunggu?', 'future'),
('fp-2', 'Future Plan', 'Kalau kita udah tinggal bareng, apa kegiatan harian yang paling kamu bayangin?', 'future'),
('fp-3', 'Future Plan', 'Tempat mana yang paling pengen kita kunjungi bareng?', 'future'),
('fp-4', 'Future Plan', 'Apa impian rumah tangga kita versi kamu?', 'future'),
('fp-5', 'Future Plan', 'Kalau kita udah nggak LDR, apa yang pertama kali mau kita lakuin?', 'future'),
('fp-6', 'Future Plan', 'Apa hal baru yang pengen kita coba bareng tahun ini?', 'future'),
('fp-7', 'Future Plan', 'Gimana bayangan kamu soal kencan pertama kita setelah LDR selesai?', 'future'),
('fp-8', 'Future Plan', 'Apa tradisi kecil yang pengen kita bangun bareng?', 'future'),
('fp-9', 'Future Plan', 'Kalau kita punya hewan peliharaan bareng, mau pelihara apa?', 'future'),
('fp-10', 'Future Plan', 'Apa rencana liburan impian kita berdua?', 'future'),
('fp-11', 'Future Plan', 'Gimana cara kita ngejaga hubungan tetap seru meski udah nggak LDR?', 'future'),
('fp-12', 'Future Plan', 'Apa yang pengen kamu capai tahun ini yang melibatkan aku?', 'future'),

-- Deep Talk (10)
('dt-1', 'Deep Talk', 'Apa ketakutan terbesar kamu soal hubungan kita?', 'deep'),
('dt-2', 'Deep Talk', 'Gimana cara kamu ngatasi rasa kangen yang berlebihan?', 'deep'),
('dt-3', 'Deep Talk', 'Apa hal yang pengen kamu ubah dari diri kamu buat hubungan kita?', 'deep'),
('dt-4', 'Deep Talk', 'Menurut kamu, apa rahasia hubungan LDR yang langgeng?', 'deep'),
('dt-5', 'Deep Talk', 'Apa yang bikin kamu merasa paling dicintai sama aku?', 'deep'),
('dt-6', 'Deep Talk', 'Kalau ada satu hal yang pengen kamu omongin ke aku tapi belum sempat, apa itu?', 'deep'),
('dt-7', 'Deep Talk', 'Apa arti cinta menurut kamu sekarang setelah kita LDR?', 'deep'),
('dt-8', 'Deep Talk', 'Gimana cara kamu membayangkan masa depan kita 5 tahun lagi?', 'deep'),
('dt-9', 'Deep Talk', 'Apa yang bikin kamu merasa aman sama aku meski jauh?', 'deep'),
('dt-10', 'Deep Talk', 'Kalau kita lagi sulit, apa yang pengen kamu lakuin bareng aku?', 'deep'),

-- Fun Dare (7)
('fd-1', 'Fun Dare', 'Tiru suara hewan favoritmu dan rekam, kirim ke aku!', 'dare'),
('fd-2', 'Fun Dare', 'Kirim foto kamu dengan ekspresi paling aneh yang bisa kamu buat.', 'dare'),
('fd-3', 'Fun Dare', 'Tulis status medsos paling jorok tentang aku (tapi tetap lucu ya!).', 'dare'),
('fd-4', 'Fun Dare', 'Lakukan dance challenge 15 detik dan rekam, kirim ke aku!', 'dare'),
('fd-5', 'Fun Dare', 'Kirim voice note sambil bilang "Aku cinta kamu" dalam 5 bahasa berbeda.', 'dare'),
('fd-6', 'Fun Dare', 'Ambil foto barang paling aneh di kamarmu dan ceritain kenapa itu ada.', 'dare'),
('fd-7', 'Fun Dare', 'Tantang aku buat nebak makanan favoritmu, tapi kasih clue paling aneh.', 'dare');
